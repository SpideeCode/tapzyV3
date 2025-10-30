import React from 'react';
import { Link } from '@inertiajs/react';

interface PaginationProps {
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    className?: string;
}

export function Pagination({ links, className = '' }: PaginationProps) {
    if (links.length <= 3) {
        return null;
    }

    return (
        <div className={`flex items-center justify-between ${className}`}>
            <div className="flex-1 flex justify-between sm:hidden">
                {links[0].url && (
                    <Link
                        href={links[0].url}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                        Précédent
                    </Link>
                )}
                {links[links.length - 1].url && (
                    <Link
                        href={links[links.length - 1].url}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                        Suivant
                    </Link>
                )}
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700">
                        Affichage de <span className="font-medium">{links[1].label.split(' ')[1]}</span> à{' '}
                        <span className="font-medium">{links[links.length - 2].label.split(' ')[3]}</span> sur{' '}
                        <span className="font-medium">{links[links.length - 1].label.split(' ')[1]}</span> résultats
                    </p>
                </div>
                <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        {links.map((link, index) => {
                            if (index === 0) {
                                return (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                                            !link.url ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                                        }`}
                                        aria-label="Précédent"
                                    >
                                        <span className="sr-only">Précédent</span>
                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </Link>
                                );
                            }

                            if (index === links.length - 1) {
                                return (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                                            !link.url ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                                        }`}
                                        aria-label="Suivant"
                                    >
                                        <span className="sr-only">Suivant</span>
                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </Link>
                                );
                            }

                            return (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                        link.active
                                            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>
        </div>
    );
}

export default Pagination;
