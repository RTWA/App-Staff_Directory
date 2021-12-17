<?php

namespace WebApps\Apps\StaffDirectory\Controllers;

use App\Http\Controllers\AppManagerController as Controller;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class AppManagerController extends Controller
{
    private static $tablePrefix = "app_StaffDirectory_";
    
    public function __construct()
    {
        parent::__construct(json_decode(file_get_contents(__DIR__.'/../manifest.json'), true));
    }

    public function install()
    {
        if (!Schema::hasTable($this->viewsTable())) {
            Schema::create($this->viewsTable(), function (Blueprint $table) {
                $table->id();
                $table->string('name')->nullable();
                $table->foreignId('owner')->constrained('users')->delete('cascade');
                $table->text('settings')->nullable();
                $table->string('publicId');
                $table->string('display');
                $table->string('display_type');
                $table->timestamps();
            });
        }
        if (!Schema::hasTable($this->peopleTable())) {
            Schema::create($this->peopleTable(), function (Blueprint $table) {
                $table->id();
                $table->string('forename')->nullable();
                $table->string('surname')->nullable();
                $table->string('username')->nullable();
                $table->string('employee_id')->nullable();
                $table->string('email')->nullable();
                $table->string('title')->nullable();
                $table->date('startDate')->nullable();
                $table->string('phone')->nullable();
                $table->boolean('onLeave')->default(0);
                $table->boolean('isCover')->default(0);
                $table->boolean('isSenior')->default(0);
                $table->string('azure_id')->nullable();
                $table->string('local_photo')->nullable();
                $table->timestamps();
                $table->softDeletes();
            });
        }
        if (!Schema::hasTable($this->departmentsTable())) {
            Schema::create($this->departmentsTable(), function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->foreignId('head_id')->nullable()->constrained($this->peopleTable());
                $table->foreignId('department_id')
                    ->nullable()
                    ->constrained($this->departmentsTable())
                    ->delete('cascade');
                $table->timestamps();
            });
        }
        if (!Schema::hasTable($this->peopleDepartmentsTable())) {
            Schema::create($this->peopleDepartmentsTable(), function (Blueprint $table) {
                $table->id();
                $table->foreignId('person_id')->constrained($this->peopleTable())->delete('cascade');
                $table->foreignId('department_id')->constrained($this->departmentsTable())->delete('cascade');
            });
        }
        if (!Schema::hasTable($this->customFieldsTable())) {
            Schema::create($this->customFieldsTable(), function (Blueprint $table) {
                $table->id();
                $table->string('field')->unique();
                $table->string('label')->nullable();
                $table->string('type')->nullable();
                $table->text('options')->nullable();
                $table->timestamps();
            });
        }
        if (!Schema::hasTable($this->peopleCustomFieldsTable())) {
            Schema::create($this->peopleCustomFieldsTable(), function (Blueprint $table) {
                $table->id();
                $table->string('field')->constrained($this->customFieldsTable())->delete('cascade');
                $table->foreignId('person_id')->constrained($this->peopleTable())->delete('cascade');
                $table->text('value')->nullable();
            });
        }
        if (Schema::hasTable($this->viewsTable())) {
            DB::insert(
                'insert into '.$this->viewsTable().' 
                (name, owner, publicId, display, display_type, settings) values (?, ?, ?, ?, ?, ?)',
                [
                    'All Staff', //name
                    0, // owner
                    'all', // publicId
                    'all', // display
                    'all', // display_type
                     // settings
                    json_encode([
                        'perms' => [
                            "Standard Users" => true
                        ],
                        "leading" => true,
                        "selectors" => true,
                        "sorttext" => true
                    ])
                ]
            );
        }
        $this->createPermissions();
        $this->createSettings();
        $this->copyAppJS();
        $this->addScheduledTask();
    }

    public function uninstall()
    {
        Schema::dropIfExists($this->viewsTable());
        Schema::dropIfExists($this->peopleTable());
        Schema::dropIfExists($this->departmentsTable());
        Schema::dropIfExists($this->peopleDepartmentsTable());
        Schema::dropIfExists($this->customFieldsTable());
        Schema::dropIfExists($this->peopleCustomFieldsTable());
        $this->dropPermissions();
        $this->dropSettings();
        $this->dropAppJS();
        $this->dropScheduledTask();
    }

    private function copyAppJS()
    {
        $js = __DIR__.'/../public/StaffDirectory.js';
        $js2 = __DIR__.'/../public/StaffDirectory_view.js';
        $path = public_path("js/apps/");

        if (!file_exists($path)) {
            mkdir($path, 0777, true);
        }

        if (file_exists($path.$this->slug.'.js')) {
            unlink($path.$this->slug.'.js');
        }
        copy($js, $path.$this->slug.'.js');

        if (file_exists($path.$this->slug.'_view.js')) {
            unlink($path.$this->slug.'_view.js');
        }
        copy($js2, $path.$this->slug.'_view.js');
    }

    private function dropAppJS()
    {
        $path = public_path("js/apps/");
        if (file_exists($path.$this->slug.'.js')) {
            unlink($path.$this->slug.'.js');
        }
        if (file_exists($path.$this->slug.'_view.js')) {
            unlink($path.$this->slug.'_view.js');
        }
    }

    private function addScheduledTask()
    {
        if (!Schema::hasTable('apps_scheduler')) {
            abort(500, 'Apps scheduler table does not exist');
        }

        if (!DB::table('apps_scheduler')->where('command', '=', 'StaffDirectory:azure-sync')->first()) {
            DB::table('apps_scheduler')->insert([
                'app' => 'StaffDirectory',
                'command' => 'StaffDirectory:azure-sync',
                'last_run' => date('Y-m-d H:i:s'),
                'schedule' => '+30 minutes',
            ]);
        }

        if (!DB::table('apps_scheduler')->where('command', '=', 'StaffDirectory:check-last-sync-time')->first()) {
            DB::table('apps_scheduler')->insert([
                'app' => 'StaffDirectory',
                'command' => 'StaffDirectory:check-last-sync-time',
                'last_run' => date('Y-m-d H:00:00'),
                'schedule' => '+30 minutes',
            ]);
        }

        if (!DB::table('apps_scheduler')->where('command', '=', 'StaffDirectory:delete-trash')->first()) {
            DB::table('apps_scheduler')->insert([
                'app' => 'StaffDirectory',
                'command' => 'StaffDirectory:delete-trash',
                'last_run' => date('Y-m-d 00:00:00'),
                'schedule' => '+1 day',
            ]);
        }
    }

    private function dropScheduledTask()
    {
        if (!Schema::hasTable('apps_scheduler')) {
            abort(500, 'Apps scheduler table does not exist');
        }

        if (!DB::table('apps_scheduler')->where('command', '=', 'StaffDirectory:azure-sync')->first()) {
            DB::table('apps_scheduler')->where('command', '=', 'StaffDirectory:azure-sync')->delete();
        }
        
        if (!DB::table('apps_scheduler')->where('command', '=', 'StaffDirectory:check-last-sync-time')->first()) {
            DB::table('apps_scheduler')->where('command', '=', 'StaffDirectory:check-last-sync-time')->delete();
        }

        if (!DB::table('apps_scheduler')->where('command', '=', 'StaffDirectory:delete-trash')->first()) {
            DB::table('apps_scheduler')->where('command', '=', 'StaffDirectory:delete-trash')->delete();
        }
    }

    public static function viewsTable()
    {
        return self::$tablePrefix.'Views';
    }

    public static function peopleTable()
    {
        return self::$tablePrefix.'People';
    }

    public static function departmentsTable()
    {
        return self::$tablePrefix.'Departments';
    }

    public static function peopleDepartmentsTable()
    {
        return self::$tablePrefix.'People_Departments';
    }

    public static function customFieldsTable()
    {
        return self::$tablePrefix.'CustomFields';
    }

    public static function peopleCustomFieldsTable()
    {
        return self::$tablePrefix.'People_CustomFields';
    }
}
