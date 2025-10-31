import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link } from '@inertiajs/react';

interface Restaurant {
    id: number;
    name: string;
}

interface Table {
    id: number;
    table_number: string;
    qr_code: string | null;
    restaurant: Restaurant;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedData<T> {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

interface TablesIndexProps {
    tables: PaginatedData<Table>;
}

export default function TablesIndex({ tables }: TablesIndexProps) {
    return (
        <AdminLayout>
            <Head title="Gestion des tables" />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">Gestion des tables</h2>
                                <Link 
                                    href="/admin/tables/create"
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                                >
                                    Ajouter une table
                                </Link>
                            </div>

                            {tables.data.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Numéro de table</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Restaurant</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QR Code</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {tables.data.map((table) => (
                                                <tr key={table.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">{table.table_number}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-500">{table.restaurant.name}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-2">
                                                            {table.qr_code ? (
                                                                <>
                                                                    <img 
                                                                        src={table.qr_code} 
                                                                        alt={`QR Code Table ${table.table_number}`}
                                                                        className="w-16 h-16 border rounded"
                                                                    />
                                                                    <div className="flex flex-col gap-1">
                                                                        <a 
                                                                            href={table.qr_code} 
                                                                            target="_blank" 
                                                                            rel="noopener noreferrer" 
                                                                            className="text-xs text-indigo-600 hover:text-indigo-900"
                                                                        >
                                                                            Voir / Télécharger
                                                                        </a>
                                                                        <Link
                                                                            href={`/admin/tables/${table.id}/regenerate-qr`}
                                                                            method="post"
                                                                            as="button"
                                                                            className="text-xs text-gray-600 hover:text-gray-900"
                                                                        >
                                                                            Régénérer
                                                                        </Link>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <span className="text-sm text-gray-500">Non généré</span>
                                                                    <Link
                                                                        href={`/admin/tables/${table.id}/regenerate-qr`}
                                                                        method="post"
                                                                        as="button"
                                                                        className="text-xs text-indigo-600 hover:text-indigo-900"
                                                                    >
                                                                        Générer
                                                                    </Link>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <Link 
                                                            href={`/admin/tables/${table.id}/edit`}
                                                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                        >
                                                            Modifier
                                                        </Link>
                                                        <Link 
                                                            href={`/admin/tables/${table.id}`}
                                                            method="delete"
                                                            as="button"
                                                            className="text-red-600 hover:text-red-900"
                                                            onBefore={() => {
                                                                return confirm('Êtes-vous sûr de vouloir supprimer cette table ?');
                                                            }}
                                                        >
                                                            Supprimer
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-gray-500">Aucune table enregistrée pour le moment.</p>
                                    <Link
                                        href="/admin/tables/create"
                                        className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 mt-4"
                                    >
                                        Ajouter votre première table
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
