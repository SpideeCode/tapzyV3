<?php

namespace App\Http\Controllers;

use App\Models\Restaurant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RestaurantController extends Controller
{
    // Afficher la liste des restaurants
    public function index()
    {
        $restaurants = Restaurant::all();
        return Inertia::render('Restaurants/Index', [
            'restaurants' => $restaurants
        ]);
    }

    // Afficher le formulaire de création
    public function create()
    {
        return Inertia::render('Restaurants/Create');
    }

    // Enregistrer un nouveau restaurant
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string',
            'adresse' => 'required|string|max:255',
            'telephone' => 'required|string|max:20',
            'email' => 'required|email|unique:restaurants,email',
            'heure_ouverture' => 'required|date_format:H:i',
            'heure_fermeture' => 'required|date_format:H:i|after:heure_ouverture',
        ]);

        Restaurant::create($validated);

        return redirect()->route('restaurants.index')
            ->with('success', 'Restaurant créé avec succès.');
    }

    // Afficher les détails d'un restaurant avec ses articles par catégorie
    public function show(Restaurant $restaurant)
    {
        // Charger les articles avec leurs catégories, groupés par catégorie
        $categories = $restaurant->items()
            ->with('category')
            ->get()
            ->groupBy(function($item) {
                return $item->category ? $item->category->name : 'Non catégorisé';
            });

        return Inertia::render('Public/Restaurant/Show', [
            'restaurant' => $restaurant->load('tables'),
            'categories' => $categories->map(function($items, $categoryName) {
                return [
                    'name' => $categoryName,
                    'items' => $items->map(function($item) {
                        return [
                            'id' => $item->id,
                            'name' => $item->name,
                            'description' => $item->description,
                            'price' => (float) $item->price,
                            'image' => $item->image ? asset('storage/' . $item->image) : null
                        ];
                    })
                ];
            })->values()
        ]);
    }

    // Afficher le formulaire d'édition
    public function edit(Restaurant $restaurant)
    {
        return Inertia::render('Restaurants/Edit', [
            'restaurant' => $restaurant
        ]);
    }

    // Mettre à jour un restaurant
    public function update(Request $request, Restaurant $restaurant)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string',
            'adresse' => 'required|string|max:255',
            'telephone' => 'required|string|max:20',
            'email' => 'required|email|unique:restaurants,email,' . $restaurant->id,
            'heure_ouverture' => 'required|date_format:H:i',
            'heure_fermeture' => 'required|date_format:H:i|after:heure_ouverture',
        ]);

        $restaurant->update($validated);

        return redirect()->route('restaurants.index')
            ->with('success', 'Restaurant mis à jour avec succès.');
    }

    // Supprimer un restaurant
    public function destroy(Restaurant $restaurant)
    {
        $restaurant->delete();
        
        return redirect()->route('restaurants.index')
            ->with('success', 'Restaurant supprimé avec succès.');
    }
}
