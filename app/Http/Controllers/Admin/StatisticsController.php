<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Restaurant;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class StatisticsController extends Controller
{
    public function index(Request $request)
    {
        $restaurantId = $request->integer('restaurant_id');
        $from = $request->input('from');
        $to = $request->input('to');

        $fromDate = $from ? Carbon::parse($from)->startOfDay() : Carbon::now()->startOfDay();
        $toDate = $to ? Carbon::parse($to)->endOfDay() : Carbon::now()->endOfDay();

        $orderQuery = Order::query()->whereBetween('created_at', [$fromDate, $toDate]);
        if ($restaurantId) {
            $orderQuery->where('restaurant_id', $restaurantId);
        }

        $orders = (clone $orderQuery);

        $totalOrders = (clone $orderQuery)->count();
        $totalRevenue = (clone $orderQuery)->sum('total');

        $ordersByStatus = (clone $orderQuery)
            ->select('status', DB::raw('COUNT(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status');

        $salesByDay = (clone $orderQuery)
            ->select(DB::raw('DATE(created_at) as d'), DB::raw('SUM(total) as sum'))
            ->groupBy('d')
            ->orderBy('d')
            ->get();

        $topItems = OrderItem::query()
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->when($restaurantId, fn($q) => $q->where('orders.restaurant_id', $restaurantId))
            ->whereBetween('orders.created_at', [$fromDate, $toDate])
            ->select('order_items.item_id', DB::raw('SUM(order_items.quantity) as qty'))
            ->groupBy('order_items.item_id')
            ->orderByDesc('qty')
            ->limit(10)
            ->with('item:id,name')
            ->get();

        $restaurants = Restaurant::orderBy('name')->get(['id','name']);

        return Inertia::render('Admin/Statistics/Index', [
            'filters' => [
                'restaurant_id' => $restaurantId,
                'from' => $fromDate->toDateString(),
                'to' => $toDate->toDateString(),
            ],
            'cards' => [
                'totalOrders' => $totalOrders,
                'totalRevenue' => (float) $totalRevenue,
                'ordersByStatus' => $ordersByStatus,
            ],
            'salesByDay' => $salesByDay,
            'topItems' => $topItems->map(fn($r) => [
                'id' => $r->item_id,
                'name' => optional($r->item)->name,
                'quantity' => (int) $r->qty,
            ]),
            'restaurants' => $restaurants,
        ]);
    }
}


