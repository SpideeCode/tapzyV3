import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function RestaurantForm({ restaurant = null }) {
    const { data, setData, post, put, processing, errors } = useForm({
        nom: restaurant?.nom || '',
        description: restaurant?.description || '',
        adresse: restaurant?.adresse || '',
        telephone: restaurant?.telephone || '',
        email: restaurant?.email || '',
        heure_ouverture: restaurant?.heure_ouverture || '09:00',
        heure_fermeture: restaurant?.heure_fermeture || '23:00',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (restaurant) {
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                                            Nom du restaurant *
                                        </label>
                                        <input
                                            type="text"
                                            id="nom"
                                            value={data.nom}
                                            onChange={(e) => setData('nom', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                        {errors.nom && <p className="mt-1 text-sm text-red-600">{errors.nom}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">
                                            Téléphone *
                                        </label>
                                        <input
                                            type="tel"
                                            id="telephone"
                                            value={data.telephone}
                                            onChange={(e) => setData('telephone', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                        {errors.telephone && <p className="mt-1 text-sm text-red-600">{errors.telephone}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="adresse" className="block text-sm font-medium text-gray-700">
                                            Adresse *
                                        </label>
                                        <input
                                            type="text"
                                            id="adresse"
                                            value={data.adresse}
                                            onChange={(e) => setData('adresse', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                        {errors.adresse && <p className="mt-1 text-sm text-red-600">{errors.adresse}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="heure_ouverture" className="block text-sm font-medium text-gray-700">
                                            Heure d'ouverture *
                                        </label>
                                        <input
                                            type="time"
                                            id="heure_ouverture"
                                            value={data.heure_ouverture}
                                            onChange={(e) => setData('heure_ouverture', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                        {errors.heure_ouverture && <p className="mt-1 text-sm text-red-600">{errors.heure_ouverture}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="heure_fermeture" className="block text-sm font-medium text-gray-700">
                                            Heure de fermeture *
                                        </label>
                                        <input
                                            type="time"
                                            id="heure_fermeture"
                                            value={data.heure_fermeture}
                                            onChange={(e) => setData('heure_fermeture', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                        {errors.heure_fermeture && <p className="mt-1 text-sm text-red-600">{errors.heure_fermeture}</p>}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                            Description
                                        </label>
                                        <textarea
                                            id="description"
                                            rows={4}
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
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
