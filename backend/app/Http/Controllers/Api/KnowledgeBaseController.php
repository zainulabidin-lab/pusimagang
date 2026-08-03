<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\KnowledgeBase;
use Illuminate\Http\Request;

class KnowledgeBaseController extends Controller
{
    public function index()
    {
        $kbs = KnowledgeBase::all()->groupBy('category');
        return response()->json(['data' => $kbs]);
    }
}
