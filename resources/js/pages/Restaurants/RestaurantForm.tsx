import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

interface RestaurantFormProps {
    restaurant?: {
        id?: number;
        name: string;
    };
}

interface FormData {
    name: string;
}

export default function RestaurantForm({ restaurant }: RestaurantFormProps) {
    const { data, setData, post, put, processing, errors } = useForm<FormData>({
        name: restaurant?.name || ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (restaurant?.id) {
            put(`/admin/restaurants/${restaurant.id}`);
        } else {
            post('/admin/restaurants');
        }
    };

    return (
        <AdminLayout>
            <Head title={restaurant ? 'Modifier le restaurant' : 'Ajouter un restaurant'} />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                {restaurant ? 'Modifier le restaurant' : 'Ajouter un nouveau restaurant'}
                            </h2>
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                            Nom du restaurant *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            required
                                            autoFocus
                                        />
                                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3 pt-4">
                                    <Link
                                        href="/admin/restaurants"
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Annuler
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                    >
                                        {processing ? 'Enregistrement...' : 'Enregistrer'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
