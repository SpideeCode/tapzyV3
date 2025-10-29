import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show({ auth, restaurant }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Détails - ${restaurant.nom}`} />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-semibold">{restaurant.nom}</h2>
                                    <p className="text-gray-500">{restaurant.adresse}</p>
                                </div>
                                <div className="flex space-x-2">
                                    <Link 
                                        href={`/restaurants/${restaurant.id}/edit`}
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Modifier
                                    </Link>
                                    <Link 
                                        href="/restaurants"
                                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Retour à la liste
                                    </Link>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Informations du restaurant</h3>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500">Email</h4>
                                            <p className="mt-1 text-sm text-gray-900">
                                                <a href={`mailto:${restaurant.email}`} className="text-blue-600 hover:underline">
                                                    {restaurant.email}
                                                </a>
                                            </p>
                                        </div>
                                        
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500">Téléphone</h4>
                                            <p className="mt-1 text-sm text-gray-900">
                                                <a href={`tel:${restaurant.telephone}`} className="text-blue-600 hover:underline">
                                                    {restaurant.telephone}
                                                </a>
                                            </p>
                                        </div>
                                        
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500">Horaires d'ouverture</h4>
                                            <p className="mt-1 text-sm text-gray-900">
                                                {restaurant.heure_ouverture} - {restaurant.heure_fermeture}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {restaurant.description && (
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Description</h3>
                                        <p className="text-gray-700 whitespace-pre-line">{restaurant.description}</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Actions</h3>
                                <div className="flex space-x-4">
                                    <button
                                        onClick={() => {
                                            if (confirm('Êtes-vous sûr de vouloir supprimer ce restaurant ? Cette action est irréversible.')) {
                                                router.delete(route('restaurants.destroy', restaurant.id));
                                            }
                                        }}
                                        className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    >
                                        Supprimer le restaurant
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
