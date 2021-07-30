<?php

namespace WebApps\Apps\StaffDirectory\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use WebApps\Apps\StaffDirectory\Models\Person;

class PhotoController extends Controller
{
    public function getPersonPhoto($id)
    {
        $person = Person::withTrashed()->find($id);

        if ($person->azure_id) {
            $photo = $this->graphController->getUserPhoto($person->azure_id);
        
            if ($photo) {
                return response(base64_decode($photo))->header('Content-Type', 'image/png');
            }
        } else if ($person->local_photo) {
            $photo = Storage::disk('public')->get($person->local_photo);
            return response($photo)->header('Content-Type', 'image/png');
        }

        return response('', 204);
    }

    public function store(Request $request, Person $person)
    {
        $file = $request->file('file');
        $storageName = 'apps/StaffDirectory/' . $person->username . '.' . $file->extension();
        Storage::disk('public')->put($storageName, File::get($file));

        $person->local_photo = $storageName;
        $person->save();

        return response()->json(['local_photo' => $person->local_photo], 201);
    } 
}
