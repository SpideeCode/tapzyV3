import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Edit({ auth, restaurant }) {
    const [formData, setFormData] = useState({
        nom: restaurant.nom || '',
        description: restaurant.description || '',
        adresse: restaurant.adresse || '',
        telephone: restaurant.telephone || '',
        email: restaurant.email || '',
        heure_ouverture: restaurant.heure_ouverture || '12:00',
        heure_fermeture: restaurant.heure_fermeture || '23:00',
    });

    useEffect(() => {
        // Mettre à jour le formulaire lorsque les données du restaurant changent
        setFormData({
            nom: restaurant.nom || '',
            description: restaurant.description || '',
            adresse: restaurant.adresse || '',
            telephone: restaurant.telephone || '',
            email: restaurant.email || '',
            heure_ouverture: restaurant.heure_ouverture || '12:00',
            heure_fermeture: restaurant.heure_fermeture || '23:00',
        });
    }, [restaurant]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.put(route('restaurants.update', restaurant.id), formData);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Modifier - ${restaurant.nom}`} />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h2 className="text-2xl font-semibold mb-6">Modifier le restaurant</h2>
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                                            Nom du restaurant *
                                        </label>
                                        <input
                                            type="text"
                                            name="nom"
                                            id="nom"
                                            value={formData.nom}
                                            onChange={handleChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">
                                            Téléphone *
                                        </label>
                                        <input
                                            type="tel"
                                            name="telephone"
                                            id="telephone"
                                            value={formData.telephone}
                                            onChange={handleChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            required
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label htmlFor="adresse" className="block text-sm font-medium text-gray-700">
                                            Adresse *
                                        </label>
                                        <input
                                            type="text"
                                            name="adresse"
                                            id="adresse"
                                            value={formData.adresse}
                                            onChange={handleChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="heure_ouverture" className="block text-sm font-medium text-gray-700">
                                            Heure d'ouverture *
                                        </label>
                                        <input
                                            type="time"
                                            name="heure_ouverture"
                                            id="heure_ouverture"
                                            value={formData.heure_ouverture}
                                            onChange={handleChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="heure_fermeture" className="block text-sm font-medium text-gray-700">
                                            Heure de fermeture *
                                        </label>
                                        <input
                                            type="time"
                                            name="heure_fermeture"
                                            id="heure_fermeture"
                                            value={formData.heure_fermeture}
                                            onChange={handleChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            required
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                            Description
                                        </label>
                                        <textarea
                                            name="description"
                                            id="description"
                                            rows={4}
                                            value={formData.description}
                                            onChange={handleChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (confirm('Êtes-vous sûr de vouloir supprimer ce restaurant ?')) {
                                                router.delete(route('restaurants.destroy', restaurant.id));
                                            }
                                        }}
                                        className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    >
                                        Supprimer le restaurant
                                    </button>

                                    <div className="flex space-x-4">
                                        <Link
                                            href={route('restaurants.show', restaurant.id)}
                                            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
                                        >
                                            Annuler
                                        </Link>
                                        <button
                                            type="submit"
                                            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            Enregistrer les modifications
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
