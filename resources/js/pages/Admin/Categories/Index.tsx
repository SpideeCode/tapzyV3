import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

interface Category {
    id: number;
    name: string;
    description: string | null;
    order: number;
    is_active: boolean;
    items_count?: number;
}

interface IndexProps {
    categories: {
        data: Category[];
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
}

export default function Index({ categories }: IndexProps) {
    return (
        <AdminLayout>
            <Head title="Gestion des catégories" />
            
            <div className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <Card className="border-border/50 shadow-lg">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="text-2xl font-semibold">Gestion des catégories</CardTitle>
                                    <CardDescription className="mt-1">
                                        Organisez vos articles par catégories
                                    </CardDescription>
                                </div>
                                <Button asChild>
                                    <Link href="/admin/categories/create">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Nouvelle catégorie
                                    </Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {categories.data.length > 0 ? (
                                <div className="space-y-4">
                                    <div className="rounded-md border border-border overflow-hidden">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Nom</TableHead>
                                                    <TableHead>Description</TableHead>
                                                    <TableHead>Ordre</TableHead>
                                                    <TableHead>Statut</TableHead>
                                                    <TableHead>Articles</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {categories.data.map((category) => (
                                                    <TableRow key={category.id}>
                                                        <TableCell className="font-medium">{category.name}</TableCell>
                                                        <TableCell className="text-muted-foreground max-w-xs truncate">
                                                            {category.description || 'Aucune description'}
                                                        </TableCell>
                                                        <TableCell>{category.order}</TableCell>
                                                        <TableCell>
                                                            <Badge variant={category.is_active ? 'success' : 'destructive'}>
                                                                {category.is_active ? 'Active' : 'Inactive'}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>{category.items_count || 0}</TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <Button variant="ghost" size="sm" asChild>
                                                                    <Link href={`/admin/categories/${category.id}/edit`}>
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
                                                                        href={`/admin/categories/${category.id}`}
                                                                        method="delete"
                                                                        as="button"
                                                                        onBefore={() => {
                                                                            return confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?');
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
                                    {categories.links && categories.links.length > 0 && (
                                        <Pagination links={categories.links} />
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-muted-foreground mb-4">Aucune catégorie enregistrée pour le moment.</p>
                                    <Button asChild>
                                        <Link href="/admin/categories/create">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Créer votre première catégorie
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
