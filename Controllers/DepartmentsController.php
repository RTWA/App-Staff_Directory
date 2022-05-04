<?php

namespace WebApps\Apps\StaffDirectory\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use WebApps\Apps\StaffDirectory\Database\Seeders\DepartmentSeeder;
use WebApps\Apps\StaffDirectory\Models\Department;

class DepartmentsController extends Controller
{
    public function create(Request $request)
    {
        Department::create($request->input());

        return $this->all();
    }

    public function delete(Department $department)
    {
        $department->delete();

        return $this->all();
    }

    public function all()
    {
        return response()->json([
            'departments' => Department::withCount('people')
                ->withCount('children')
                ->with('children')
                ->with('people')
                ->with('children.people')
                ->whereNull('department_id')
                ->orderBy('name', 'ASC')
                ->get()
        ], 200);
    }

    public function list()
    {
        return response()->json([
            'list' => Department::with('children')
                ->whereNull('department_id')
                ->orderBy('name', 'ASC')
                ->get()
        ], 200);
    }

    public function update(Department $department, Request $request)
    {
        $department->name = $request->input('name');
        $department->department_id = ($request->input('department_id') !== 'null')
            ? $request->input('department_id') : $department->department_id;
        $department->head_id = ($request->input('head_id') !== 'null')
            ? $request->input('head_id') : $department->head_id;
        $department->save();

        return response()->json([
            'departments' => Department::withCount('people')
                ->withCount('children')
                ->with('children')
                ->with('people')
                ->with('children.people')
                ->whereNull('department_id')
                ->orderBy('name', 'ASC')
                ->get()
        ], 200);
    }

    public function setHead(Department $department, $head_id)
    {
        $department->head_id = $head_id;
        $department->save();

        return response()->json(['message' => 'Successfully updated department head'], 200);
    }

    public function seed()
    {
        (new DepartmentSeeder())->run();
    }
}
