import React from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import Pagination from '@/components/pagination';
import { Eye } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

type Item = { id: number; name: string };
type OrderItem = { id: number; quantity: number; price: number; item: Item };

type Table = { id: number; table_number: string };
type Restaurant = { id: number; name: string };

type Order = {
    id: number;
    status: 'pending' | 'in_progress' | 'served' | 'cancelled';
    total: number;
    restaurant: Restaurant;
    table: Table;
    items: OrderItem[];
    created_at: string;
};

type Paginated<T> = {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
};

interface PageProps {
    orders: Paginated<Order>;
    restaurants: Restaurant[];
    currentRestaurantId?: number | null;
}

function formatPrice(n: number) {
    return `${Number(n).toFixed(2)} €`;
}

export default function AdminOrdersIndex({ orders, restaurants, currentRestaurantId }: PageProps) {
    const { url } = usePage();
    const [restaurantId, setRestaurantId] = React.useState<string>(currentRestaurantId ? String(currentRestaurantId) : 'all');

    const onFilter = (e: React.FormEvent) => {
        e.preventDefault();
        const q = restaurantId && restaurantId !== 'all' ? `?restaurant_id=${restaurantId}` : '';
        window.location.href = `/admin/orders${q}`;
    };

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'served':
                return 'success';
            case 'in_progress':
                return 'info';
            case 'cancelled':
                return 'destructive';
            default:
                return 'warning';
        }
    };

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            pending: 'En attente',
            in_progress: 'En cours',
            served: 'Servie',
            cancelled: 'Annulée',
        };
        return labels[status] || status;
    };

    return (
        <AdminLayout>
            <Head title="Commandes" />
            <div className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <Card className="border-border/50 shadow-lg">
                        <CardHeader>
                            <div>
                                <CardTitle className="text-2xl font-semibold">Gestion des commandes</CardTitle>
                                <CardDescription className="mt-1">
                                    Consultez et gérez les commandes des clients
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <Card className="border-border/50">
                                <CardContent className="pt-6">
                                    <form onSubmit={onFilter} className="flex flex-wrap gap-4 items-end">
                                        <div className="flex-1 min-w-[200px]">
                                            <Label htmlFor="restaurant">Filtrer par restaurant</Label>
                                            <Select
                                                value={restaurantId}
                                                onValueChange={setRestaurantId}
                                            >
                                                <SelectTrigger id="restaurant" className="w-full">
                                                    <SelectValue placeholder="Tous les restaurants" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">Tous</SelectItem>
                                                    {restaurants.map((r) => (
                                                        <SelectItem key={r.id} value={String(r.id)}>
                                                            {r.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <Button type="submit">Appliquer le filtre</Button>
                                    </form>
                                </CardContent>
                            </Card>

                            {orders.data.length > 0 ? (
                                <div className="space-y-4">
                                    <div className="rounded-md border border-border overflow-hidden">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>#</TableHead>
                                                    <TableHead>Restaurant</TableHead>
                                                    <TableHead>Table</TableHead>
                                                    <TableHead>Statut</TableHead>
                                                    <TableHead>Total</TableHead>
                                                    <TableHead>Créée le</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {orders.data.map((o) => (
                                                    <TableRow key={o.id}>
                                                        <TableCell className="font-medium">#{o.id}</TableCell>
                                                        <TableCell>{o.restaurant?.name || 'N/A'}</TableCell>
                                                        <TableCell>{o.table?.table_number || 'N/A'}</TableCell>
                                                        <TableCell>
                                                            <Badge variant={getStatusBadgeVariant(o.status) as any}>
                                                                {getStatusLabel(o.status)}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="font-medium">{formatPrice(o.total)}</TableCell>
                                                        <TableCell className="text-muted-foreground">
                                                            {new Date(o.created_at).toLocaleString('fr-FR')}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Button variant="ghost" size="sm" asChild>
                                                                <Link href={`/admin/orders/${o.id}`}>
                                                                    <Eye className="h-4 w-4 mr-1" />
                                                                    Détails
                                                                </Link>
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                    {orders.links && orders.links.length > 0 && (
                                        <Pagination links={orders.links} />
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-muted-foreground">Aucune commande trouvée.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}


