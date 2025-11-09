import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { ArrowLeft, Save } from 'lucide-react';

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

function formatPrice(n: number) {
    return `${Number(n).toFixed(2)} €`;
}

export default function AdminOrderShow({ order }: { order: Order }) {
    const [status, setStatus] = React.useState(order.status);
    const [saving, setSaving] = React.useState(false);

    const update = async () => {
        setSaving(true);
        try {
            const csrf = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null;
            const res = await fetch(`/admin/orders/${order.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrf?.content || '',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
                body: JSON.stringify({ status }),
            });
            if (res.ok) {
                router.reload({ only: ['order'] });
            } else {
                alert('Erreur lors de la mise à jour');
            }
        } finally {
            setSaving(false);
        }
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
            in_progress: 'En préparation',
            served: 'Servie',
            cancelled: 'Annulée',
        };
        return labels[status] || status;
    };

    return (
        <AdminLayout>
            <Head title={`Commande #${order.id}`} />
            <div className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto space-y-6">
                    <Button variant="ghost" asChild>
                        <Link href="/admin/orders">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Retour aux commandes
                        </Link>
                    </Button>

                    <Card className="border-border/50 shadow-lg">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-2xl font-semibold">
                                        Commande #{order.id}
                                    </CardTitle>
                                    <CardDescription className="mt-2 space-y-1">
                                        <div>{order.restaurant?.name} — Table {order.table?.table_number}</div>
                                        <div>{new Date(order.created_at).toLocaleString('fr-FR')}</div>
                                    </CardDescription>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Select
                                        value={status}
                                        onValueChange={(value) => setStatus(value as Order['status'])}
                                    >
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">En attente</SelectItem>
                                            <SelectItem value="in_progress">En préparation</SelectItem>
                                            <SelectItem value="served">Servie</SelectItem>
                                            <SelectItem value="cancelled">Annulée</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button onClick={update} disabled={saving}>
                                        <Save className="mr-2 h-4 w-4" />
                                        {saving ? 'Enregistrement...' : 'Mettre à jour'}
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Articles commandés</h3>
                                <div className="rounded-md border border-border overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Article</TableHead>
                                                <TableHead className="text-right">Quantité</TableHead>
                                                <TableHead className="text-right">Prix unitaire</TableHead>
                                                <TableHead className="text-right">Total</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {order.items.map((oi) => (
                                                <TableRow key={oi.id}>
                                                    <TableCell className="font-medium">
                                                        {oi.item?.name || 'Article inconnu'}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {oi.quantity}
                                                    </TableCell>
                                                    <TableCell className="text-right text-muted-foreground">
                                                        {formatPrice(oi.price)}
                                                    </TableCell>
                                                    <TableCell className="text-right font-medium">
                                                        {formatPrice(oi.price * oi.quantity)}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-border">
                                <span className="text-lg font-semibold">Total</span>
                                <span className="text-2xl font-bold text-primary">
                                    {formatPrice(order.total)}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}


