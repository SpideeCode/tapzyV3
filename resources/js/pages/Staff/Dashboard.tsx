import React from 'react';
import { Head, Link } from '@inertiajs/react';
import StaffLayout from '@/layouts/StaffLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Table2, ShoppingCart, LayoutDashboard } from 'lucide-react';

const StaffDashboard = () => {
    const cards = [
        {
            title: 'Commandes en cours',
            description: 'Gérez les commandes en temps réel',
            link: '/staff/orders',
            icon: ShoppingCart,
            color: 'text-blue-600',
        },
        {
            title: 'Gestion des tables',
            description: 'Gérez les tables et les QR codes',
            link: '/staff/tables',
            icon: Table2,
            color: 'text-green-600',
        },
        {
            title: 'Gestion des articles',
            description: 'Gérez la disponibilité des articles',
            link: '/staff/items',
            icon: Package,
            color: 'text-purple-600',
        },
    ];

    return (
        <StaffLayout>
            <Head title="Espace Staff" />

            <div className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-foreground">Espace Staff</h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Bienvenue dans votre espace de gestion.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {cards.map((card, index) => {
                            const Icon = card.icon;
                            return (
                                <Card key={index} className="border-border/50 shadow-lg hover:shadow-xl transition-shadow dark:bg-gray-800 dark:border-gray-700">
                                    <CardHeader>
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-lg bg-primary/10 ${card.color}`}>
                                                <Icon className="h-6 w-6" />
                                            </div>
                                            <div className="flex-1">
                                                <CardTitle className="text-lg text-gray-900 dark:text-white">{card.title}</CardTitle>
                                            </div>
                                        </div>
                                        <CardDescription className="mt-2 text-gray-500 dark:text-gray-400">
                                            {card.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Button
                                            asChild
                                            className="w-full"
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
        </StaffLayout>
    );
};

export default StaffDashboard;
