<?php

namespace WebApps\Apps\StaffDirectory\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use WebApps\Apps\StaffDirectory\Models\CustomField;

class CustomFieldController extends Controller
{
    public function all()
    {
        $fields = CustomField::all();

        foreach ($fields as $i => $field) {
            $fields[$i]['options'] = json_decode($field['options'], true);
        }

        return response()->json([
            'list' => $fields
        ], 200);
    }

    public function save(Request $request)
    {
        $custom = json_decode($request->input('fields'), true);

        foreach ($custom as $field) {
            $field['options'] = json_encode($field['options']);
            if (strpos($field['field'], 'custom') === false) {
                $field['field'] = "custom".rand();
            }

            if ($field['id'] === "new") {
                unset($field['id']);
                CustomField::create($field);
            } else {
                $custom = CustomField::find($field['id']);
                unset($field['id']);
                $custom->update($field);
            }
        }

        return $this->all();
    }
}
