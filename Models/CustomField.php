<?php

namespace WebApps\Apps\StaffDirectory\Models;

use Illuminate\Database\Eloquent\Model;
use WebApps\Apps\StaffDirectory\Controllers\AppManagerController;

class CustomField extends Model
{
    protected $fillable = [
        'field',
        'name',
        'label',
        'type',
        'options',
    ];

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);

        $this->table = AppManagerController::customFieldsTable();
    }
}
