import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

type Item = { id: number; name: string };
type OrderItem = { id: number; quantity: number; price: number; item: Item };
type Table = { id: number; table_number: string };
type Restaurant = { id: number; name: string; slug?: string };

type Order = {
    id: number;
    status: 'pending' | 'in_progress' | 'served' | 'cancelled';
    total: number;
    restaurant: Restaurant;
    table: Table;
    items: OrderItem[];
};

function formatPrice(n: number) {
    return `${Number(n).toFixed(2)} €`;
}

export default function Confirmation({ order }: { order: Order }) {
    return (
        <AppLayout>
            <Head title={`Commande #${order.id} - Confirmation`} />
            <div className="py-12">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700 transition-colors">
                        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Merci ! Votre commande est confirmée</h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Commande #{order.id} — Table {order.table?.table_number} — {order.restaurant?.name}</p>
                        </div>
                        <div className="px-6 py-5">
                            <h2 className="text-lg font-medium mb-3 text-gray-900 dark:text-white">Détails de la commande</h2>
                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                {order.items.map((oi) => (
                                    <div key={oi.id} className="py-3 flex justify-between text-sm">
                                        <span className="text-gray-900 dark:text-gray-100">{oi.item?.name} x {oi.quantity}</span>
                                        <span className="text-gray-600 dark:text-gray-400">{formatPrice(oi.price * oi.quantity)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 flex justify-between items-center">
                                <span className="text-gray-700 dark:text-gray-300 font-medium">Total</span>
                                <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{formatPrice(order.total)}</span>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                Statut actuel: <strong className="text-gray-900 dark:text-white">{order.status}</strong>
                            </span>
                            <Link
                                href={`/restaurants/${order.restaurant?.slug || order.restaurant?.id}`}
                                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium transition-colors"
                            >
                                Retour au menu
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}


