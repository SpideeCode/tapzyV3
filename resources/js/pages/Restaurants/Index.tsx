import React from 'react';
import { Head, Link } from "@inertiajs/react";
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Pagination from '@/components/pagination';
import { Plus, Edit, Trash2 } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface Restaurant {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

interface Pagination {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    restaurants: Restaurant[];
    pagination: Pagination;
}

export default function AdminRestaurantsIndex({ restaurants, pagination }: Props) {
    const links = [];
    if (pagination.last_page > 1) {
        for (let i = 1; i <= pagination.last_page; i++) {
            links.push({
                url: `/admin/restaurants?page=${i}`,
                label: String(i),
                active: i === pagination.current_page,
            });
        }
    }

    return (
        <AdminLayout>
            <Head title="Gestion des restaurants" />
            
            <div className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <Card className="border-border/50 shadow-lg">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="text-2xl font-semibold">Gestion des restaurants</CardTitle>
                                    <CardDescription className="mt-1">
                                        Gérez les restaurants et leurs informations
                                    </CardDescription>
                                </div>
                                <Button asChild>
                                    <Link href="/admin/restaurants/create">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Ajouter un restaurant
                                    </Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {restaurants.length > 0 ? (
                                <div className="space-y-4">
                                    <div className="rounded-md border border-border overflow-hidden">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Nom</TableHead>
                                                    <TableHead>Créé le</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {restaurants.map((restaurant) => (
                                                    <TableRow key={restaurant.id}>
                                                        <TableCell className="font-medium">{restaurant.name}</TableCell>
                                                        <TableCell className="text-muted-foreground">
                                                            {new Date(restaurant.created_at).toLocaleDateString('fr-FR')}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <Button variant="ghost" size="sm" asChild>
                                                                    <Link href={`/admin/restaurants/${restaurant.id}/edit`}>
                                                                        <Edit className="h-4 w-4" />
                                                                    </Link>
                                                                </Button>
                                                                <Button 
                                                                    variant="ghost" 
                                                                    size="sm"
                                                                    className="text-destructive hover:text-destructive"
                                                                    asChild
                                                                >
                                                                    <Link
                                                                        href={`/admin/restaurants/${restaurant.id}`}
                                                                        method="delete"
                                                                        as="button"
                                                                        onBefore={() => {
                                                                            return confirm('Êtes-vous sûr de vouloir supprimer ce restaurant ?');
                                                                        }}
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Link>
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                    {links.length > 0 && (
                                        <Pagination links={links} />
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-muted-foreground mb-4">Aucun restaurant enregistré pour le moment.</p>
                                    <Button asChild>
                                        <Link href="/admin/restaurants/create">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Ajouter un restaurant
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
