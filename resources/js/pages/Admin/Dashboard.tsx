import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

const AdminDashboard = () => {
    const cards = [
        {
            title: 'Gestion des restaurants',
            description: 'Gérez les restaurants, les menus et les plats',
            link: '/admin/restaurants',
            icon: (
                <svg className="h-12 w-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            ),
            buttonText: 'Accéder',
            buttonClass: 'bg-indigo-600 hover:bg-indigo-700'
        },
        {
            title: 'Gestion des articles',
            description: 'Gérez les articles et les menus des restaurants',
            link: '/admin/items',
            icon: (
                <svg className="h-12 w-12 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            ),
            buttonText: 'Accéder',
            buttonClass: 'bg-purple-600 hover:bg-purple-700'
        },
        {
            title: 'Gestion des tables',
            description: 'Gérez les tables des restaurants et les QR codes',
            link: '/admin/tables',
            icon: (
                <svg className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
            ),
            buttonText: 'Accéder',
            buttonClass: 'bg-green-600 hover:bg-green-700'
        },
        {
            title: 'Statistiques',
            description: 'Visualisez les statistiques et les performances',
            link: '/admin/statistics',
            icon: (
                <svg className="h-12 w-12 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            buttonText: 'Voir',
            buttonClass: 'bg-yellow-600 hover:bg-yellow-700',
            disabled: true
        },
        {
            title: 'Paramètres',
            description: 'Configurez les paramètres de l\'application',
            link: '/admin/settings',
            icon: (
                <svg className="h-12 w-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            buttonText: 'Configurer',
            buttonClass: 'bg-gray-600 hover:bg-gray-700',
            disabled: true
        }
    ];

    return (
        <AdminLayout>
            <Head title="Tableau de bord d'administration" />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord d'administration</h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Gérer l'ensemble des fonctionnalités de votre application depuis ce tableau de bord.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
                        {cards.map((card, index) => (
                            <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            {card.icon}
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <h3 className="text-lg font-medium text-gray-900">{card.title}</h3>
                                            <p className="mt-1 text-sm text-gray-500">{card.description}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-5 py-3 text-right">
                                    <Link
                                        href={card.link}
                                        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${card.buttonClass} ${card.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        disabled={card.disabled}
                                    >
                                        {card.buttonText}
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
