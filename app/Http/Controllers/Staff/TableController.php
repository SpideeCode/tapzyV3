<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Table;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TableController extends Controller
{
    public function index()
    {
        $tables = Table::with('restaurant')->latest()->paginate(10);
        
        return Inertia::render('Staff/Tables/Index', [
            'tables' => $tables
        ]);
    }

    public function create()
    {
        $restaurants = Restaurant::all();
        $existingTables = Table::select('id', 'table_number', 'restaurant_id')->get();
        
        return Inertia::render('Staff/Tables/Create', [
            'restaurants' => $restaurants,
            'existingTables' => $existingTables
        ]);
    }

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
        
        if (empty($validated['qr_code'])) {
            $this->generateQrCode($table);
        }

        return redirect()->route('staff.tables.index')->with('success', 'Table créée avec succès.');
    }

    public function edit(Table $table)
    {
        $restaurants = Restaurant::all();
        return Inertia::render('Staff/Tables/Edit', [
            'table' => $table,
            'restaurants' => $restaurants
        ]);
    }

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

        return redirect()->route('staff.tables.index')->with('success', 'Table mise à jour avec succès.');
    }

    public function generateQrCode(Table $table)
    {
        $restaurant = $table->restaurant()->first();
        if (!$restaurant) {
            return null;
        }
        
        $slug = $restaurant->slug ?? $restaurant->id;
        $url = url("/restaurants/{$slug}?table={$table->table_number}");
        
        $qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=" . urlencode($url);
        
        $table->update(['qr_code' => $qrCodeUrl]);

        return $qrCodeUrl;
    }

    public function regenerateQrCode(Table $table)
    {
        $this->generateQrCode($table);
        
        return redirect()->back()->with('success', 'QR code régénéré avec succès.');
    }

    public function destroy(Table $table)
    {
        $table->delete();

        return redirect()->route('staff.tables.index')
            ->with('success', 'Table supprimée avec succès.');
    }
}
