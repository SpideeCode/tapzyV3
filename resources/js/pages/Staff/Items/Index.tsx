import React from 'react';
import { Head, Link } from '@inertiajs/react';
import StaffLayout from '@/layouts/StaffLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Pagination from '@/components/Pagination';
import { Plus, Edit, Trash2 } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface Item {
    id: number;
    name: string;
    description: string | null;
    price: number;
    available: boolean;
    restaurant: {
        id: number;
        name: string;
    };
}

interface IndexProps {
    items: {
        data: Item[];
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
        from: number;
        to: number;
        total: number;
    };
}

export default function Index({ items }: IndexProps) {
    return (
        <StaffLayout>
            <Head title="Gestion des articles" />
            <div className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <Card className="border-border/50 shadow-lg dark:bg-gray-800 dark:border-gray-700">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white">Gestion des articles</CardTitle>
                                    <CardDescription className="mt-1 text-gray-500 dark:text-gray-400">
                                        Gérez les articles et les menus
                                    </CardDescription>
                                </div>
                                <Button asChild>
                                    <Link href="/staff/items/create">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Ajouter un article
                                    </Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {items.data.length > 0 ? (
                                <div className="space-y-4">
                                    <div className="rounded-md border border-border overflow-hidden">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="text-gray-900 dark:text-white">Nom</TableHead>
                                                    <TableHead className="text-gray-900 dark:text-white">Restaurant</TableHead>
                                                    <TableHead className="text-gray-900 dark:text-white">Prix</TableHead>
                                                    <TableHead className="text-gray-900 dark:text-white">Statut</TableHead>
                                                    <TableHead className="text-right text-gray-900 dark:text-white">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {items.data.map((item) => (
                                                    <TableRow key={item.id}>
                                                        <TableCell>
                                                            <div className="font-medium text-gray-900 dark:text-white">{item.name}</div>
                                                            {item.description && (
                                                                <div className="text-sm text-muted-foreground dark:text-gray-400 line-clamp-2 mt-1">
                                                                    {item.description}
                                                                </div>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-gray-700 dark:text-gray-300">{item.restaurant.name}</TableCell>
                                                        <TableCell className="font-medium text-gray-900 dark:text-white">
                                                            {typeof item.price === 'number' ? item.price.toFixed(2) : parseFloat(item.price).toFixed(2)} €
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant={item.available ? 'success' : 'destructive'}>
                                                                {item.available ? 'Disponible' : 'Indisponible'}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <Button variant="ghost" size="sm" asChild>
                                                                    <Link href={`/staff/items/${item.id}/edit`}>
                                                                        <Edit className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                                                                    </Link>
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="text-destructive hover:text-destructive"
                                                                    asChild
                                                                >
                                                                    <Link
                                                                        href={`/staff/items/${item.id}`}
                                                                        method="delete"
                                                                        as="button"
                                                                        onClick={(e) => {
                                                                            if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
                                                                                e.preventDefault();
                                                                            }
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
                                    <Pagination
                                        links={items.links}
                                        from={items.from}
                                        to={items.to}
                                        total={items.total}
                                    />
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-muted-foreground mb-4 dark:text-gray-400">Aucun article enregistré pour le moment.</p>
                                    <Button asChild>
                                        <Link href="/staff/items/create">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Ajouter votre premier article
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </StaffLayout>
    );
}
