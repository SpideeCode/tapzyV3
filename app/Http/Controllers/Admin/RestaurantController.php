<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RestaurantController extends Controller
{
    /**
     * Afficher la liste des restaurants
     */
    public function index()
    {
        $restaurants = Restaurant::latest()->paginate(10);
        
        return Inertia::render('Restaurants/Index', [
            'restaurants' => $restaurants->items(),
            'pagination' => [
                'current_page' => $restaurants->currentPage(),
                'last_page' => $restaurants->lastPage(),
                'per_page' => $restaurants->perPage(),
                'total' => $restaurants->total(),
            ]
        ]);
    }

    /**
     * Afficher le formulaire de création
     */
    public function create()
    {
        return Inertia::render('Restaurants/Create');
    }

    /**
     * Enregistrer un nouveau restaurant
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:restaurants,name',
        ]);

        Restaurant::create($validated);

        return redirect()->route('admin.restaurants.index')
            ->with('success', 'Restaurant créé avec succès.');
    }

    /**
     * Afficher le formulaire d'édition
     */
    public function edit(Restaurant $restaurant)
    {
        return Inertia::render('Restaurants/Edit', [
            'restaurant' => $restaurant
        ]);
    }

    /**
     * Mettre à jour un restaurant
     */
    public function update(Request $request, Restaurant $restaurant)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:restaurants,name,' . $restaurant->id,
        ]);

        $restaurant->update($validated);

        return redirect()->route('admin.restaurants.index')
            ->with('success', 'Restaurant mis à jour avec succès.');
    }

    /**
     * Supprimer un restaurant
     */
    public function destroy(Restaurant $restaurant)
    {
        $restaurant->delete();
        
        return redirect()->route('admin.restaurants.index')
            ->with('success', 'Restaurant supprimé avec succès.');
    }
}
