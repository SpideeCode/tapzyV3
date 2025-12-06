import React, { ReactNode } from 'react';
import { Link } from '@inertiajs/react';
import { useCart } from '@/hooks/use-cart';

interface AppLayoutProps {
    children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    const { count } = useCart();
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            {/* En-tête */}
            <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <Link href="/" className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                            Tapzy
                        </Link>
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/cart"
                                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white relative transition-colors"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                                <span className="absolute -top-2 -right-2 bg-indigo-600 dark:bg-indigo-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {count}
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Contenu principal */}
            <main className="py-6">
                {children}
            </main>

            {/* Pied de page */}
            <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12 transition-colors">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
                        &copy; {new Date().getFullYear()} Tapzy. Tous droits réservés.
                    </p>
                </div>
            </footer>
        </div>
    );
}
