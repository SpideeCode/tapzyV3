<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Restaurant;
use App\Models\Table;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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

        $order = DB::transaction(function () use ($data) {
            // Récupérer tous les prix en une requête
            $itemIds = collect($data['items'])->pluck('item_id')->all();
            $items = \App\Models\Item::whereIn('id', $itemIds)->get(['id', 'price'])->keyBy('id');

            $order = Order::create([
                'restaurant_id' => $data['restaurant_id'],
                'table_id' => $data['table_id'],
                'status' => 'pending',
                'total' => 0,
            ]);

            $total = 0;
            foreach ($data['items'] as $line) {
                $price = (float) optional($items->get($line['item_id']))->price;
                if ($price <= 0) {
                    throw new \RuntimeException('Prix invalide pour l\'article '.$line['item_id']);
                }
                $lineTotal = $price * (int) $line['quantity'];
                $total += $lineTotal;

                OrderItem::create([
                    'order_id' => $order->id,
                    'item_id' => $line['item_id'],
                    'quantity' => (int) $line['quantity'],
                    'price' => $price,
                ]);
            }

            $order->update(['total' => $total]);
            return $order;
        });

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

        try {
            $order = DB::transaction(function () use ($data, $table) {
                $itemIds = collect($data['items'])->pluck('item_id')->all();
                $items = \App\Models\Item::whereIn('id', $itemIds)->get(['id', 'price'])->keyBy('id');

                $order = Order::create([
                    'restaurant_id' => $data['restaurant_id'],
                    'table_id' => $table->id,
                    'status' => 'pending',
                    'total' => 0,
                ]);

                $total = 0;
                foreach ($data['items'] as $line) {
                    $price = (float) optional($items->get($line['item_id']))->price;
                    if ($price <= 0) {
                        throw new \RuntimeException('Prix invalide pour l\'article '.$line['item_id']);
                    }
                    $lineTotal = $price * (int) $line['quantity'];
                    $total += $lineTotal;

                    OrderItem::create([
                        'order_id' => $order->id,
                        'item_id' => $line['item_id'],
                        'quantity' => (int) $line['quantity'],
                        'price' => $price,
                    ]);
                }

                $order->update(['total' => $total]);
                return $order;
            });
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Impossible de créer la commande', 'error' => $e->getMessage()], 422);
        }

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
