import React from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
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
        alert('Commande envoyée au staff, préparation en cours.');
        // Retour à la page du restaurant
        router.visit(`/restaurants/${(restaurant as any).slug || restaurant.id}`);
    };

    return (
        <AppLayout>
            <Head title={`Paiement - ${restaurant.name}`} />

            <div className="py-8">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contenu panier */}
                    <div className="lg:col-span-2 bg-white rounded-lg shadow border">
                        <div className="px-6 py-4 border-b">
                            <h1 className="text-2xl font-semibold">Paiement</h1>
                            <p className="text-sm text-gray-500">Table: {state.tableNumber ?? 'non sélectionnée'}</p>
                        </div>
                        <div className="divide-y max-h-[60vh] overflow-auto">
                            {state.items.length === 0 ? (
                                <div className="p-6 text-sm text-gray-500">Votre panier est vide.</div>
                            ) : (
                                state.items.map((line) => (
                                    <div key={line.itemId} className="p-6 flex items-center gap-4">
                                        {line.image && (
                                            <img src={line.image} alt={line.name} className="w-16 h-16 rounded object-cover" />
                                        )}
                                        <div className="flex-1">
                                            <div className="font-medium">{line.name}</div>
                                            <div className="text-sm text-gray-500">{formatPrice(line.price)}</div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button className="px-2 py-1 border rounded" onClick={() => decrement(line.itemId)}>-</button>
                                            <span className="min-w-6 text-center">{line.quantity}</span>
                                            <button className="px-2 py-1 border rounded" onClick={() => increment(line.itemId)}>+</button>
                                        </div>
                                        <button className="ml-2 text-red-500" onClick={() => removeItem(line.itemId)}>×</button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Récap / paiement */}
                    <div className="bg-white rounded-lg shadow border p-6 h-fit">
                        <h2 className="text-lg font-semibold mb-4">Récapitulatif</h2>
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Total</span>
                            <span className="font-semibold">{formatPrice(total)}</span>
                        </div>
                        <div className="mt-6">
                            <div className="text-sm font-medium mb-2">Moyen de paiement</div>
                            <div className="space-y-2">
                                {paymentMethods.map((m) => (
                                    <label key={m.id} className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="payment-method"
                                            value={m.id}
                                            checked={method === m.id}
                                            onChange={() => setMethod(m.id)}
                                        />
                                        <span>{m.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <button
                            className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                            onClick={onPay}
                            disabled={!state.tableNumber || state.items.length === 0 || loading}
                        >
                            {loading ? 'Paiement...' : 'Payer'}
                        </button>
                        <p className="text-xs text-gray-500 mt-3">En cliquant sur Payer, votre commande est transmise au staff.</p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}


