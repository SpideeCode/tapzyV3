import React, { useEffect, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import StaffLayout from '@/layouts/StaffLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, CheckCircle2, XCircle, ChefHat, Utensils } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    current_page: number;
    last_page: number;
};

interface PageProps {
    orders: Paginated<Order>;
    restaurants: Restaurant[];
    currentRestaurantId?: number | null;
    currentStatus?: string | null;
}

const statusConfig = {
    pending: {
        label: 'En attente',
        color: 'bg-yellow-500 hover:bg-yellow-600 text-white',
        badge: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: Clock,
    },
    in_progress: {
        label: 'En préparation',
        color: 'bg-blue-500 hover:bg-blue-600 text-white',
        badge: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: ChefHat,
    },
    served: {
        label: 'Servie',
        color: 'bg-green-500 hover:bg-green-600 text-white',
        badge: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle2,
    },
    cancelled: {
        label: 'Annulée',
        color: 'bg-red-500 hover:bg-red-600 text-white',
        badge: 'bg-red-100 text-red-800 border-red-200',
        icon: XCircle,
    },
};

function TimeAgo({ date }: { date: string }) {
    const [timeAgo, setTimeAgo] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const created = new Date(date);
            const diffInSeconds = Math.floor((now.getTime() - created.getTime()) / 1000);

            if (diffInSeconds < 60) {
                setTimeAgo('À l\'instant');
            } else {
                const minutes = Math.floor(diffInSeconds / 60);
                setTimeAgo(`${minutes} min`);
            }
        };

        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, [date]);

    return <span className="font-mono font-bold text-lg">{timeAgo}</span>;
}

export default function StaffOrders({ orders, restaurants, currentRestaurantId, currentStatus }: PageProps) {
    const [restaurantId, setRestaurantId] = useState<string>(currentRestaurantId ? String(currentRestaurantId) : '');
    const [status, setStatus] = useState<string>(currentStatus || '');
    const [updating, setUpdating] = useState<Record<number, boolean>>({});

    // Auto-refresh optimized to keep scroll position
    useEffect(() => {
        const id = setInterval(() => {
            router.reload({ only: ['orders'], preserveScroll: true, preserveState: true });
        }, 10000); // 10 seconds to reduce load
        return () => clearInterval(id);
    }, []);

    const applyFilters = (newRestaurantId?: string, newStatus?: string) => {
        const rId = newRestaurantId !== undefined ? newRestaurantId : restaurantId;
        const s = newStatus !== undefined ? newStatus : status;

        const params = new URLSearchParams();
        if (rId) params.set('restaurant_id', rId);
        if (s) params.set('status', s);

        router.visit(`/staff/orders?${params.toString()}`, { preserveState: true, preserveScroll: true });
    };

    const changeStatus = async (orderId: number, newStatus: string) => {
        setUpdating((prev) => ({ ...prev, [orderId]: true }));
        try {
            const getCsrf = () => {
                const meta = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null;
                return meta?.content || '';
            };

            const res = await fetch(`/staff/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCsrf(),
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                router.reload({ only: ['orders'], preserveScroll: true });
            } else {
                console.error('Failed to update status');
            }
        } catch (err) {
            console.error('Error updating status:', err);
        } finally {
            setUpdating((prev) => ({ ...prev, [orderId]: false }));
        }
    };

    return (
        <StaffLayout>
            <Head title="Cuisine - Commandes en cours" />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 transition-colors duration-300">
                <div className="max-w-[1600px] mx-auto space-y-6">
                    {/* Header & Filters */}
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
                                <Utensils className="w-6 h-6 text-primary dark:text-primary-foreground" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Cuisine</h1>
                                <p className="text-sm text-muted-foreground dark:text-gray-400">Vue en temps réel</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3 w-full md:w-auto">
                            <select
                                className="flex-1 md:w-48 rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-primary focus:border-primary"
                                value={restaurantId}
                                onChange={(e) => {
                                    setRestaurantId(e.target.value);
                                    applyFilters(e.target.value, undefined);
                                }}
                            >
                                <option value="">Tous les restaurants</option>
                                {restaurants.map((r) => (
                                    <option key={r.id} value={r.id}>{r.name}</option>
                                ))}
                            </select>

                            <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                                {['', 'pending', 'in_progress', 'served'].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => {
                                            setStatus(s);
                                            applyFilters(undefined, s);
                                        }}
                                        className={cn(
                                            "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                                            status === s
                                                ? "bg-white dark:bg-gray-600 text-primary dark:text-white shadow-sm"
                                                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-600/50"
                                        )}
                                    >
                                        {s === '' ? 'Tout' : statusConfig[s as keyof typeof statusConfig]?.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Orders Grid */}
                    {orders.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400 dark:text-gray-500">
                            <ChefHat className="w-16 h-16 mb-4 opacity-20" />
                            <p className="text-xl font-medium text-gray-600 dark:text-gray-300">Aucune commande en cours</p>
                            <p className="text-sm">C'est calme pour le moment...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {orders.data.map((order) => {
                                const StatusIcon = statusConfig[order.status].icon;

                                return (
                                    <Card key={order.id} className={cn(
                                        "flex flex-col border-l-4 shadow-sm hover:shadow-md transition-all dark:bg-gray-800 dark:border-gray-700",
                                        order.status === 'pending' ? "border-l-yellow-500" :
                                            order.status === 'in_progress' ? "border-l-blue-500" :
                                                order.status === 'served' ? "border-l-green-500" : "border-l-gray-300"
                                    )}>
                                        <CardHeader className="pb-3 space-y-0">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-2xl font-black text-gray-900 dark:text-white">
                                                            Table {order.table?.table_number}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground dark:text-gray-400">#{order.id}</span>
                                                    </div>
                                                    <div className="text-sm font-medium text-muted-foreground dark:text-gray-400 truncate max-w-[150px]">
                                                        {order.restaurant?.name}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-gray-900 dark:text-gray-100">
                                                        <TimeAgo date={order.created_at} />
                                                    </div>
                                                    <Badge variant="outline" className={cn("mt-1 block w-fit ml-auto", statusConfig[order.status].badge)}>
                                                        <StatusIcon className="w-3 h-3 mr-1 inline" />
                                                        {statusConfig[order.status].label}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="flex-1 py-2">
                                            <div className="space-y-3">
                                                {order.items.map((oi) => (
                                                    <div key={oi.id} className="flex justify-between items-start group">
                                                        <div className="flex gap-3">
                                                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 text-sm font-bold text-gray-900 dark:text-white group-hover:bg-primary group-hover:text-white transition-colors">
                                                                {oi.quantity}
                                                            </span>
                                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200 leading-tight pt-0.5">
                                                                {oi.item?.name}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>

                                        <CardFooter className="pt-3 border-t bg-gray-50/50 dark:bg-gray-900/50 dark:border-gray-700">
                                            <div className="grid grid-cols-2 gap-2 w-full">
                                                {order.status === 'pending' && (
                                                    <Button
                                                        className="w-full col-span-2 bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg font-semibold shadow-md hover:shadow-lg transition-all"
                                                        onClick={() => changeStatus(order.id, 'in_progress')}
                                                        disabled={updating[order.id]}
                                                    >
                                                        {updating[order.id] ? '...' : 'Lancer'}
                                                    </Button>
                                                )}

                                                {order.status === 'in_progress' && (
                                                    <Button
                                                        className="w-full col-span-2 bg-green-600 hover:bg-green-700 text-white h-12 text-lg font-semibold shadow-md hover:shadow-lg transition-all"
                                                        onClick={() => changeStatus(order.id, 'served')}
                                                        disabled={updating[order.id]}
                                                    >
                                                        {updating[order.id] ? '...' : 'Servir'}
                                                    </Button>
                                                )}

                                                {(order.status === 'served' || order.status === 'cancelled') && (
                                                    <div className="col-span-2 text-center text-sm text-muted-foreground dark:text-gray-400 py-2 font-medium">
                                                        Commande terminée
                                                    </div>
                                                )}

                                                {order.status !== 'served' && order.status !== 'cancelled' && (
                                                    <Button
                                                        variant="ghost"
                                                        className="col-span-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 h-8 text-xs"
                                                        onClick={() => {
                                                            if (confirm('Annuler cette commande ?')) changeStatus(order.id, 'cancelled');
                                                        }}
                                                        disabled={updating[order.id]}
                                                    >
                                                        Annuler
                                                    </Button>
                                                )}
                                            </div>
                                        </CardFooter>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </StaffLayout>
    );
}

