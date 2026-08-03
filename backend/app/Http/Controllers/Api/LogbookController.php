<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DailyLogbook;
use Illuminate\Http\Request;

class LogbookController extends Controller
{
    public function index(Request $request)
    {
        $query = DailyLogbook::with('intern');
        
        if ($request->user()->role === 'intern') {
            $query->where('intern_id', $request->user()->id);
        } elseif ($request->user()->role === 'mentor') {
            // Mentor sees logbooks of interns assigned to them
            $query->whereHas('intern.internProfile', function ($q) use ($request) {
                $q->where('mentor_id', $request->user()->id);
            });
        }

        return response()->json(['data' => $query->orderBy('date', 'desc')->get()]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i',
            'activity' => 'required|string',
            'result' => 'nullable|string',
            'obstacle' => 'nullable|string',
            'mood' => 'required|in:great,good,okay,bad,stressed',
            'documentation_photo' => 'nullable|image|mimes:jpeg,png,jpg|max:5120',
        ]);

        $data['time'] = $data['start_time'];

        if ($request->hasFile('documentation_photo')) {
            $path = $request->file('documentation_photo')->store('logbooks', 'public');
            $data['documentation_path'] = '/storage/' . $path;
        }

        $data['intern_id'] = $request->user()->id;

        $logbook = DailyLogbook::create($data);

        // Gamification: Add +2 points for filling logbook
        $internProfile = \App\Models\InternProfile::where('user_id', $request->user()->id)->first();
        if ($internProfile) {
            $internProfile->increment('points', 2);
            
            // Check badge
            $points = $internProfile->points;
            if ($points >= 500) $internProfile->update(['badge' => 'Legend']);
            elseif ($points >= 250) $internProfile->update(['badge' => 'Expert']);
            elseif ($points >= 100) $internProfile->update(['badge' => 'Pro']);
            elseif ($points >= 50) $internProfile->update(['badge' => 'Rising Star']);
        }

        return response()->json(['message' => 'Logbook berhasil disimpan', 'data' => $logbook], 201);
    }

    public function approve(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected',
            'mentor_notes' => 'nullable|string'
        ]);

        $logbook = DailyLogbook::findOrFail($id);
        
        // Ensure only mentor can approve
        if ($request->user()->role !== 'mentor' && $request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $logbook->update([
            'status' => $request->status,
            'mentor_notes' => $request->mentor_notes
        ]);

        // Send Notification to Intern
        $statusText = $request->status === 'approved' ? 'Disetujui' : 'Ditolak';
        \App\Models\Notification::create([
            'user_id' => $logbook->intern_id,
            'title' => 'Status Logbook Diperbarui',
            'message' => "Logbook tanggal {$logbook->date->format('d M Y')} telah {$statusText} oleh Mentor.",
            'type' => 'task_approved',
            'link' => '/logbook'
        ]);

        return response()->json(['message' => "Logbook berhasil di{$statusText}", 'data' => $logbook]);
    }
}
