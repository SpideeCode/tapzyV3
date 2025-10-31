import React from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

type Item = { id: number; name: string };
type OrderItem = { id: number; quantity: number; price: number; item: Item };

type Table = { id: number; table_number: string };
type Restaurant = { id: number; name: string };

type Order = {
    id: number;
    status: 'pending' | 'in_progress' | 'served' | 'cancelled';
    total: number;
    restaurant: Restaurant;
    table: Table;
    items: OrderItem[];
    created_at: string;
};

type Paginated<T> = {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
};

interface PageProps {
    orders: Paginated<Order>;
    restaurants: Restaurant[];
    currentRestaurantId?: number | null;
}

function formatPrice(n: number) {
    return `${Number(n).toFixed(2)} €`;
}

export default function AdminOrdersIndex({ orders, restaurants, currentRestaurantId }: PageProps) {
    const { url } = usePage();
    const [restaurantId, setRestaurantId] = React.useState<string>(currentRestaurantId ? String(currentRestaurantId) : '');

    const onFilter = (e: React.FormEvent) => {
        e.preventDefault();
        const q = restaurantId ? `?restaurant_id=${restaurantId}` : '';
        window.location.href = `/admin/orders${q}`;
    };

    return (
        <AdminLayout>
            <Head title="Commandes" />
            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-semibold">Commandes</h1>
                    </div>

                    <form onSubmit={onFilter} className="mb-6 bg-white p-4 rounded shadow border flex flex-wrap gap-3 items-end">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Filtrer par restaurant</label>
                            <select
                                className="border rounded px-3 py-2"
                                value={restaurantId}
                                onChange={(e) => setRestaurantId(e.target.value)}
                            >
                                <option value="">Tous</option>
                                {restaurants.map((r) => (
                                    <option key={r.id} value={r.id}>{r.name}</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Appliquer</button>
                    </form>

                    <div className="bg-white rounded shadow border overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Restaurant</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Table</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Créée</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {orders.data.map((o) => (
                                    <tr key={o.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">{o.id}</td>
                                        <td className="px-4 py-3">{o.restaurant?.name}</td>
                                        <td className="px-4 py-3">{o.table?.table_number}</td>
                                        <td className="px-4 py-3">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                                                {o.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 font-medium">{formatPrice(o.total)}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500">{new Date(o.created_at).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}


