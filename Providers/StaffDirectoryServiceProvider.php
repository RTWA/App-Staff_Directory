<?php

namespace WebApps\Apps\StaffDirectory\Providers;

use App\Models\App;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Route;
use WebApps\Apps\StaffDirectory\Commands\StaffDirectoryAzureSync;
use WebApps\Apps\StaffDirectory\Commands\StaffDirectoryCheckLastSyncTime;
use WebApps\Apps\StaffDirectory\Commands\StaffDirectoryDeleteTrash;

class StaffDirectoryServiceProvider extends ServiceProvider
{
    /**
     * The namespace for this App's Controllers
     *
     * @var string
     */
    protected $namespace = 'WebApps\Apps\StaffDirectory\Controllers';

    /**
     * Define your route model bindings, pattern filters, etc.
     *
     * @return void
     */
    public function boot()
    {
        // Find files that are required by this app
        $folders = [
            "Commands",
            "Controllers",
            "Models",
            "Mail",
            "Database/Seeders",
            "Database/Factories"
        ];

        foreach ($folders as $folder) {
            foreach (GLOB(__DIR__.'/../'.$folder.'/*.php') as $file) {
                $className = str_replace(__DIR__.'/../'.$folder.'/', '', str_replace('.php', '', $file));
                if (class_exists($this->namespace.'\\'.$className)) {
                    continue;
                }
                include $file;
            }
        }
        // Add the Apps views
        $this->loadViewsFrom(__DIR__.'/../Views', "StaffDirectory");
        // Add the Apps Commands
        $this->loadCommands();
    }

    /**
     * Define the routes for your App
     *
     * @return void
     */
    public function map()
    {
        $this->mapWebRoutes();
        $this->mapApiRoutes();
    }

    /**
     * Define the "web" routes for your App.
     *
     * @return void
     */
    protected function mapWebRoutes()
    {
        Route::group([
            'middleware' => 'web',
            'namespace' => $this->namespace,
            'prefix' => 'apps/StaffDirectory'
        ], function () {
            require App::path() . 'StaffDirectory/Routes/web.php';
        });
    }

    /**
     * Define the "api" routes for your App.
     *
     * @return void
     */
    protected function mapApiRoutes()
    {
        Route::group([
            'middleware' => 'api',
            'namespace' => $this->namespace,
            'prefix' => 'api/apps/StaffDirectory'
        ], function () {
            require App::path() . 'StaffDirectory/Routes/api.php';
        });
    }

    private function loadCommands()
    {
        if ($this->app->runningInConsole()) {
            $this->commands([
                StaffDirectoryAzureSync::class,
                StaffDirectoryCheckLastSyncTime::class,
                StaffDirectoryDeleteTrash::class,
            ]);
        }
    }
}
