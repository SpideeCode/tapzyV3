<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $restaurantId = $request->integer('restaurant_id');

        $query = Order::with(['restaurant', 'table', 'items.item'])
            ->latest();

        if ($restaurantId) {
            $query->where('restaurant_id', $restaurantId);
        }

        $orders = $query->paginate(15)->withQueryString();
        $restaurants = Restaurant::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'restaurants' => $restaurants,
            'currentRestaurantId' => $restaurantId,
        ]);
    }

    public function show(Order $order)
    {
        return Inertia::render('Admin/Orders/Show', [
            'order' => $order->load(['restaurant', 'table', 'items.item']),
        ]);
    }

    public function update(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,in_progress,served,cancelled',
        ]);

        $order->update($validated);

        return redirect()->back()->with('success', 'Statut mis à jour');
    }
}


