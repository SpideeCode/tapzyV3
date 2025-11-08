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
        $existingTables = Table::select('id', 'table_number', 'restaurant_id')->get();
        
        return Inertia::render('Tables/Create', [
            'restaurants' => $restaurants,
            'existingTables' => $existingTables
        ]);
    }

    /**
     * Enregistrer une nouvelle table
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'restaurant_id' => 'required|exists:restaurants,id',
            'table_number' => [
                'required',
                'string',
                'max:20',
                function ($attribute, $value, $fail) use ($request) {
                    $exists = Table::where('restaurant_id', $request->restaurant_id)
                        ->where('table_number', $value)
                        ->exists();
                    
                    if ($exists) {
                        $fail('Ce numéro de table est déjà utilisé dans ce restaurant.');
                    }
                },
            ],
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
            'table_number' => [
                'required',
                'string',
                'max:20',
                function ($attribute, $value, $fail) use ($request, $table) {
                    $exists = Table::where('restaurant_id', $request->restaurant_id)
                        ->where('table_number', $value)
                        ->where('id', '!=', $table->id)
                        ->exists();
                    
                    if ($exists) {
                        $fail('Ce numéro de table est déjà utilisé dans ce restaurant.');
                    }
                },
            ],
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
     * Vérifier la disponibilité d'un numéro de table
     */
    public function checkAvailability(Request $request)
    {
        $request->validate([
            'table_number' => 'required|string',
            'restaurant_id' => 'required|exists:restaurants,id',
            'except' => 'nullable|integer',
        ]);

        $query = Table::where('restaurant_id', $request->restaurant_id)
            ->where('table_number', $request->table_number);

        if ($request->has('except')) {
            $query->where('id', '!=', $request->except);
        }

        $exists = $query->exists();

        return response()->json([
            'available' => !$exists,
            'message' => $exists 
                ? 'Ce numéro de table est déjà utilisé dans ce restaurant.' 
                : 'Ce numéro de table est disponible.'
        ]);
    }

    /**
     * Supprimer une table
     */
    public function destroy(Table $table)
    {
        $table->delete();

        return redirect()->route('admin.tables.index')
            ->with('success', 'Table supprimée avec succès.');
    }
}
