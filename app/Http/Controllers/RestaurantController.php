<?php

namespace App\Http\Controllers;

use App\Models\Restaurant;
use Illuminate\Http\Request;

class RestaurantController extends Controller
{
    public function index()
    {
        return Restaurant::with(['users', 'tables', 'items'])->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate(['name' => 'required|string|max:100']);
        return Restaurant::create($data);
    }

    public function show(Restaurant $restaurant)
    {
        return $restaurant->load(['users', 'tables', 'items']);
    }

    public function update(Request $request, Restaurant $restaurant)
    {
        $restaurant->update($request->only('name'));
        return $restaurant;
    }

    public function destroy(Restaurant $restaurant)
    {
        $restaurant->delete();
        return response()->noContent();
    }
}
