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
use WebApps\Apps\StaffDirectory\Controllers\PhotoController;

Route::get('/view/person/{id}/photo', [PhotoController::class, 'getPersonPhoto']);

Route::view('/view', 'StaffDirectory::index');
Route::view('/view/{any}', 'StaffDirectory::index')->where('any', '.*');
