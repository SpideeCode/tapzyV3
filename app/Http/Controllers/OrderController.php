<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Restaurant;
use App\Models\Table;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index()
    {
        return Order::with(['table', 'items.item'])->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'restaurant_id' => 'required|exists:restaurants,id',
            'table_id' => 'required|exists:tables,id',
            'items' => 'required|array|min:1',
            'items.*.item_id' => 'required|exists:items,id',
            'items.*.quantity' => 'required|integer|min:1'
        ]);

        $order = Order::create([
            'restaurant_id' => $data['restaurant_id'],
            'table_id' => $data['table_id'],
            'status' => 'pending',
            'total' => 0
        ]);

        $total = 0;
        foreach ($data['items'] as $line) {
            $price = \App\Models\Item::find($line['item_id'])->price;
            $total += $price * $line['quantity'];

            OrderItem::create([
                'order_id' => $order->id,
                'item_id' => $line['item_id'],
                'quantity' => $line['quantity'],
                'price' => $price
            ]);
        }

        $order->update(['total' => $total]);

        return $order->load('items.item');
    }

    // Création de commande pour invités via numéro de table
    public function storeGuest(Request $request)
    {
        $data = $request->validate([
            'restaurant_id' => 'required|exists:restaurants,id',
            'table_number' => 'required|string',
            'items' => 'required|array|min:1',
            'items.*.item_id' => 'required|exists:items,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $table = Table::where('restaurant_id', $data['restaurant_id'])
            ->where('table_number', $data['table_number'])
            ->first();

        if (!$table) {
            return response()->json([
                'message' => 'Table introuvable pour ce restaurant.'
            ], 422);
        }

        $order = Order::create([
            'restaurant_id' => $data['restaurant_id'],
            'table_id' => $table->id,
            'status' => 'pending',
            'total' => 0,
        ]);

        $total = 0;
        foreach ($data['items'] as $line) {
            $price = \App\Models\Item::find($line['item_id'])->price;
            $total += $price * $line['quantity'];

            OrderItem::create([
                'order_id' => $order->id,
                'item_id' => $line['item_id'],
                'quantity' => $line['quantity'],
                'price' => $price,
            ]);
        }

        $order->update(['total' => $total]);

        return $order->load(['table', 'items.item']);
    }

    public function update(Request $request, Order $order)
    {
        $order->update($request->only('status'));
        return $order;
    }

    public function destroy(Order $order)
    {
        $order->delete();
        return response()->noContent();
    }

    // Page de confirmation publique d'une commande
    public function showPublic(Order $order)
    {
        return \Inertia\Inertia::render('Public/Order/Confirmation', [
            'order' => $order->load(['restaurant', 'table', 'items.item']),
        ]);
    }
}
