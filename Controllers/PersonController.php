<?php

namespace WebApps\Apps\StaffDirectory\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use RobTrehy\LaravelApplicationSettings\ApplicationSettings;
use WebApps\Apps\StaffDirectory\Database\Seeders\PersonSeeder;
use WebApps\Apps\StaffDirectory\Mail\RecordCreatedMail;
use WebApps\Apps\StaffDirectory\Mail\RecordDeletedMail;
use WebApps\Apps\StaffDirectory\Models\Department;
use WebApps\Apps\StaffDirectory\Models\Person;

class PersonController extends Controller
{
    public function peopleList()
    {
        $people = Person::select('id', 'forename', 'surname')->orderBy('surname', 'ASC')->get();
        $list = [['value' => '', 'label' => 'Create new record...']];
        foreach ($people as $person) {
            $list[] = ['value' => $person->id, 'label' => $person->surname.', '.$person->forename];
        }

        return response()->json(['list' => $list], 200);
    }

    public function trashedPeople()
    {
        return response()->json([
            'people' => Person::onlyTrashed()->select('id', 'forename', 'surname')->orderBy('surname', 'ASC')->get()
        ], 200);
    }
    
    public function me()
    {
        $data = Person::with('departments')->where('username', Auth::user()->username)->first();

        if ($data === null) {
            return response()->json(['message' => 'No matching user found'], 200);
        }

        return response()->json(['data' => $data], 200);
    }

    public function get($id)
    {
        return response()->json(['person' => Person::with('departments')->find($id)], 200);
    }

    public function save(Request $request, $id)
    {
        $person = json_decode($request->input('person'), true);
        $departments = $person['departments'];
        $custom = $person['customFields'];
        unset($person['id']);
        unset($person['created_at']);
        unset($person['update_at']);
        unset($person['deleted_at']);
        unset($person['departments']);
        unset($person['departmentString']);
        $person['startDate'] = isset($person['startDate']) ? $person['startDate'] : date('Y-m-d');

        if ($id <> 0) {
            Person::find($id)->update($person);
            $current = Person::with('departments')->find($id);
        } else {
            $current = Person::create($person)->load('departments');
        }

        // Update Departments
        $deps = [];
        foreach ($departments as $department) {
            if (isset($department['id'])) {
                $deps[] = $department['id'];
                $_dep = Department::find($department['id']);
                $_dep->head_id = $department['head_id'];
                $_dep->save();
            }
        }
        $current->departments()->sync($deps);
        
        // Update Custom Fields
        if (!empty($custom[0])) {
            foreach ($custom as $field => $value) {
                $oldValue = DB::table(AppManagerController::PeopleCustomFieldsTable())
                    ->where('field', $field)
                    ->where('person_id', $current->id)
                    ->value('value');
                if ($oldValue <> null && $oldValue <> $value && $value <> '') {
                    DB::table(AppManagerController::PeopleCustomFieldsTable())
                    ->where('field', $field)
                    ->where('person_id', $current->id)
                    ->update(['value' => $value]);
                } elseif ($oldValue <> $value && $value === '') {
                    DB::table(AppManagerController::PeopleCustomFieldsTable())
                    ->where('field', $field)
                    ->where('person_id', $current->id)
                    ->delete();
                } elseif ($oldValue === null && $value <> '') {
                    DB::table(AppManagerController::PeopleCustomFieldsTable())->insert([
                    'field' => $field,
                    'person_id' => $current->id,
                    'value' => $value,
                ]);
                }
            }
        }
        
        if ((int)$id === 0 && ApplicationSettings::get('app.StaffDirectory.newRecord.sendNotification') === 'true') {
            Mail::to(ApplicationSettings::get('app.StaffDirectory.newRecord.notifyTo'))
                ->send(new RecordCreatedMail($current));
        }

        return response()->json(['message' => 'Record saved successfully'], 201);
    }

    public function removeFromDepartment($person, $department)
    {
        Person::find($person)->departments()->detach($department);

        return response()->json(['message' => 'Successfully removed from department'], 201);
    }

    public function delete($id)
    {
        // Delete Custom Fields
        DB::table(AppManagerController::PeopleCustomFieldsTable())->where('person_id', $id)->delete();
        Person::find($id)->delete();

        if (ApplicationSettings::get('app.StaffDirectory.deleteRecord.sendNotification') === "true") {
            Mail::to(ApplicationSettings::get('app.StaffDirectory.deleteRecord.notifyTo'))
                ->send(new RecordDeletedMail(Person::onlyTrashed()->find($id)));
        }

        return response()->json([
            'message' => 'Record deleted successfully'
        ], 200);
    }

    public function restore($id)
    {
        Person::onlyTrashed()->find($id)->restore();

        return response()->json([
            'message' => 'Record restored successfully'
        ], 200);
    }

    public function deleteTrashed()
    {
        Person::onlyTrashed()->forceDelete();

        return response()->json([
            'people' => Person::onlyTrashed()->select('id', 'forename', 'surname')->orderBy('surname', 'ASC')->get()
        ], 200);
    }

    public function seed()
    {
        (new PersonSeeder())->run();
    }
}
