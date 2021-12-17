<?php

namespace WebApps\Apps\StaffDirectory\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;
use WebApps\Apps\StaffDirectory\Controllers\AppManagerController;
use WebApps\Apps\StaffDirectory\Models\Department;

class Person extends Model
{
    use SoftDeletes;
    
    protected $fillable = [
        'forename',
        'surname',
        'username',
        'email',
        'title',
        'employee_id',
        'startDate',
        'phone',
        'onLeave',
        'isCover',
        'isSenior',
        'azure_id',
        'local_photo',
    ];

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);

        $this->table = AppManagerController::peopleTable();
    }

    protected $appends = ['departmentString', 'customFields'];

    public function departments()
    {
        return $this->belongsToMany(
            Department::class,
            AppManagerController::peopleDepartmentsTable(),
            'person_id',
            'department_id'
        );
    }

    public function getDepartmentStringAttribute()
    {
        $departments = $this->departments;
        $string = '';

        foreach ($departments as $department) {
            if ($department['department_id'] === null) {
                $string .= $department['name'] . ' / ';
            } else {
                $parent = Department::find($department['department_id']);
                $string .= $parent['name'] . ' - ' . $department['name'] . ' / ';
            }
        }

        return rtrim($string, " /");
    }

    public function getCustomFieldsAttribute()
    {
        $fields = [];

        foreach (CustomField::all() as $custom) {
            $fields[$custom['field']] = DB::table(AppManagerController::peopleCustomFieldsTable())
                                            ->where('field', $custom['field'])
                                            ->where('person_id', $this->id)
                                            ->value('value');
        }

        return $fields;
    }
}
