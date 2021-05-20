<?php

namespace WebApps\Apps\StaffDirectory\Providers;

use App\Models\App;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Route;

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
        $folders = ["Controllers", "Models", "Database\\Seeders", "Database\\Factories"];
        foreach ($folders as $folder) {
            foreach (GLOB(__DIR__.'/../'.$folder.'/*.php') as $file) {
                $className = str_replace(__DIR__.'/../'.$folder.'/', '', str_replace('.php', '', $file));
                if ($folder === 'Controllers' && class_exists($this->namespace.'\\'.$className)) {
                    return;
                }
                include $file;
            }
        }
        // Add the Apps views
        $this->loadViewsFrom(__DIR__.'/../Views', "StaffDirectory");
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
            require App::path() . 'StaffDirectory/routes/web.php';
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
            require App::path() . 'StaffDirectory/routes/api.php';
        });
    }
}
