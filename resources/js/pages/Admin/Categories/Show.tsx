import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

interface Item {
    id: number;
    name: string;
    price: number;
    is_available: boolean;
}

interface Category {
    id: number;
    name: string;
    description: string | null;
    order: number;
    is_active: boolean;
    items: Item[];
}

interface ShowProps {
    category: Category;
}

export default function Show({ category }: ShowProps) {
    return (
        <AdminLayout>
            <Head title={`Détails de ${category.name}`} />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Détails de la catégorie : {category.name}
                        </h1>
                        <div className="flex space-x-2">
                            <Link
                                href={route('admin.categories.edit', category.id)}
                                className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:border-indigo-900 focus:ring focus:ring-indigo-300 disabled:opacity-25 transition"
                            >
                                Modifier
                            </Link>
                            <Link
                                href={route('admin.categories.index')}
                                className="inline-flex items-center px-4 py-2 bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-gray-800 uppercase tracking-widest hover:bg-gray-300 focus:outline-none focus:border-gray-300 focus:ring focus:ring-gray-200 disabled:opacity-25 transition"
                            >
                                Retour à la liste
                            </Link>
                        </div>
                    </div>
                    
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                        <div className="px-4 py-5 sm:px-6">
                            <h2 className="text-lg font-medium text-gray-900">
                                Informations de la catégorie
                            </h2>
                        </div>
                        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Nom
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {category.name}
                                    </dd>
                                </div>
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Statut
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            category.is_active 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {category.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </dd>
                                </div>
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Ordre d'affichage
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {category.order}
                                    </dd>
                                </div>
                                <div className="sm:col-span-2">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Description
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                                        {category.description || 'Aucune description'}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                            <h2 className="text-lg font-medium text-gray-900">
                                Articles de cette catégorie
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                {category.items.length} article(s) trouvé(s)
                            </p>
                        </div>
                        {category.items.length > 0 ? (
                            <div className="border-t border-gray-200">
                                <ul className="divide-y divide-gray-200">
                                    {category.items.map((item) => (
                                        <li key={item.id} className="px-4 py-4 sm:px-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-indigo-600 truncate">
                                                        {item.name}
                                                    </p>
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                            item.is_available 
                                                                ? 'bg-green-100 text-green-800' 
                                                                : 'bg-red-100 text-red-800'
                                                        }`}>
                                                            {item.is_available ? 'Disponible' : 'Indisponible'}
                                                        </span>
                                                        <span className="ml-2">
                                                            {item.price.toFixed(2)} €
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="ml-2 flex-shrink-0 flex">
                                                    <Link
                                                        href={route('admin.items.edit', item.id)}
                                                        className="font-medium text-indigo-600 hover:text-indigo-500"
                                                    >
                                                        Voir
                                                    </Link>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                                <p className="text-sm text-gray-500">
                                    Aucun article n'est associé à cette catégorie pour le moment.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
