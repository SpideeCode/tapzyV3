import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { ArrowLeft, Edit, Package } from 'lucide-react';

interface Item {
    id: number;
    name: string;
    price: number;
    is_available: boolean;
}

interface Category {
    id: number;
    name: string;
    description: string | null;
    order: number;
    is_active: boolean;
    items: Item[];
}

interface ShowProps {
    category: Category;
}

export default function Show({ category }: ShowProps) {
    return (
        <AdminLayout>
            <Head title={`Détails de ${category.name}`} />
            
            <div className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto space-y-6">
                    <Button variant="ghost" asChild>
                        <Link href="/admin/categories">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Retour à la liste
                        </Link>
                    </Button>

                    <Card className="border-border/50 shadow-lg">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="text-2xl font-semibold">
                                        {category.name}
                                    </CardTitle>
                                    <CardDescription className="mt-1">
                                        Détails de la catégorie
                                    </CardDescription>
                                </div>
                                <Button asChild>
                                    <Link href={`/admin/categories/${category.id}/edit`}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Modifier
                                    </Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Nom</label>
                                    <p className="mt-1 text-sm font-medium">{category.name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Statut</label>
                                    <div className="mt-1">
                                        <Badge variant={category.is_active ? 'success' : 'destructive'}>
                                            {category.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Ordre d'affichage</label>
                                    <p className="mt-1 text-sm">{category.order}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-sm font-medium text-muted-foreground">Description</label>
                                    <p className="mt-1 text-sm whitespace-pre-line">
                                        {category.description || 'Aucune description'}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 shadow-lg">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                <CardTitle className="text-xl font-semibold">
                                    Articles de cette catégorie
                                </CardTitle>
                            </div>
                            <CardDescription>
                                {category.items.length} article(s) trouvé(s)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {category.items.length > 0 ? (
                                <div className="rounded-md border border-border overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Article</TableHead>
                                                <TableHead>Prix</TableHead>
                                                <TableHead>Statut</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {category.items.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell className="font-medium">
                                                        {item.name}
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.price.toFixed(2)} €
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={item.is_available ? 'success' : 'destructive'}>
                                                            {item.is_available ? 'Disponible' : 'Indisponible'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="sm" asChild>
                                                            <Link href={`/admin/items/${item.id}/edit`}>
                                                                Voir
                                                            </Link>
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                                    <p className="text-muted-foreground">
                                        Aucun article n'est associé à cette catégorie pour le moment.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
