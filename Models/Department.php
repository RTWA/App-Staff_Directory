<?php

namespace WebApps\Apps\StaffDirectory\Models;

use Illuminate\Database\Eloquent\Model;
use WebApps\Apps\StaffDirectory\Controllers\AppManagerController;
use WebApps\Apps\StaffDirectory\Models\Person;

class Department extends Model
{
    protected $fillable = [
        'name',
        'head_id',
        'department_id'
    ];

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
        
        $this->table = AppManagerController::departmentsTable();
    }

    public function people()
    {
        return $this->belongsToMany(
            Person::class,
            AppManagerController::peopleDepartmentsTable(),
            'department_id',
            'person_id'
        );
    }

    public function children()
    {
        return $this->hasMany(
            static::class,
            'department_id'
        )->with('parent');
    }

    public function parent()
    {
        return $this->belongsTo(
            static::class,
            'department_id'
        );
    }
}
