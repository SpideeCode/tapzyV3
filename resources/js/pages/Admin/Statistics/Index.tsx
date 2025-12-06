import React from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { TrendingUp, ShoppingBag, DollarSign, Calendar, Filter, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type Restaurant = { id: number; name: string };

interface Props {
    filters: { restaurant_id?: number | null; from: string; to: string };
    cards: { totalOrders: number; totalRevenue: number; ordersByStatus: Record<string, number> };
    salesByDay: Array<{ d: string; sum: number }>;
    topItems: Array<{ id: number; name: string; quantity: number }>;
    restaurants: Restaurant[];
}

function formatPrice(n: number) {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n);
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
            <div className="py-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tableau de bord</h1>
                            <p className="text-muted-foreground dark:text-gray-400 mt-1">Aperçu des performances de vos restaurants</p>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
                        <div className="flex items-center gap-2 mb-4 text-gray-900 dark:text-white font-medium">
                            <Filter className="w-5 h-5" />
                            Filtres
                        </div>
                        <form onSubmit={applyFilters} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Restaurant</label>
                                <select
                                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
                                    value={restaurantId}
                                    onChange={(e) => setRestaurantId(e.target.value)}
                                >
                                    <option value="">Tous les restaurants</option>
                                    {restaurants.map((r) => (
                                        <option key={r.id} value={r.id}>{r.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Du</label>
                                <input
                                    type="date"
                                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
                                    value={from}
                                    onChange={(e) => setFrom(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Au</label>
                                <input
                                    type="date"
                                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
                                    value={to}
                                    onChange={(e) => setTo(e.target.value)}
                                />
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"
                                >
                                    <Calendar className="w-4 h-4" />
                                    Appliquer
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Orders Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors relative overflow-hidden group">
                            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <ShoppingBag className="w-24 h-24 text-blue-500" />
                            </div>
                            <div className="relative z-10">
                                <div className="text-sm font-medium text-muted-foreground dark:text-gray-400 mb-1">Total Commandes</div>
                                <div className="text-3xl font-bold text-gray-900 dark:text-white">{cards.totalOrders}</div>
                                <div className="mt-4 flex items-center text-sm text-blue-600 dark:text-blue-400">
                                    <TrendingUp className="w-4 h-4 mr-1" />
                                    <span>Sur la période sélectionnée</span>
                                </div>
                            </div>
                        </div>

                        {/* Revenue Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors relative overflow-hidden group">
                            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <DollarSign className="w-24 h-24 text-green-500" />
                            </div>
                            <div className="relative z-10">
                                <div className="text-sm font-medium text-muted-foreground dark:text-gray-400 mb-1">Chiffre d'affaires</div>
                                <div className="text-3xl font-bold text-gray-900 dark:text-white">{formatPrice(cards.totalRevenue)}</div>
                                <div className="mt-4 flex items-center text-sm text-green-600 dark:text-green-400">
                                    <TrendingUp className="w-4 h-4 mr-1" />
                                    <span>Revenus générés</span>
                                </div>
                            </div>
                        </div>

                        {/* Status Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
                            <div className="text-sm font-medium text-muted-foreground dark:text-gray-400 mb-4">Répartition par statut</div>
                            <div className="space-y-3">
                                {Object.entries(cards.ordersByStatus || {}).map(([k, v]) => (
                                    <div key={k} className="flex justify-between items-center text-sm">
                                        <span className="capitalize text-gray-700 dark:text-gray-300">{k.replace('_', ' ')}</span>
                                        <span className="font-semibold bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-2 py-1 rounded-md min-w-[2rem] text-center">
                                            {v}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Sales Table */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ventes par jour</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700/50">
                                        <tr>
                                            <th className="px-6 py-3">Date</th>
                                            <th className="px-6 py-3 text-right">Montant</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {salesByDay.map((r) => (
                                            <tr key={r.d} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                                    {new Date(r.d).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                                </td>
                                                <td className="px-6 py-4 text-right font-bold text-gray-900 dark:text-white">
                                                    {formatPrice(Number(r.sum))}
                                                </td>
                                            </tr>
                                        ))}
                                        {salesByDay.length === 0 && (
                                            <tr>
                                                <td colSpan={2} className="px-6 py-8 text-center text-muted-foreground dark:text-gray-400">
                                                    Aucune donnée disponible pour cette période
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Top Items Table */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top 10 des plats</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700/50">
                                        <tr>
                                            <th className="px-6 py-3">Plat</th>
                                            <th className="px-6 py-3 text-right">Quantité</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {topItems.map((t, index) => (
                                            <tr key={t.id} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white flex items-center gap-3">
                                                    <span className={cn(
                                                        "flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold",
                                                        index < 3 ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                                                    )}>
                                                        {index + 1}
                                                    </span>
                                                    {t.name || `#${t.id}`}
                                                </td>
                                                <td className="px-6 py-4 text-right font-bold text-gray-900 dark:text-white">
                                                    {t.quantity}
                                                </td>
                                            </tr>
                                        ))}
                                        {topItems.length === 0 && (
                                            <tr>
                                                <td colSpan={2} className="px-6 py-8 text-center text-muted-foreground dark:text-gray-400">
                                                    Aucun article vendu sur cette période
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
