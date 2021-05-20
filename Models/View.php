<?php

namespace WebApps\Apps\StaffDirectory\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use WebApps\Apps\StaffDirectory\Controllers\AppManagerController;

class View extends Model
{
    protected $fillable = [
        'name',
        'owner',
        'settings',
        'publicId',
        'display',
        'display_type'
    ];

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);

        $this->table = AppManagerController::viewsTable();
    }

    /**
     * Allows finding by public ID
     */
    public function scopeFindByPublicId($query, $publicId)
    {
        return $query->where('publicId', '=', $publicId);
    }

    public function person()
    {
        return $this->belongsTo(
            User::class,
            'owner'
        );
    }
}
