<?php

namespace App\Http\Controllers;

use App\Models\Table;
use Illuminate\Http\Request;

class TableController extends Controller
{
    public function index()
    {
        return Table::with('restaurant')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'restaurant_id' => 'required|exists:restaurants,id',
            'table_number' => 'required|string|max:20',
            'qr_code' => 'nullable|string'
        ]);

        return Table::create($data);
    }

    public function show(Table $table)
    {
        return $table->load('restaurant');
    }

    public function update(Request $request, Table $table)
    {
        $table->update($request->only(['table_number', 'qr_code']));
        return $table;
    }

    public function destroy(Table $table)
    {
        $table->delete();
        return response()->noContent();
    }
}
