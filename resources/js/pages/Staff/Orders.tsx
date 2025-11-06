import React from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

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
    current_page: number;
    last_page: number;
};

interface PageProps {
    orders: Paginated<Order>;
    restaurants: Restaurant[];
    currentRestaurantId?: number | null;
    currentStatus?: string | null;
}

function formatPrice(n: number) {
    return `${Number(n).toFixed(2)} €`;
}

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    served: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
};

const statusLabels: Record<string, string> = {
    pending: 'En attente',
    in_progress: 'En préparation',
    served: 'Servie',
    cancelled: 'Annulée',
};

export default function StaffOrders({ orders, restaurants, currentRestaurantId, currentStatus }: PageProps) {
    const [restaurantId, setRestaurantId] = React.useState<string>(currentRestaurantId ? String(currentRestaurantId) : '');
    const [status, setStatus] = React.useState<string>(currentStatus || '');
    const [updating, setUpdating] = React.useState<Record<number, boolean>>({});

    // Auto-rafraîchissement périodique
    React.useEffect(() => {
        const id = setInterval(() => {
            router.reload({ only: ['orders'] });
        }, 5000);
        return () => clearInterval(id);
    }, []);

    const applyFilters = () => {
        const params = new URLSearchParams();
        if (restaurantId) params.set('restaurant_id', restaurantId);
        if (status) params.set('status', status);
        const q = params.toString();
        router.visit(`/staff/orders${q ? `?${q}` : ''}`, { preserveState: false });
    };

    const changeStatus = async (orderId: number, newStatus: string) => {
        setUpdating((prev) => ({ ...prev, [orderId]: true }));
        try {
            // Récupérer token depuis meta ou cookie XSRF-TOKEN
            const getCsrf = () => {
                const meta = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null;
                if (meta?.content) return meta.content;
                const cookies = document.cookie.split(';');
                for (const c of cookies) {
                    const [name, value] = c.trim().split('=');
                    if (name === 'XSRF-TOKEN') return decodeURIComponent(value);
                }
                return '';
            };
            const csrf = getCsrf();
            const res = await fetch(`/staff/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrf,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                router.reload({ only: ['orders'] });
            } else {
                let msg = 'Erreur lors de la mise à jour';
                try { const j = await res.json(); msg = j.message || msg; } catch {}
                alert(msg);
            }
        } catch (err) {
            alert('Erreur lors de la mise à jour');
        } finally {
            setUpdating((prev) => ({ ...prev, [orderId]: false }));
        }
    };

    return (
        <AppLayout>
            <Head title="Commandes Staff - Temps réel" />
            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Commandes en temps réel</h1>
                        <p className="text-gray-600 mt-2">Gérez les commandes et leurs statuts</p>
                    </div>

                    {/* Filtres */}
                    <div className="bg-white p-4 rounded-lg shadow border mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant</label>
                                <select
                                    className="w-full border rounded px-3 py-2"
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                                <select
                                    className="w-full border rounded px-3 py-2"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value="">Tous les statuts</option>
                                    <option value="pending">En attente</option>
                                    <option value="in_progress">En préparation</option>
                                    <option value="served">Servie</option>
                                    <option value="cancelled">Annulée</option>
                                </select>
                            </div>
                            <div className="flex items-end">
                                <button
                                    onClick={applyFilters}
                                    className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                                >
                                    Appliquer les filtres
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Liste des commandes */}
                    <div className="space-y-4">
                        {orders.data.length === 0 ? (
                            <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
                                Aucune commande trouvée
                            </div>
                        ) : (
                            orders.data.map((order) => (
                                <div key={order.id} className="bg-white rounded-lg shadow border p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg font-semibold">Commande #{order.id}</span>
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                                                    {statusLabels[order.status] || order.status}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-600 mt-1">
                                                {order.restaurant?.name} - Table {order.table?.table_number}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {new Date(order.created_at).toLocaleString()}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xl font-bold text-indigo-600">{formatPrice(order.total)}</div>
                                        </div>
                                    </div>

                                    {/* Items */}
                                    <div className="mb-4 border-t pt-4">
                                        <div className="space-y-2">
                                            {order.items.map((oi) => (
                                                <div key={oi.id} className="flex justify-between text-sm">
                                                    <span>{oi.item?.name} x {oi.quantity}</span>
                                                    <span className="text-gray-600">{formatPrice(oi.price * oi.quantity)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Actions de changement de statut */}
                                    <div className="border-t pt-4 flex flex-wrap gap-2">
                                        {order.status !== 'pending' && (
                                            <button
                                                onClick={() => changeStatus(order.id, 'pending')}
                                                disabled={updating[order.id]}
                                                className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 disabled:opacity-50"
                                            >
                                                {updating[order.id] ? '...' : 'En attente'}
                                            </button>
                                        )}
                                        {order.status !== 'in_progress' && order.status !== 'served' && order.status !== 'cancelled' && (
                                            <button
                                                onClick={() => changeStatus(order.id, 'in_progress')}
                                                disabled={updating[order.id]}
                                                className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200 disabled:opacity-50"
                                            >
                                                {updating[order.id] ? '...' : 'En préparation'}
                                            </button>
                                        )}
                                        {order.status !== 'served' && order.status !== 'cancelled' && (
                                            <button
                                                onClick={() => changeStatus(order.id, 'served')}
                                                disabled={updating[order.id]}
                                                className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200 disabled:opacity-50"
                                            >
                                                {updating[order.id] ? '...' : 'Servie'}
                                            </button>
                                        )}
                                        {order.status !== 'cancelled' && (
                                            <button
                                                onClick={() => changeStatus(order.id, 'cancelled')}
                                                disabled={updating[order.id]}
                                                className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200 disabled:opacity-50"
                                            >
                                                {updating[order.id] ? '...' : 'Annuler'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Pagination */}
                    {orders.last_page > 1 && (
                        <div className="mt-6 flex justify-center gap-2">
                            {orders.links.map((link, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => link.url && router.visit(link.url, { preserveState: false })}
                                    disabled={!link.url || link.active}
                                    className={`px-4 py-2 rounded ${link.active ? 'bg-indigo-600 text-white' : 'bg-white border hover:bg-gray-50'} ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

