import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

interface Restaurant {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    restaurant: Restaurant | null;
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

interface UsersIndexProps {
    users: PaginatedData<User>;
}

const roleLabels: Record<string, string> = {
    admin: 'Administrateur',
    manager: 'Gérant',
    staff: 'Employé'
};

export default function UsersIndex({ users }: UsersIndexProps) {
    return (
        <AdminLayout>
            <Head title="Gestion des utilisateurs" />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">Gestion des utilisateurs</h2>
                                <Link 
                                    href="/admin/users/create" 
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                                >
                                    Ajouter un utilisateur
                                </Link>
                            </div>

                            {users.data.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Restaurant</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {users.data.map((user) => (
                                                <tr key={user.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-500">{user.email}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                            ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                                                              user.role === 'manager' ? 'bg-blue-100 text-blue-800' : 
                                                              'bg-green-100 text-green-800'}`}>
                                                            {roleLabels[user.role] || user.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-500">
                                                            {user.restaurant?.name || 'Aucun'}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <Link 
                                                            href={`/admin/users/${user.id}/edit`}
                                                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                        >
                                                            Modifier
                                                        </Link>
                                                        <Link 
                                                            href={`/admin/users/${user.id}`}
                                                            method="delete"
                                                            as="button"
                                                            className="text-red-600 hover:text-red-900"
                                                            onBefore={() => {
                                                                return confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?');
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
                                    {users.links.length > 3 && (
                                        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                                            <div className="flex-1 flex justify-between sm:hidden">
{users.links[0]?.url && (
                                                    <Link 
                                                        href={users.links[0].url as string} 
                                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                                    >
                                                        Précédent
                                                    </Link>
                                                )}
                                                {users.links[users.links.length - 1]?.url && (
                                                    <Link 
                                                        href={users.links[users.links.length - 1].url as string} 
                                                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                                    >
                                                        Suivant
                                                    </Link>
                                                )}
                                            </div>
                                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                                <div>
                                                    <p className="text-sm text-gray-700">
                                                        Affichage de <span className="font-medium">{users.from}</span> à <span className="font-medium">{users.to}</span> sur <span className="font-medium">{users.total}</span> résultats
                                                    </p>
                                                </div>
                                                <div>
                                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                                        {users.links.map((link, index) => (
                                                            <React.Fragment key={index}>
                                                                {link.url ? (
                                                                    <Link
                                                                        href={link.url}
                                                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                                            link.active 
                                                                                ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' 
                                                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                                        }`}
                                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                                    />
                                                                ) : (
                                                                    <span 
                                                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                                    />
                                                                )}
                                                            </React.Fragment>
                                                        ))}
                                                    </nav>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-gray-500">Aucun utilisateur enregistré pour le moment.</p>
                                    <Link
                                        href="/admin/users/create"
                                        className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 mt-4"
                                    >
                                        Ajouter votre premier utilisateur
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
