<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\InternProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class RegisterController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'school_name' => 'required|string|max:255',
            'major_name' => 'required|string|max:255',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'intern',
            'is_approved' => false,
        ]);

        InternProfile::create([
            'user_id' => $user->id,
            'school_name' => $request->school_name,
            'major_name' => $request->major_name,
            'status' => 'active', // Active profile but user needs approval
        ]);

        return response()->json([
            'message' => 'Pendaftaran berhasil. Silakan tunggu persetujuan dari Admin.',
        ], 201);
    }
}
