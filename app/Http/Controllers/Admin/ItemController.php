<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ItemController extends Controller
{
    public function index()
    {
        $items = Item::with('restaurant')
            ->orderBy('name')
            ->paginate(10);

        return Inertia::render('Admin/Items/Index', [
            'items' => $items
        ]);
    }

    public function create()
    {
        $restaurants = Restaurant::orderBy('name')->get();

        return Inertia::render('Admin/Items/Create', [
            'restaurants' => $restaurants
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'restaurant_id' => 'required|exists:restaurants,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'available' => 'boolean'
        ]);

        Item::create($validated);

        return redirect()->route('admin.items.index')
            ->with('success', 'Item créé avec succès');
    }

    public function edit(Item $item)
    {
        $restaurants = Restaurant::orderBy('name')->get();

        return Inertia::render('Admin/Items/Edit', [
            'item' => $item,
            'restaurants' => $restaurants
        ]);
    }

    public function update(Request $request, Item $item)
    {
        $validated = $request->validate([
            'restaurant_id' => 'required|exists:restaurants,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'available' => 'boolean'
        ]);

        $item->update($validated);

        return redirect()->route('admin.items.index')
            ->with('success', 'Item mis à jour avec succès');
    }

    public function destroy(Item $item)
    {
        $item->delete();

        return redirect()->route('admin.items.index')
            ->with('success', 'Item supprimé avec succès');
    }
}
