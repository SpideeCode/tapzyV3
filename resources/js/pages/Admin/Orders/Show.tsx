import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
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

function formatPrice(n: number) {
    return `${Number(n).toFixed(2)} €`;
}

export default function AdminOrderShow({ order }: { order: Order }) {
    const [status, setStatus] = React.useState(order.status);
    const [saving, setSaving] = React.useState(false);

    const update = async () => {
        setSaving(true);
        try {
            const csrf = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null;
            const res = await fetch(`/admin/orders/${order.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrf?.content || '',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
                body: JSON.stringify({ status }),
            });
            if (res.ok) {
                router.reload({ only: ['order'] });
            } else {
                alert('Erreur lors de la mise à jour');
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <AdminLayout>
            <Head title={`Commande #${order.id}`} />
            <div className="py-8">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-4">
                        <Link href="/admin/orders" className="text-sm text-gray-600 hover:text-gray-900">← Retour aux commandes</Link>
                    </div>
                    <div className="bg-white rounded shadow border">
                        <div className="px-6 py-4 border-b flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-semibold">Commande #{order.id}</h1>
                                <div className="text-sm text-gray-600 mt-1">{order.restaurant?.name} — Table {order.table?.table_number}</div>
                                <div className="text-xs text-gray-500 mt-1">{new Date(order.created_at).toLocaleString()}</div>
                            </div>
                            <div className="flex items-center gap-3">
                                <select className="border rounded px-3 py-2" value={status} onChange={(e) => setStatus(e.target.value as Order['status'])}>
                                    <option value="pending">En attente</option>
                                    <option value="in_progress">En préparation</option>
                                    <option value="served">Servie</option>
                                    <option value="cancelled">Annulée</option>
                                </select>
                                <button onClick={update} disabled={saving} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50">{saving ? '...' : 'Mettre à jour'}</button>
                            </div>
                        </div>
                        <div className="px-6 py-4">
                            <h2 className="text-lg font-medium mb-3">Articles</h2>
                            <div className="divide-y">
                                {order.items.map((oi) => (
                                    <div key={oi.id} className="py-3 flex justify-between text-sm">
                                        <span>{oi.item?.name} x {oi.quantity}</span>
                                        <span className="text-gray-600">{formatPrice(oi.price * oi.quantity)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 flex justify-between items-center">
                                <span className="text-gray-700 font-medium">Total</span>
                                <span className="text-xl font-bold text-indigo-600">{formatPrice(order.total)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}


