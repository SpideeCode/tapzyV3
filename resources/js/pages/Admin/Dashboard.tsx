import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Package, Table2, ShoppingCart, BarChart3, Settings } from 'lucide-react';

const AdminDashboard = () => {
    const cards = [
        {
            title: 'Gestion des restaurants',
            description: 'Gérez les restaurants, les menus et les plats',
            link: '/admin/restaurants',
            icon: Building2,
            color: 'text-blue-600',
        },
        {
            title: 'Gestion des articles',
            description: 'Gérez les articles et les menus des restaurants',
            link: '/admin/items',
            icon: Package,
            color: 'text-purple-600',
        },
        {
            title: 'Gestion des tables',
            description: 'Gérez les tables des restaurants et les QR codes',
            link: '/admin/tables',
            icon: Table2,
            color: 'text-green-600',
        },
        {
            title: 'Gestion des commandes',
            description: 'Consultez et gérez les commandes des clients',
            link: '/admin/orders',
            icon: ShoppingCart,
            color: 'text-red-600',
        },
        {
            title: 'Gestion des utilisateurs',
            description: 'Gérez les utilisateurs et leurs permissions',
            link: '/admin/users',
            icon: Package,
            color: 'text-indigo-600',
        },
        {
            title: 'Gestion des catégories',
            description: 'Organisez vos articles par catégories',
            link: '/admin/categories',
            icon: Package,
            color: 'text-orange-600',
        },
        {
            title: 'Statistiques',
            description: 'Visualisez les statistiques et les performances',
            link: '/admin/statistics',
            icon: BarChart3,
            color: 'text-yellow-600',
        },
        {
            title: 'Paramètres',
            description: 'Configurez les paramètres de l\'application',
            link: '/admin/settings',
            icon: Settings,
            color: 'text-gray-600',
            disabled: true,
        }
    ];

    return (
        <AdminLayout>
            <Head title="Tableau de bord d'administration" />
            
            <div className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-foreground">Tableau de bord d'administration</h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Gérer l'ensemble des fonctionnalités de votre application depuis ce tableau de bord.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {cards.map((card, index) => {
                            const Icon = card.icon;
                            return (
                                <Card key={index} className="border-border/50 shadow-lg hover:shadow-xl transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-lg bg-primary/10 ${card.color}`}>
                                                <Icon className="h-6 w-6" />
                                            </div>
                                            <div className="flex-1">
                                                <CardTitle className="text-lg">{card.title}</CardTitle>
                                            </div>
                                        </div>
                                        <CardDescription className="mt-2">
                                            {card.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Button
                                            asChild
                                            className="w-full"
                                            disabled={card.disabled}
                                        >
                                            <Link href={card.link}>
                                                Accéder
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
