import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

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
                                        onClick={() => {
                                            // Gérer la sélection de la table
                                            console.log('Table sélectionnée:', table.id);
                                        }}
                                    >
                                        Table {table.table_number}
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
                                                    onClick={() => {
                                                        // Gérer l'ajout au panier
                                                        console.log('Ajouter au panier:', item.id);
                                                    }}
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
                </div>
            </div>
        </AppLayout>
    );
}
