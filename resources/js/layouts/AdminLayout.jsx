import React from 'react';
import { Link } from '@inertiajs/react';

const AdminLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navigation */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <Link href="/" className="text-xl font-bold text-gray-800">
                                    Tapzy Admin
                                </Link>
                            </div>
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                <Link 
                                    href="/admin/dashboard"
                                    className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                >
                                    Tableau de bord
                                </Link>
                                <Link 
                                    href="/admin/restaurants"
                                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                >
                                    Restaurants
                                </Link>
                                <Link 
                                    href="/admin/tables"
                                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                >
                                    Tables
                                </Link>
                                <Link 
                                    href="/admin/items"
                                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                >
                                    Articles
                                </Link>
                                <Link 
                                    href="/admin/users"
                                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                >
                                    Utilisateurs
                                </Link>
                                <Link 
                                    href="/admin/categories"
                                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                >
                                    Catégories
                                </Link>
                            </div>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:items-center">
<Link 
                                href="/dashboard"
                                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Tableau de bord utilisateur
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Page Content */}
            <main>{children}</main>

            {/* Footer */}
            <footer className="bg-white mt-12">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} Tapzy. Tous droits réservés.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default AdminLayout;
