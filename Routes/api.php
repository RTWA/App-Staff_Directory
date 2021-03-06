<?php

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your WebApp App. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your App's API!
|
*/

use Illuminate\Support\Facades\Route;
use WebApps\Apps\StaffDirectory\Controllers\DepartmentsController;
use WebApps\Apps\StaffDirectory\Controllers\PersonController;
use WebApps\Apps\StaffDirectory\Controllers\ViewController;
use WebApps\Apps\StaffDirectory\Controllers\CustomFieldController;
use WebApps\Apps\StaffDirectory\Controllers\MasterController;
use WebApps\Apps\StaffDirectory\Controllers\PhotoController;

Route::get('/view/{publicId}', [ViewController::class, 'get']);
Route::post('/view', [ViewController::class, 'data']);

// These routes require authentication to access
Route::group(['middleware' => 'auth:sanctum'], function () {

    Route::get('/views', [ViewController::class, 'mine']);
    Route::post('/view/{publicId}', [ViewController::class, 'save']);
    Route::delete('/view/{publicId}', [ViewController::class, 'delete']);

    Route::get('/departments', [DepartmentsController::class, 'all']);
    Route::get('/departmentList', [DepartmentsController::class, 'list']);
    Route::put('/department/{department}', [DepartmentsController::class, 'update']);
    Route::post('/department', [DepartmentsController::class, 'create']);
    Route::delete('/department/{department}', [DepartmentsController::class, 'delete']);

    Route::get('/peopleList', [PersonController::class, 'peopleList']);
    Route::get('/person/me', [PersonController::class, 'me']);
    Route::get('/person/{id}', [PersonController::class, 'get']);
    Route::post('/person/{id}', [PersonController::class, 'save']);
    Route::post('/person/{id}/unlink', [PersonController::class, 'unlinkFromAzure']);

    Route::delete('/person/{id}', [PersonController::class, 'delete']);
    Route::get('/person/{id}/restore', [PersonController::class, 'restore']);
    Route::get('/people/trashed', [PersonController::class, 'trashedPeople']);
    Route::get('/people/trashed/delete', [PersonController::class, 'deleteTrashed']);

    Route::post('/person/{person}/photo', [PhotoController::class, 'store']);

    Route::delete('/person/{person}/department/{department}', [PersonController::class, 'removeFromDepartment']);
    Route::put('/department/{department}/head/{head_id}', [DepartmentsController::class, 'setHead']);

    Route::get('/customFields', [CustomFieldController::class, 'all']);
    Route::put('/customFields', [CustomFieldController::class, 'save']);

    Route::get('/azure/sync', [MasterController::class, 'syncAzure']);
    Route::get('/azure/mappings', [MasterController::class, 'getAzureMapFields']);
    Route::post('/azure/mapping', [MasterController::class, 'setAzureMapField']);

    Route::get('/departments/sample', [DepartmentsController::class, 'seed']);
    Route::get('/people/sample', [PersonController::class, 'seed']);
});
