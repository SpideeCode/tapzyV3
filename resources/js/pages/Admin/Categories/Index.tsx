import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

interface Category {
    id: number;
    name: string;
    description: string | null;
    order: number;
    is_active: boolean;
    items_count?: number;
}

interface IndexProps {
    categories: {
        data: Category[];
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
}

export default function Index({ categories }: IndexProps) {
    return (
        <AdminLayout>
            <Head title="Gestion des catégories" />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Gestion des catégories</h1>
                        <Link 
                            href="/admin/categories/create"
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:border-indigo-900 focus:ring focus:ring-indigo-300 disabled:opacity-25 transition"
                        >
                            Nouvelle catégorie
                        </Link>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nom
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Description
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ordre
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Statut
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Articles
                                        </th>
                                        <th scope="col" className="relative px-6 py-3">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {categories.data.map((category) => (
                                        <tr key={category.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {category.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                                    {category.description || 'Aucune description'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {category.order}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${category.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {category.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {category.items_count || 0}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Link
                                                    href={`/admin/categories/${category.id}/edit`}
                                                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                >
                                                    Modifier
                                                </Link>
                                                <Link
                                                    href={`/admin/categories/${category.id}`}
                                                    method="delete"
                                                    as="button"
                                                    className="text-red-600 hover:text-red-900"
                                                    onBefore={() => {
                                                        return confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?');
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
                        
                        {categories.links && categories.links.length > 0 && (
                            <div className="px-6 py-4">
                                <div className="flex items-center justify-between">
                                    {categories.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`px-4 py-2 rounded-md ${
                                                link.active
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
