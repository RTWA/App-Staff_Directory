<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your WebApps App. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

use Illuminate\Support\Facades\Route;

use WebApps\Apps\StaffDirectory\Controllers\DepartmentsController;
use WebApps\Apps\StaffDirectory\Controllers\PersonController;

Route::get('/view/depseed', [DepartmentsController::class, 'seed']);
Route::get('/view/perseed', [PersonController::class, 'seed']);

Route::view('/view', 'StaffDirectory::index');
Route::view('/view/{any}', 'StaffDirectory::index')->where('any', '.*');
