import React from 'react';
import { Head, Link } from "@inertiajs/react";
import AdminLayout from '@/Layouts/AdminLayout';

interface Restaurant {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

interface Pagination {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    restaurants: Restaurant[];
    pagination: Pagination;
}

export default function AdminRestaurantsIndex({ restaurants, pagination }: Props) {
    return (
        <AdminLayout>
            <Head title="Gestion des restaurants" />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">Gestion des restaurants</h2>
                                <Link 
                                    href="/admin/restaurants/create" 
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                                >
                                    Ajouter un restaurant
                                </Link>
                            </div>

                            {restaurants.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Créé le</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {restaurants.map((restaurant) => (
                                                <tr key={restaurant.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">{restaurant.name}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(restaurant.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <Link 
                                                            href={`/admin/restaurants/${restaurant.id}/edit`}
                                                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                        >
                                                            Modifier
                                                        </Link>
                                                        <Link 
                                                            href={`/admin/restaurants/${restaurant.id}`}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            Voir
                                                        </Link>
                                                        <Link
                                                            href={`/admin/restaurants/${restaurant.id}`}
                                                            method="delete"
                                                            as="button"
                                                            className="text-red-600 hover:text-red-900 ml-4"
                                                            onBefore={() => {
                                                                return confirm('Êtes-vous sûr de vouloir supprimer ce restaurant ?');
                                                            }}
                                                        >
                                                            Supprimer
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    
                                    {/* Pagination */}
                                    {pagination.last_page > 1 && (
                                        <div className="mt-4 flex justify-between items-center">
                                            <div className="text-sm text-gray-700">
                                                Affichage de <span className="font-medium">{restaurants.length}</span> sur <span className="font-medium">{pagination.total}</span> restaurants
                                            </div>
                                            <div className="flex space-x-2">
                                                {pagination.current_page > 1 && (
                                                    <Link 
                                                        href={`/admin/restaurants?page=${pagination.current_page - 1}`}
                                                        className="px-3 py-1 border rounded-md text-sm font-medium"
                                                    >
                                                        Précédent
                                                    </Link>
                                                )}
                                                
                                                {pagination.current_page < pagination.last_page && (
                                                    <Link 
                                                        href={`/admin/restaurants?page=${pagination.current_page + 1}`}
                                                        className="px-3 py-1 border rounded-md text-sm font-medium"
                                                    >
                                                        Suivant
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-gray-500">Aucun restaurant enregistré pour le moment.</p>
                                    <Link
                                        href="/admin/restaurants/create"
                                        className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        Ajouter un restaurant
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
