<?php

namespace WebApps\Apps\StaffDirectory\Controllers;

use App\Http\Controllers\AppsController;
use App\Http\Controllers\MSGraphController;
use Illuminate\Http\Request;
use RobTrehy\LaravelApplicationSettings\ApplicationSettings;
use WebApps\Apps\StaffDirectory\Models\AzureMapFields;
use WebApps\Apps\StaffDirectory\Models\CustomField;
use WebApps\Apps\StaffDirectory\Models\Department;
use WebApps\Apps\StaffDirectory\Models\Person;

class MasterController extends AppsController
{
    private $graphController;
    private $azureMapFields;

    private $managedPersons = [];

    public function __construct()
    {
        $this->graphController = new MSGraphController();
        $this->azureMapFields = AzureMapFields::all();
    }

    public function getAzureMapFields()
    {
        return response()->json($this->azureMapFields->toArray(), 200);
    }

    public function setAzureMapField(Request $request)
    {
        $mapping = AzureMapFields::where('local_field', '=', $request->input('local_field'))->first();
        if (!$mapping) {
            $mapping = AzureMapFields::create([
                'local_field' => $request->input('local_field'),
                'azure_field' => $request->input('azure_field')
            ]);
        } else {
            $mapping->azure_field = $request->input('azure_field');
            $mapping->save();
        }

        $this->azureMapFields = AzureMapFields::all();

        return response()->json(['message' => 'Mapping updated successfully!', 'mappings' => $this->azureMapFields->toArray()], 201);
    }

    public function syncAzure()
    {
        // Check Azure Tenant ID is set
        $tenant = ApplicationSettings::get('azure.graph.tenant');
        if (!$tenant) {
            abort(500, 'Azure Tenant ID is not set!');
        }

        $token = json_decode($this->graphController->getAccessToken()->content(), true)['token']['access_token'];
        $syncGroups = json_decode(ApplicationSettings::get('app.StaffDirectory.azure.sync_groups'), true);
        $createDepartments = ApplicationSettings::get('app.StaffDirectory.azure.create_departments');

        foreach ($syncGroups as $group) {
            $this->syncGroupMembers($token, $group['id']);
        }

        $persons = Person::withTrashed()->with('departments')->whereNotNull('azure_id')->get();

        $mappings = [];
        foreach ($this->azureMapFields as $mapField) {
            $mappings[$mapField->local_field] = $mapField->azure_field;
        }

        foreach ($persons as $person) {
            $skip = false;

            if (!in_array($person->toArray(), $this->managedPersons)) {
                // No longer exists in a Synced Azure Group - Delete
                $person->delete();
                $skip = true;
            }

            if (!$skip) {
                $azUser = $this->graphController->getGraphAPI(
                    'users/' . $person['azure_id'] . '?$select=' . implode(',', $this->sanatizeMappings()) . ',department,accountEnabled',
                    $token
                );

                if ($person->forename !== $this->getAzureMemberField($azUser, $mappings['forename']) && $mappings['forename'] !== 'do_not_sync') {
                    $person->forename = $this->getAzureMemberField($azUser, $mappings['forename']);
                }
                if ($person->surname !== $this->getAzureMemberField($azUser, $mappings['surname']) && $mappings['surname'] !== 'do_not_sync') {
                    $person->surname = $this->getAzureMemberField($azUser, $mappings['surname']);
                }
                if ($person->username !== $this->getAzureMemberField($azUser, $mappings['username']) && $mappings['username'] !== 'do_not_sync') {
                    $person->username = $this->getAzureMemberField($azUser, $mappings['username']);
                }
                if ($person->employee_id !== $this->getAzureMemberField($azUser, $mappings['employee_id']) && $mappings['employee_id'] !== 'do_not_sync') {
                    $person->employee_id = $this->getAzureMemberField($azUser, $mappings['employee_id']);
                }
                if ($person->email !== $this->getAzureMemberField($azUser, $mappings['email']) && $mappings['email'] !== 'do_not_sync') {
                    $person->email = $this->getAzureMemberField($azUser, $mappings['email']);
                }
                if ($person->startDate !== $this->getAzureMemberField($azUser, $mappings['startDate'], 'date') && $mappings['startDate'] !== 'do_not_sync') {
                    $person->startDate = $this->getAzureMemberField($azUser, $mappings['startDate'], 'date');
                }
                if ($person->title !== $this->getAzureMemberField($azUser, $mappings['title']) && $mappings['title'] !== 'do_not_sync') {
                    $person->title = $this->getAzureMemberField($azUser, $mappings['title']);
                }
                if ($person->phone !== $this->getAzureMemberField($azUser, $mappings['phone']) && $mappings['phone'] !== 'do_not_sync') {
                    $person->phone = $this->getAzureMemberField($azUser, $mappings['phone']);
                }
                if ($person->onLeave !== $this->getAzureMemberField($azUser, $mappings['onLeave'], 'bool') && $mappings['onLeave'] !== 'do_not_sync') {
                    $person->onLeave = $this->getAzureMemberField($azUser, $mappings['onLeave'], 'bool');
                }
                if ($person->isCover !== $this->getAzureMemberField($azUser, $mappings['isCover'], 'bool') && $mappings['isCover'] !== 'do_not_sync') {
                    $person->isCover = $this->getAzureMemberField($azUser, $mappings['isCover'], 'bool');
                }
                if ($person->isSenior !== $this->getAzureMemberField($azUser, $mappings['isSenior'], 'bool') && $mappings['isSenior'] !== 'do_not_sync') {
                    $person->isSenior = $this->getAzureMemberField($azUser, $mappings['isSenior'], 'bool');
                }
                if (!$person->trashed() & !$azUser['accountEnabled']) {
                    $person->delete();
                }
                $this->syncCustomFields($mappings, $azUser, $person->id);
                $person->departments()->detach();
                $person->save();

                $splitDeps = explode(' & ', $azUser['department']);

                foreach ($splitDeps as $department) {
                    $userDeps = explode(' - ', $department);
                    $createStore = [];
                    foreach ($userDeps as $i => $userDep) {
                        $userDep = trim($userDep);

                        $dep = Department::where('name', $userDep)->whereNull('department_id')->first();

                        if (!$dep) {
                            $dep = Department::where('name', $userDep)->where('department_id', $createStore[$i - 1])->first();
                        }

                        if (!$dep && $createDepartments === 'true') {
                            // Create a department
                            $department = Department::create([
                                'name' => $userDep,
                                'department_id' => ($i !== 0) ? $createStore[$i - 1] : null,
                            ]);
                            $createStore[$i] = $department->id;
                        } else {
                            $createStore[$i] = ($dep) ? $dep->id : null;
                        }

                        if (count($userDeps) === $i + 1) {
                            $person->departments()->syncWithoutDetaching($createStore[$i]);
                        }
                    }
                }
            }
        }

        ApplicationSettings::set('app.StaffDirectory.azure.last_sync', new \DateTime());
    }

    private function syncCustomFields($mappings, $azUser, $person_id)
    {
        $cf = CustomField::where('person_id', $person_id)->get();

        foreach ($cf as $custom) {
            if (
                isset($mappings[$custom->field]) &&
                $custom->value !== $this->getAzureMemberField($azUser, $mappings[$custom->field]) &&
                $mappings[$custom->field] !== 'do_not_sync'
            ) {
                $custom->value = $this->getAzureMemberField($azUser, $mappings[$custom->field]);
            }
        }
    }

    private function syncGroupMembers($token, $id)
    {
        $data = $this->graphController->getGraphAPI("groups/" . $id . "/members", $token);
        $this->processGroupMembers($token, $data['value']);

        if (isset($data['@odata.nextLink'])) {
            $this->syncMoreGroupMembers($token, $data['@odata.nextLink']);
        }
    }

    private function syncMoreGroupMembers($token, $nextLink)
    {
        $data = $this->graphController->getGraphAPI(str_replace('https://graph.microsoft.com/v1.0/', '', $nextLink), $token);
        $this->processGroupMembers($token, $data['value']);

        if (isset($data['@odata.nextLink'])) {
            $this->syncMoreGroupMembers($token, $data['@odata.nextLink']);
        }
    }

    private function processGroupMembers($token, $groupMembers)
    {
        foreach ($groupMembers as $member) {
            if ($member['@odata.type'] === "#microsoft.graph.group") {
                $this->syncGroupMembers($token, $member['id']);
            } else {
                $this->createOrUpdateMember($member);
            }
        }
    }

    private function createOrUpdateMember($member)
    {
        $mappings = [];
        foreach ($this->azureMapFields as $mapField) {
            $mappings[$mapField->local_field] = $mapField->azure_field;
        }

        $skips = json_decode(ApplicationSettings::get('app.StaffDirectory.azure.skip_users', '[]'), true);

        if (!in_array($member[$mappings['username']], $skips)) {
            $person = Person::withTrashed()
                ->where('azure_id', $member['id'])
                ->orWhere(function ($query) use ($member, $mappings) {
                    $query->where('username', $member[$mappings['username']])
                        ->whereNull('azure_id');
                })
                ->first();

            if (!$person) {
                // Create Person Record
                $person = Person::create([
                    'forename' => $this->getAzureMemberField($member, $mappings['forename']),
                    'surname' => $this->getAzureMemberField($member, $mappings['surname']),
                    'username' => $this->getAzureMemberField($member, $mappings['username']),
                    'employee_id' => $this->getAzureMemberField($member, $mappings['employee_id']),
                    'email' => $this->getAzureMemberField($member, $mappings['email']),
                    'title' => $this->getAzureMemberField($member, $mappings['title']),
                    'startDate' => $this->getAzureMemberField($member, $mappings['startDate'], 'date'),
                    'phone' => $this->getAzureMemberField($member, $mappings['phone']),
                    'onLeave' => $this->getAzureMemberField($member, $mappings['onLeave'], 'bool'),
                    'isCover' => $this->getAzureMemberField($member, $mappings['isCover'], 'bool'),
                    'isSenior' => $this->getAzureMemberField($member, $mappings['isSenior'], 'bool'),
                    'azure_id' => $member['id'],
                ]);
            }

            if ($person->azure_id !== $member['id']) {
                $person->azure_id = $member['id'];
                $person->save();
            }

            if ($person->trashed()) {
                $person->restore();
            }

            $this->managedPersons[] = $person->toArray();
        }
    }

    private function getAzureMemberField($member, $field, $type = '')
    {
        if ($field === 'do_not_sync') {
            if ($type === 'bool') {
                return 0;
            }
            if ($type === 'date') {
                return null;
            }
            return '';
        }

        if (strpos($field, 'extensionAttribute') === 0) {
            $value = isset($member['onPremisesExtensionAttributes']) ? $member['onPremisesExtensionAttributes'][$field] : '';
        } else {
            $value = $member[$field];
        }

        if (is_array($value)) {
            if (count($value) > 0) {
                $value = $value[0];
            } else {
                $value = '';
            }
        }

        if ($type === 'date') {
            return date("Y-m-d H:i:s", strtotime($value));
        }
        if ($type === 'bool') {
            if ($value === 'true' || $value === 'yes') {
                return 1;
            } else {
                return 0;
            }
        }

        return $value;
    }

    private function sanatizeMappings()
    {
        $fields = [];
        foreach ($this->azureMapFields as $mapField) {
            if ($mapField->azure_field !== 'do_not_sync') {
                if (strpos($mapField->azure_field, 'extensionAttribute') !== 0) {
                    $fields[] = $mapField->azure_field;
                } elseif (!in_array('onPremisesExtensionAttributes', $fields)) {
                    $fields[] = 'onPremisesExtensionAttributes';
                }
            }
        }

        return $fields;
    }
}
