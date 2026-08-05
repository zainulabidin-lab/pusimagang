<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;

class AnnouncementController extends Controller
{
    public function index(): JsonResponse
    {
        $announcements = Announcement::with('user:id,name')
            ->orderBy('created_at', 'desc')
            ->get();
            
        // Map data to expected format with 'date' string if needed
        $data = $announcements->map(function ($ann) {
            return [
                'id' => $ann->id,
                'title' => $ann->title,
                'message' => $ann->message,
                'type' => $ann->type,
                'date' => $ann->created_at->format('Y-m-d H:i'),
                'author' => $ann->user ? $ann->user->name : 'System',
            ];
        });

        return $this->sendSuccess($data);
    }

    public function store(Request $request): JsonResponse
    {
        if ($request->user()->role === 'intern') {
            return $this->sendError('Unauthorized', 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'type' => 'required|in:info,warning,success,danger',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error', 422, $validator->errors()->toArray());
        }

        $announcement = Announcement::create([
            'title' => $request->title,
            'message' => $request->message,
            'type' => $request->type,
            'user_id' => $request->user()->id,
        ]);

        return $this->sendSuccess($announcement, 'Announcement created successfully', 201);
    }

    public function destroy(Request $request, $id): JsonResponse
    {
        if ($request->user()->role === 'intern') {
            return $this->sendError('Unauthorized', 403);
        }

        $announcement = Announcement::findOrFail($id);
        
        if ($request->user()->role !== 'admin' && $announcement->user_id !== $request->user()->id) {
            return $this->sendError('Unauthorized to delete this announcement', 403);
        }

        $announcement->delete();

        return $this->sendSuccess(null, 'Announcement deleted successfully');
    }
}
