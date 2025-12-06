<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\Restaurant;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ItemController extends Controller
{
    public function index()
    {
        $items = Item::with('restaurant')
            ->orderBy('name')
            ->paginate(10);

        return Inertia::render('Staff/Items/Index', [
            'items' => $items
        ]);
    }

    public function create()
    {
        $restaurants = Restaurant::orderBy('name')->get();
        $categories = Category::orderBy('name')->get();

        return Inertia::render('Staff/Items/Create', [
            'restaurants' => $restaurants,
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'restaurant_id' => 'required|exists:restaurants,id',
            'category_id' => 'nullable|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'available' => 'boolean'
        ]);

        Item::create($validated);

        return redirect()->route('staff.items.index')
            ->with('success', 'Item créé avec succès');
    }

    public function edit(Item $item)
    {
        $restaurants = Restaurant::orderBy('name')->get();
        $categories = Category::orderBy('name')->get();

        return Inertia::render('Staff/Items/Edit', [
            'item' => $item->load(['restaurant', 'category']),
            'restaurants' => $restaurants,
            'categories' => $categories
        ]);
    }

    public function update(Request $request, Item $item)
    {
        $validated = $request->validate([
            'restaurant_id' => 'required|exists:restaurants,id',
            'category_id' => 'nullable|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'available' => 'boolean'
        ]);

        $item->update($validated);

        return redirect()->route('staff.items.index')
            ->with('success', 'Item mis à jour avec succès');
    }

    public function destroy(Item $item)
    {
        $item->delete();

        return redirect()->route('staff.items.index')
            ->with('success', 'Item supprimé avec succès');
    }
}
