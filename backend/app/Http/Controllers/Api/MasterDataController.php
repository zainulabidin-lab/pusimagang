<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Division;
use App\Models\Major;
use App\Models\School;
use App\Models\TaskTemplate;
use Illuminate\Http\Request;

class MasterDataController extends Controller
{
    public function divisions()
    {
        return response()->json(['data' => Division::all()]);
    }

    public function schools()
    {
        return response()->json(['data' => School::all()]);
    }

    public function majors()
    {
        return response()->json(['data' => Major::all()]);
    }

    public function templates()
    {
        return response()->json(['data' => TaskTemplate::with('items')->get()]);
    }

    public function interns(Request $request)
    {
        $query = \App\Models\User::where('role', 'intern')->where('is_approved', true);
        return response()->json(['data' => $query->get(['id', 'name'])]);
    }

    public function competencies()
    {
        return response()->json(['data' => \App\Models\Competency::all(['id', 'name'])]);
    }
}
