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

interface Restaurant {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    restaurant: Restaurant | null;
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

interface UsersIndexProps {
    users: PaginatedData<User>;
}

const roleLabels: Record<string, string> = {
    admin: 'Administrateur',
    manager: 'Gérant',
    staff: 'Employé'
};

export default function UsersIndex({ users }: UsersIndexProps) {
    const getRoleBadgeVariant = (role: string) => {
        switch (role) {
            case 'admin':
                return 'destructive';
            case 'manager':
                return 'info';
            default:
                return 'success';
        }
    };

    return (
        <AdminLayout>
            <Head title="Gestion des utilisateurs" />
            
            <div className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <Card className="border-border/50 shadow-lg">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="text-2xl font-semibold">Gestion des utilisateurs</CardTitle>
                                    <CardDescription className="mt-1">
                                        Gérez les utilisateurs et leurs permissions
                                    </CardDescription>
                                </div>
                                <Button asChild>
                                    <Link href="/admin/users/create">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Ajouter un utilisateur
                                    </Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {users.data.length > 0 ? (
                                <div className="space-y-4">
                                    <div className="rounded-md border border-border overflow-hidden">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Nom</TableHead>
                                                    <TableHead>Email</TableHead>
                                                    <TableHead>Rôle</TableHead>
                                                    <TableHead>Restaurant</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {users.data.map((user) => (
                                                    <TableRow key={user.id}>
                                                        <TableCell className="font-medium">{user.name}</TableCell>
                                                        <TableCell className="text-muted-foreground">{user.email}</TableCell>
                                                        <TableCell>
                                                            <Badge variant={getRoleBadgeVariant(user.role) as any}>
                                                                {roleLabels[user.role] || user.role}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-muted-foreground">
                                                            {user.restaurant?.name || 'Aucun'}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <Button variant="ghost" size="sm" asChild>
                                                                    <Link href={`/admin/users/${user.id}/edit`}>
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
                                                                        href={`/admin/users/${user.id}`}
                                                                        method="delete"
                                                                        as="button"
                                                                        onBefore={() => {
                                                                            return confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?');
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
                                        links={users.links} 
                                        from={users.from} 
                                        to={users.to} 
                                        total={users.total} 
                                    />
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-muted-foreground mb-4">Aucun utilisateur enregistré pour le moment.</p>
                                    <Button asChild>
                                        <Link href="/admin/users/create">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Ajouter votre premier utilisateur
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
