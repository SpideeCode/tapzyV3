<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        return User::with('restaurant')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'restaurant_id' => 'nullable|exists:restaurants,id',
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|in:admin,staff,manager'
        ]);

        $data['password'] = Hash::make($data['password']);
        return User::create($data);
    }

    public function show(User $user)
    {
        return $user->load('restaurant');
    }

    public function update(Request $request, User $user)
    {
        $user->update($request->except('password'));
        return $user;
    }

    public function destroy(User $user)
    {
        $user->delete();
        return response()->noContent();
    }
}
