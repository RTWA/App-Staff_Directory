<?php

namespace WebApps\Apps\StaffDirectory\Models;

use Illuminate\Database\Eloquent\Model;
use WebApps\Apps\StaffDirectory\Controllers\AppManagerController;

class AzureMapFields extends Model
{
    protected $fillable = [
        'local_field',
        'azure_field',
    ];

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);

        $this->table = AppManagerController::azureMapFieldsTable();

        $this->timestamps = false;
    }
}
