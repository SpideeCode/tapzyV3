import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';

const AdminLayout = ({ children }) => {
    const { url } = usePage();
    
    const navItems = [
        { href: '/admin/dashboard', label: 'Tableau de bord' },
        { href: '/admin/restaurants', label: 'Restaurants' },
        { href: '/admin/tables', label: 'Tables' },
        { href: '/admin/orders', label: 'Commandes' },
        { href: '/admin/items', label: 'Articles' },
        { href: '/admin/users', label: 'Utilisateurs' },
        { href: '/admin/categories', label: 'Catégories' },
    ];

    const isActive = (href) => url.startsWith(href);

    return (
        <div className="min-h-screen flex flex-col bg-background">
            {/* Navigation */}
            <nav className="bg-card border-b border-border/50 shadow-sm sticky top-0 z-50 backdrop-blur-sm bg-card/95">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <Link href="/admin/dashboard" className="text-xl font-bold text-primary">
                                    Tapzy Admin
                                </Link>
                            </div>
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-1">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                            isActive(item.href)
                                                ? "bg-primary/10 text-primary"
                                                : "text-muted-foreground hover:text-foreground hover:bg-accent"
                                        )}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:items-center">
                            <Link 
                                href="/dashboard"
                                className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Tableau de bord utilisateur
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Page Content */}
            <main className="flex-1">{children}</main>

            {/* Footer */}
            <footer className="bg-card border-t border-border/50 mt-auto">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-muted-foreground text-sm">
                        &copy; {new Date().getFullYear()} Tapzy. Tous droits réservés.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default AdminLayout;
