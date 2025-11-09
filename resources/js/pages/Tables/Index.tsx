import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Pagination from '@/components/pagination';
import { Plus, Edit, Trash2, QrCode, Download, RotateCw } from 'lucide-react';
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
}

interface Table {
    id: number;
    table_number: string;
    qr_code: string | null;
    restaurant: Restaurant;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedData<T> {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

interface TablesIndexProps {
    tables: PaginatedData<Table>;
}

export default function TablesIndex({ tables }: TablesIndexProps) {
    return (
        <AdminLayout>
            <Head title="Gestion des tables" />
            
            <div className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <Card className="border-border/50 shadow-lg">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="text-2xl font-semibold">Gestion des tables</CardTitle>
                                    <CardDescription className="mt-1">
                                        Gérez les tables des restaurants et leurs QR codes
                                    </CardDescription>
                                </div>
                                <Button asChild>
                                    <Link href="/admin/tables/create">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Ajouter une table
                                    </Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {tables.data.length > 0 ? (
                                <div className="space-y-4">
                                    <div className="rounded-md border border-border overflow-hidden">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Numéro de table</TableHead>
                                                    <TableHead>Restaurant</TableHead>
                                                    <TableHead>QR Code</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {tables.data.map((table) => (
                                                    <TableRow key={table.id}>
                                                        <TableCell className="font-medium">{table.table_number}</TableCell>
                                                        <TableCell className="text-muted-foreground">{table.restaurant.name}</TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-3">
                                                                {table.qr_code ? (
                                                                    <>
                                                                        <img 
                                                                            src={table.qr_code} 
                                                                            alt={`QR Code Table ${table.table_number}`}
                                                                            className="w-16 h-16 border border-border rounded-md"
                                                                        />
                                                                        <div className="flex flex-col gap-2">
                                                                            <Button variant="ghost" size="sm" asChild>
                                                                                <a 
                                                                                    href={table.qr_code} 
                                                                                    target="_blank" 
                                                                                    rel="noopener noreferrer"
                                                                                >
                                                                                    <Download className="h-4 w-4 mr-1" />
                                                                                    Télécharger
                                                                                </a>
                                                                            </Button>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                asChild
                                                                            >
                                                                                <Link
                                                                                    href={`/admin/tables/${table.id}/regenerate-qr`}
                                                                                    method="post"
                                                                                    as="button"
                                                                                >
                                                                                    <RotateCw className="h-4 w-4 mr-1" />
                                                                                    Régénérer
                                                                                </Link>
                                                                            </Button>
                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    <div className="flex items-center gap-2">
                                                                        <QrCode className="h-8 w-8 text-muted-foreground" />
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            asChild
                                                                        >
                                                                            <Link
                                                                                href={`/admin/tables/${table.id}/regenerate-qr`}
                                                                                method="post"
                                                                                as="button"
                                                                            >
                                                                                Générer QR Code
                                                                            </Link>
                                                                        </Button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <Button variant="ghost" size="sm" asChild>
                                                                    <Link href={`/admin/tables/${table.id}/edit`}>
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
                                                                        href={`/admin/tables/${table.id}`}
                                                                        method="delete"
                                                                        as="button"
                                                                        onBefore={() => {
                                                                            return confirm('Êtes-vous sûr de vouloir supprimer cette table ?');
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
                                        links={tables.links} 
                                        from={tables.from} 
                                        to={tables.to} 
                                        total={tables.total} 
                                    />
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-muted-foreground mb-4">Aucune table enregistrée pour le moment.</p>
                                    <Button asChild>
                                        <Link href="/admin/tables/create">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Ajouter votre première table
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
