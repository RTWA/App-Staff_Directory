<?php

namespace WebApps\Apps\StaffDirectory\Controllers;

use App\Http\Controllers\AppsController;
use App\Http\Controllers\MSGraphController;
use Illuminate\Http\Request;
use RobTrehy\LaravelApplicationSettings\ApplicationSettings;
use WebApps\Apps\StaffDirectory\Models\AzureMapFields;
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
        $mapping = AzureMapFields::where('local_field', '=', $request->input('local_field'))->firstOrFail();
        $mapping->azure_field = $request->input('azure_field');
        $mapping->save();

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

        foreach ($persons as $person) {
            $skip = false;

            if (!in_array($person->toArray(), $this->managedPersons)) {
                // No longer exists in a Synced Azure Group - Delete
                $person->delete();
                $skip = true;
            }

            if (!$skip) {
                $fields = [
                    'givenName',
                    'surname',
                    'userPrincipalName',
                    'employeeId',
                    'mail',
                    'jobTitle',
                    'businessPhones',
                    'department',
                    'accountEnabled',
                ];

                $azUser = $this->graphController->getGraphAPI(
                    'users/' . $person['azure_id'] . '?$select=' . implode(',', $fields),
                    $token
                );

                if ($person->forename !== $azUser['givenName']) {
                    $person->forename = $azUser['givenName'];
                }
                if ($person->surname !== $azUser['surname']) {
                    $person->surname = $azUser['surname'];
                }
                if ($person->username !== $azUser['userPrincipalName']) {
                    $person->username = $azUser['userPrincipalName'];
                }
                if ($person->employee_id !== $azUser['employeeId']) {
                    $person->employee_id = $azUser['employeeId'];
                }
                if ($person->email !== $azUser['mail']) {
                    $person->email = $azUser['mail'];
                }
                if ($person->title !== $azUser['jobTitle']) {
                    $person->title = $azUser['jobTitle'];
                }
                if (count($azUser['businessPhones']) === 1) {
                    if ($person->phone !== $azUser['businessPhones'][0]) {
                        $person->phone = $azUser['businessPhones'][0];
                    }
                } else {
                    if ($person->phone !== null) {
                        $person->phone = null;
                    }
                }
                if (!$person->trashed() & !$azUser['accountEnabled']) {
                    $person->delete();
                }
                $person->save();

                $splitDeps = explode(' & ', $azUser['department']);

                foreach ($splitDeps as $department) {
                    $userDeps = explode(' - ', $department);
                    $createStore = [];
                    foreach ($userDeps as $i => $userDep) {
                        $userDep = trim($userDep);

                        $dep = Department::where('name', $userDep)->first();

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
        $skips = json_decode(ApplicationSettings::get('app.StaffDirectory.azure.skip_users', '[]'), true);

        if (!in_array($member['userPrincipalName'], $skips)) {
            $person = Person::withTrashed()
                ->where('azure_id', $member['id'])
                ->orWhere(function ($query) use ($member) {
                    $query->where('username', $member['userPrincipalName'])
                        ->whereNull('azure_id');
                })
                ->first();

            if (!$person) {
                // Create Person Record
                $person = Person::create([
                    'forename' => $member['givenName'],
                    'surname' => $member['surname'],
                    'username' => $member['userPrincipalName'],
                    'email' => $member['mail'],
                    'title' => $member['jobTitle'],
                    'onLeave' => false,
                    'isCover' => false,
                    'isSenior' => false,
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
}
