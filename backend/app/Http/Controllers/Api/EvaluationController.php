<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Evaluation;
use App\Models\User;
use Illuminate\Http\Request;

class EvaluationController extends Controller
{
    public function index(Request $request)
    {
        $query = Evaluation::with(['intern', 'mentor']);
        if ($request->user()->role === 'intern') {
            $query->where('intern_id', $request->user()->id);
        } elseif ($request->user()->role === 'mentor') {
            $query->where('mentor_id', $request->user()->id);
        }
        return response()->json(['data' => $query->latest()->get()]);
    }

    public function store(Request $request)
    {
        if ($request->user()->role !== 'mentor' && $request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $data = $request->validate([
            'intern_id' => 'required|exists:users,id',
            'technical_score' => 'required|integer|min:0|max:100',
            'communication_score' => 'required|integer|min:0|max:100',
            'discipline_score' => 'required|integer|min:0|max:100',
            'problem_solving_score' => 'required|integer|min:0|max:100',
            'notes' => 'nullable|string',
        ]);

        $data['mentor_id'] = $request->user()->id;
        
        // Calculate final grade based on average
        $average = ($data['technical_score'] + $data['communication_score'] + $data['discipline_score'] + $data['problem_solving_score']) / 4;
        
        if ($average >= 85) $data['final_grade'] = 'A';
        elseif ($average >= 70) $data['final_grade'] = 'B';
        elseif ($average >= 55) $data['final_grade'] = 'C';
        else $data['final_grade'] = 'D';

        $evaluation = Evaluation::create($data);

        return response()->json(['message' => 'Penilaian berhasil disimpan', 'data' => $evaluation], 201);
    }
}
