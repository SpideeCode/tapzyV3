import React, { ReactNode } from 'react';
import { Link } from '@inertiajs/react';

interface AppLayoutProps {
    children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* En-tête */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <Link href="/" className="text-xl font-bold text-indigo-600">
                            Tapzy
                        </Link>
                        <div className="flex items-center space-x-4">
                            <Link 
                                href="/cart" 
                                className="text-gray-600 hover:text-gray-900 relative"
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
                                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    0
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
            <footer className="bg-white border-t border-gray-200 mt-12">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} Tapzy. Tous droits réservés.
                    </p>
                </div>
            </footer>
        </div>
    );
}
