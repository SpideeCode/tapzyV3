import React from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { useCart } from '@/hooks/use-cart';
import { formatPrice } from './Show';

interface Restaurant {
    id: number;
    name: string;
    slug?: string;
}

interface PaymentProps {
    restaurant: Restaurant;
    paymentMethods: Array<{ id: string; label: string }>;
}

export default function Payment({ restaurant, paymentMethods }: PaymentProps) {
    const { state, setRestaurant, increment, decrement, removeItem, total, submit } = useCart();
    const [method, setMethod] = React.useState<string>(paymentMethods?.[0]?.id ?? 'cash');
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        setRestaurant(restaurant.id);
    }, [restaurant.id, setRestaurant]);

    const onPay = async () => {
        if (!state.tableNumber || state.items.length === 0) return;
        setLoading(true);
        const res = await submit();
        setLoading(false);
        if (!res.ok) {
            alert(res.error || 'Erreur');
            return;
        }
        const orderId = (res as any).order?.id;
        if (orderId) {
            router.visit(`/orders/${orderId}/confirmation`);
        } else {
            router.visit(`/restaurants/${(restaurant as any).slug || restaurant.id}`);
        }
    };

    return (
        <AppLayout>
            <Head title={`Paiement - ${restaurant.name}`} />

            <div className="py-8">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contenu panier */}
                    <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 transition-colors">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Paiement</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Table: {state.tableNumber ?? 'non sélectionnée'}</p>
                        </div>
                        <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[60vh] overflow-auto">
                            {state.items.length === 0 ? (
                                <div className="p-6 text-sm text-gray-500 dark:text-gray-400">Votre panier est vide.</div>
                            ) : (
                                state.items.map((line) => (
                                    <div key={line.itemId} className="p-6 flex items-center gap-4">
                                        {line.image && (
                                            <img src={line.image} alt={line.name} className="w-16 h-16 rounded object-cover" />
                                        )}
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900 dark:text-white">{line.name}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{formatPrice(line.price)}</div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => decrement(line.itemId)}>-</button>
                                            <span className="min-w-6 text-center text-gray-900 dark:text-white">{line.quantity}</span>
                                            <button className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => increment(line.itemId)}>+</button>
                                        </div>
                                        <button className="ml-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300" onClick={() => removeItem(line.itemId)}>×</button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Récap / paiement */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 h-fit transition-colors">
                        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Récapitulatif</h2>
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-600 dark:text-gray-400">Total</span>
                            <span className="font-semibold text-gray-900 dark:text-white">{formatPrice(total)}</span>
                        </div>
                        <div className="mt-6">
                            <div className="text-sm font-medium mb-2 text-gray-900 dark:text-white">Moyen de paiement</div>
                            <div className="space-y-2">
                                {paymentMethods.map((m) => (
                                    <label key={m.id} className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="radio"
                                            name="payment-method"
                                            value={m.id}
                                            checked={method === m.id}
                                            onChange={() => setMethod(m.id)}
                                            className="text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                                        />
                                        <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{m.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <button
                            className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            onClick={onPay}
                            disabled={!state.tableNumber || state.items.length === 0 || loading}
                        >
                            {loading ? 'Paiement...' : 'Payer'}
                        </button>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">En cliquant sur Payer, votre commande est transmise au staff.</p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}


