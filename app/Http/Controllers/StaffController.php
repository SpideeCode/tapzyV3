<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StaffController extends Controller
{
    public function orders(Request $request)
    {
        $restaurantId = $request->integer('restaurant_id');
        $status = $request->string('status')->toString();

        $query = Order::with(['restaurant', 'table', 'items.item'])
            ->latest();

        if ($restaurantId) {
            $query->where('restaurant_id', $restaurantId);
        }

        if ($status && in_array($status, ['pending', 'in_progress', 'served', 'cancelled'])) {
            $query->where('status', $status);
        }

        $orders = $query->paginate(20)->withQueryString();
        $restaurants = Restaurant::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Staff/Orders', [
            'orders' => $orders,
            'restaurants' => $restaurants,
            'currentRestaurantId' => $restaurantId ?: null,
            'currentStatus' => $status ?: null,
        ]);
    }

    public function updateOrderStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,in_progress,served,cancelled',
        ]);

        $order->update($validated);

        return response()->json([
            'success' => true,
            'order' => $order->load(['table', 'items.item']),
        ]);
    }
}

