<?php

namespace WebApps\Apps\StaffDirectory\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Plugin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use WebApps\Apps\StaffDirectory\Models\Department;
use WebApps\Apps\StaffDirectory\Models\Person;
use WebApps\Apps\StaffDirectory\Models\View;

class ViewController extends Controller
{
    public function mine()
    {
        return response()->json([
            'views' => View::where('owner', Auth::user()->id)->get()
        ], 200);
    }

    public function get($publicId)
    {
        $view = View::findByPublicId($publicId)->first();

        if ($view === null) {
            return response()->json([
                'message' => "View ($publicId) not found. Please check and try again."
            ], 500);
        }

        return response()->json([
            'view' => $view
        ], 200);
    }

    public function data(Request $request)
    {
        $view = json_decode($request->input('view'), true);

        if ($view['display'] === "department") {
            $data = Department::with(['people' => function ($query) {
                $query->orderBy('people.surname', 'ASC');
            }])->with('people.departments')->where('id', $view['settings']['department'])->first();
            $people = $data['people'];
        } elseif ($view['display'] === "person") {
            $people = Person::with('departments')->where('id', $view['settings']['person'])->get();
        } elseif ($view['display'] === "all") {
            $people = Person::with('departments')->orderBy('startDate', 'DESC')->get();
        } elseif (strpos($view['display'], 'custom') !== false) {
            $people = array_values(Person::with('departments')->get()->filter(function ($person) use ($view) {
                return $person->customFields[$view['display']] === $view['settings'][$view['display']];
            })->toArray());
        } else {
            $people = Person::with('departments')->where($view['display'], $view['settings'][$view['display']])->get();
        }

        return response()->json([
            'people' => $people,
            'departments' => Department::with('children')->whereNull('department_id')->get(),
            'me' => (Auth::check()) ? Person::with('departments')->where('username', Auth::user()->username)->first() : null
        ], 200);
    }

    public function save($publicId, Request $request)
    {
        $view = json_decode($request->input('view'), true);
        unset($view['id']);
        unset($view['created_at']);
        unset($view['updated_at']);

        if ($view['display_type'] <> "table") {
            unset($view['settings']['fields']);
        }
        $view['settings'] = json_encode($view['settings']);

        if ($publicId <> "new") {
            View::findByPublicId($publicId)->update($view);
        } else {
            $view['owner'] = Auth::user()->id;
            $view['publicId'] = Plugin::generatePublicId();
            View::create($view);
        }
        
        return response()->json([
            'message' => 'Record saved successfully'
        ], 201);
    }
}
