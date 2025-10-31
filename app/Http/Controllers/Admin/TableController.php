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

        $table = Table::create($validated);
        
        // Générer automatiquement le QR code si non fourni
        if (empty($validated['qr_code'])) {
            $this->generateQrCode($table);
        }

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
     * Générer un QR code pour une table
     */
    public function generateQrCode(Table $table)
    {
        $restaurant = $table->restaurant()->first();
        if (!$restaurant) {
            return null;
        }
        
        $slug = $restaurant->slug ?? $restaurant->id;
        $url = url("/restaurants/{$slug}?table={$table->table_number}");
        
        // Utiliser une API externe pour générer l'image QR
        // Stocker l'URL du QR code généré (optionnel : on peut aussi stocker l'URL du restaurant directement)
        $qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=" . urlencode($url);
        
        $table->update(['qr_code' => $qrCodeUrl]);

        return $qrCodeUrl;
    }

    /**
     * Régénérer le QR code d'une table
     */
    public function regenerateQrCode(Table $table)
    {
        $this->generateQrCode($table);
        
        return redirect()->back()->with('success', 'QR code régénéré avec succès.');
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
