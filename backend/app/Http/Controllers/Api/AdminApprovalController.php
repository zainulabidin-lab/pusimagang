<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AdminApprovalController extends Controller
{
    public function pendingInterns(Request $request)
    {
        if ($request->user()->role === 'intern') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $interns = User::where('role', 'intern')
            ->where('is_approved', false)
            ->with(['internProfile.school', 'internProfile.major'])
            ->get();

        return response()->json(['data' => $interns]);
    }

    public function approveIntern(Request $request, $id)
    {
        if ($request->user()->role === 'intern') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $user = User::findOrFail($id);
        
        $request->validate([
            'mentor_id' => 'required|exists:users,id',
            'division_id' => 'required|exists:divisions,id',
        ]);

        $user->is_approved = true;
        $user->save();

        if ($user->internProfile) {
            $user->internProfile->mentor_id = $request->mentor_id;
            $user->internProfile->division_id = $request->division_id;
            $user->internProfile->save();
        }

        return response()->json(['message' => 'Akun berhasil disetujui.']);
    }
}
