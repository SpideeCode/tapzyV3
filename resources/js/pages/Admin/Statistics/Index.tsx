import React from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

type Restaurant = { id: number; name: string };

interface Props {
    filters: { restaurant_id?: number | null; from: string; to: string };
    cards: { totalOrders: number; totalRevenue: number; ordersByStatus: Record<string, number> };
    salesByDay: Array<{ d: string; sum: number }>;
    topItems: Array<{ id: number; name: string; quantity: number }>;
    restaurants: Restaurant[];
}

function formatPrice(n: number) {
    return `${Number(n).toFixed(2)} €`;
}

export default function AdminStatisticsIndex({ filters, cards, salesByDay, topItems, restaurants }: Props) {
    const [restaurantId, setRestaurantId] = React.useState<string>(filters.restaurant_id ? String(filters.restaurant_id) : '');
    const [from, setFrom] = React.useState<string>(filters.from);
    const [to, setTo] = React.useState<string>(filters.to);

    const applyFilters = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (restaurantId) params.set('restaurant_id', restaurantId);
        if (from) params.set('from', from);
        if (to) params.set('to', to);
        router.visit(`/admin/statistics?${params.toString()}`, { preserveState: false });
    };

    return (
        <AdminLayout>
            <Head title="Statistiques" />
            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-semibold">Statistiques</h1>
                    </div>

                    <form onSubmit={applyFilters} className="bg-white p-4 rounded shadow border mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Restaurant</label>
                            <select className="border rounded px-3 py-2 w-full" value={restaurantId} onChange={(e) => setRestaurantId(e.target.value)}>
                                <option value="">Tous</option>
                                {restaurants.map((r) => (
                                    <option key={r.id} value={r.id}>{r.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Du</label>
                            <input type="date" className="border rounded px-3 py-2 w-full" value={from} onChange={(e) => setFrom(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Au</label>
                            <input type="date" className="border rounded px-3 py-2 w-full" value={to} onChange={(e) => setTo(e.target.value)} />
                        </div>
                        <div>
                            <button type="submit" className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Appliquer</button>
                        </div>
                    </form>

                    {/* Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white border rounded p-4">
                            <div className="text-sm text-gray-500">Commandes</div>
                            <div className="text-2xl font-bold">{cards.totalOrders}</div>
                        </div>
                        <div className="bg-white border rounded p-4">
                            <div className="text-sm text-gray-500">Revenus</div>
                            <div className="text-2xl font-bold text-indigo-600">{formatPrice(cards.totalRevenue)}</div>
                        </div>
                        <div className="bg-white border rounded p-4">
                            <div className="text-sm text-gray-500">Par statut</div>
                            <div className="mt-2 space-y-1 text-sm">
                                {Object.entries(cards.ordersByStatus || {}).map(([k,v]) => (
                                    <div key={k} className="flex justify-between"><span>{k}</span><span className="font-medium">{v}</span></div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Courbe simple (table) */}
                    <div className="bg-white border rounded p-4 mb-6">
                        <div className="text-sm text-gray-500 mb-2">Ventes par jour</div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="text-left text-gray-600">
                                        <th className="py-2 pr-6">Date</th>
                                        <th className="py-2">Montant</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {salesByDay.map((r) => (
                                        <tr key={r.d} className="border-t">
                                            <td className="py-2 pr-6">{r.d}</td>
                                            <td className="py-2">{formatPrice(Number(r.sum))}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Top articles */}
                    <div className="bg-white border rounded p-4">
                        <div className="text-sm text-gray-500 mb-2">Top 10 des plats</div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="text-left text-gray-600">
                                        <th className="py-2 pr-6">Plat</th>
                                        <th className="py-2">Quantité</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topItems.map((t) => (
                                        <tr key={t.id} className="border-t">
                                            <td className="py-2 pr-6">{t.name || `#${t.id}`}</td>
                                            <td className="py-2">{t.quantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}


