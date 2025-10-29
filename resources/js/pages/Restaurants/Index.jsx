import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ auth, restaurants }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Restaurants" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold">Liste des restaurants</h2>
                                <Link 
                                    href={route('restaurants.create')}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Ajouter un restaurant
                                </Link>
                            </div>

                            {restaurants.length === 0 ? (
                                <p>Aucun restaurant enregistré pour le moment.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Nom
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Adresse
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Téléphone
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Horaires
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {restaurants.map((restaurant) => (
                                                <tr key={restaurant.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="font-medium text-gray-900">{restaurant.nom}</div>
                                                        <div className="text-sm text-gray-500">{restaurant.email}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {restaurant.adresse}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {restaurant.telephone}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {restaurant.heure_ouverture} - {restaurant.heure_fermeture}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <Link 
                                                            href={route('restaurants.show', restaurant.id)}
                                                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                        >
                                                            Voir
                                                        </Link>
                                                        <Link 
                                                            href={route('restaurants.edit', restaurant.id)}
                                                            className="text-yellow-600 hover:text-yellow-900 mr-4"
                                                        >
                                                            Modifier
                                                        </Link>
                                                        <button
                                                            className="text-red-600 hover:text-red-900"
                                                            onClick={() => {
                                                                if (confirm('Êtes-vous sûr de vouloir supprimer ce restaurant ?')) {
                                                                    router.delete(route('restaurants.destroy', restaurant.id));
                                                                }
                                                            }}
                                                        >
                                                            Supprimer
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
