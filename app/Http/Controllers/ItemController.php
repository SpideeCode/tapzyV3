<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;

class ItemController extends Controller
{
    public function index()
    {
        return Item::with('restaurant')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'restaurant_id' => 'required|exists:restaurants,id',
            'name' => 'required|string|max:100',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'available' => 'boolean'
        ]);

        return Item::create($data);
    }

    public function show(Item $item)
    {
        return $item->load('restaurant');
    }

    public function update(Request $request, Item $item)
    {
        $item->update($request->only(['name', 'description', 'price', 'available']));
        return $item;
    }

    public function destroy(Item $item)
    {
        $item->delete();
        return response()->noContent();
    }
}
