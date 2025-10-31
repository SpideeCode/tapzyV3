import React from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { useCart } from '@/hooks/use-cart';

// Fonction utilitaire pour formater le prix
export const formatPrice = (price: unknown): string => {
    // Convertir en nombre si ce n'est pas déjà le cas
    const numPrice = typeof price === 'number' ? price : Number(price);
    
    // Vérifier si la conversion a réussi
    if (isNaN(numPrice)) {
        console.warn('Prix invalide:', price);
        return 'Prix non disponible';
    }
    
    // Formater avec 2 décimales
    return numPrice.toFixed(2) + ' €';
};

interface Item {
    id: number;
    name: string;
    description: string | null;
    price: number;
    image: string | null;
}

interface Category {
    name: string;
    items: Item[];
}

interface Restaurant {
    id: number;
    name: string;
    description: string | null;
    slug?: string;
    tables: Array<{
        id: number;
        table_number: string;
    }>;
}

interface ShowRestaurantProps {
    restaurant: Restaurant;
    categories: Category[];
}

export default function Show({ restaurant, categories }: ShowRestaurantProps) {
    const { setRestaurant, setTableNumber, state, addItem, increment, decrement, removeItem, total, submit } = useCart();

    React.useEffect(() => {
        setRestaurant(restaurant.id);
    }, [restaurant.id, setRestaurant]);

    const handleGoToPayment = () => {
        router.visit(`/restaurants/${(restaurant as any).slug || restaurant.id}/payment`);
    };
    return (
        <AppLayout>
            <Head title={restaurant.name} />
            
            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* En-tête du restaurant */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">{restaurant.name}</h1>
                        {restaurant.description && (
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                {restaurant.description}
                            </p>
                        )}
                    </div>

                    {/* Sélecteur de table */}
                    <div className="mb-12 bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Sélectionnez votre table</h2>
                        <div className="flex flex-wrap gap-3">
                            {restaurant.tables.length > 0 ? (
                                restaurant.tables.map(table => (
                                    <button
                                        key={table.id}
                                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        onClick={() => setTableNumber(String(table.table_number))}
                                    >
                                        Table {table.table_number}{state.tableNumber === String(table.table_number) ? ' ✓' : ''}
                                    </button>
                                ))
                            ) : (
                                <p className="text-gray-500">Aucune table disponible pour le moment.</p>
                            )}
                        </div>
                    </div>

                    {/* Menu par catégorie */}
                    <div className="space-y-12">
                        {categories.map((category) => (
                            <div key={category.name} id={`category-${category.name.toLowerCase().replace(/\s+/g, '-')}`}>
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
                                    {category.name}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {category.items.map((item) => (
                                        <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                            {item.image && (
                                                <div className="h-48 bg-gray-200 overflow-hidden">
                                                    <img 
                                                        src={item.image} 
                                                        alt={item.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            )}
                                            <div className="p-4">
                                                <div className="flex justify-between items-start">
                                                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                                                    <span className="text-lg font-bold text-indigo-600">
                                                        {formatPrice(item.price)}
                                                    </span>
                                                </div>
                                                {item.description && (
                                                    <p className="mt-2 text-gray-600">{item.description}</p>
                                                )}
                                                <button
                                                    className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                    onClick={() => addItem({ itemId: item.id, name: item.name, price: item.price, image: item.image })}
                                                >
                                                    Ajouter au panier
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Panier */}
                    <div className="fixed bottom-6 right-6 w-full max-w-sm">
                        <div className="bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200">
                            <div className="px-4 py-3 border-b">
                                <h3 className="font-semibold">Votre panier</h3>
                                <p className="text-sm text-gray-500">Table: {state.tableNumber ?? 'non sélectionnée'}</p>
                            </div>
                            <div className="max-h-72 overflow-auto divide-y">
                                {state.items.length === 0 ? (
                                    <div className="p-4 text-sm text-gray-500">Panier vide</div>
                                ) : (
                                    state.items.map((line) => (
                                        <div key={line.itemId} className="p-4 flex items-center gap-3">
                                            {line.image && (
                                                <img src={line.image} alt={line.name} className="w-12 h-12 object-cover rounded" />
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
                            <div className="p-4 border-t">
                                <div className="flex justify-between mb-3">
                                    <span className="text-gray-600">Total</span>
                                    <span className="font-semibold">{formatPrice(total)}</span>
                                </div>
                                <button
                                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                                    onClick={handleGoToPayment}
                                    disabled={!state.tableNumber || state.items.length === 0}
                                >
                                    Continuer vers paiement
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
