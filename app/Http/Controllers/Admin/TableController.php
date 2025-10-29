<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Table;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TableController extends Controller
{
    /**
     * Afficher la liste des tables
     */
    public function index()
    {
        $tables = Table::with('restaurant')->latest()->paginate(10);
        
        return Inertia::render('Tables/Index', [
            'tables' => $tables
        ]);
    }

    /**
     * Afficher le formulaire de création
     */
    public function create()
    {
        $restaurants = Restaurant::all();
return Inertia::render('Tables/Create', [
            'restaurants' => $restaurants
        ]);
    }

    /**
     * Enregistrer une nouvelle table
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'restaurant_id' => 'required|exists:restaurants,id',
            'table_number' => 'required|string|max:20',
            'qr_code' => 'nullable|string|max:255',
        ]);

        Table::create($validated);

        return redirect('/admin/tables')->with('success', 'Table créée avec succès.');
    }

    /**
     * Afficher le formulaire d'édition
     */
    public function edit(Table $table)
    {
        $restaurants = Restaurant::all();
return Inertia::render('Tables/Edit', [
            'table' => $table,
            'restaurants' => $restaurants
        ]);
    }

    /**
     * Mettre à jour une table
     */
    public function update(Request $request, Table $table)
    {
        $validated = $request->validate([
            'restaurant_id' => 'required|exists:restaurants,id',
            'table_number' => 'required|string|max:20',
            'qr_code' => 'nullable|string|max:255',
        ]);

        $table->update($validated);

        return redirect('/admin/tables')->with('success', 'Table mise à jour avec succès.');
    }

    /**
     * Supprimer une table
     */
    public function destroy(Table $table)
    {
        $table->delete();
        return redirect('/admin/tables')->with('success', 'Table supprimée avec succès.');
    }
}
