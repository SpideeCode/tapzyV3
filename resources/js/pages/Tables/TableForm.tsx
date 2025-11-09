import React, { useEffect, useState, useCallback } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import debounce from 'lodash/debounce';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface Restaurant {
    id: number;
    name: string;
}

interface TableFormProps {
    table?: {
        id?: number;
        table_number: string;
        qr_code?: string | null;
        restaurant_id: number;
    };
    restaurants: Restaurant[];
    existingTables?: Array<{
        id: number;
        table_number: string;
        restaurant_id: number;
    }>;
}

export default function TableForm({ table, restaurants, existingTables = [] }: TableFormProps) {
    const [isChecking, setIsChecking] = useState(false);
    const [tableStatus, setTableStatus] = useState<{ available: boolean | null; message: string }>({ 
        available: null, 
        message: '' 
    });

    const form = useForm({
        table_number: table?.table_number || '',
        restaurant_id: table?.restaurant_id || '',
        qr_code: null as File | null,
    });

    // Vérification en temps réel de la disponibilité du numéro de table
    const checkTableNumber = useCallback(
        debounce(async (tableNumber: string, restaurantId: string | number) => {
            if (!tableNumber || !restaurantId) {
                setTableStatus({ available: null, message: '' });
                return;
            }

            try {
                setIsChecking(true);
                const response = await fetch(
                    `/admin/tables/check-availability?table_number=${encodeURIComponent(tableNumber)}&restaurant_id=${restaurantId}${table?.id ? `&except=${table.id}` : ''}`
                );
                const data = await response.json();
                setTableStatus({
                    available: data.available,
                    message: data.message || ''
                });
                return data;
            } catch (error) {
                console.error('Erreur lors de la vérification du numéro de table:', error);
                setTableStatus({
                    available: null,
                    message: 'Erreur lors de la vérification'
                });
            } finally {
                setIsChecking(false);
            }
        }, 500),
        [table?.id]
    );

    // Effet pour déclencher la vérification quand le numéro de table ou le restaurant change
    useEffect(() => {
        if (form.data.table_number && form.data.restaurant_id) {
            checkTableNumber(form.data.table_number, form.data.restaurant_id);
        } else {
            setTableStatus({ available: null, message: '' });
        }

        return () => {
            checkTableNumber.cancel();
        };
    }, [form.data.table_number, form.data.restaurant_id, checkTableNumber]);

    const validateForm = () => {
        form.clearErrors();
        let isValid = true;

        if (!form.data.restaurant_id) {
            form.setError('restaurant_id', 'Veuillez sélectionner un restaurant');
            isValid = false;
        }

        if (!form.data.table_number.trim()) {
            form.setError('table_number', 'Le numéro de table est requis');
            isValid = false;
        } else if (tableStatus.available === false) {
            form.setError('table_number', tableStatus.message || 'Ce numéro de table est déjà utilisé');
            isValid = false;
        } else if (isChecking) {
            form.setError('table_number', 'Vérification en cours...');
            isValid = false;
        }

        return isValid;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        const formData = new FormData();
        formData.append('table_number', form.data.table_number);
        formData.append('restaurant_id', String(form.data.restaurant_id));
        if (form.data.qr_code) {
            formData.append('qr_code', form.data.qr_code);
        }
        
        if (table?.id) {
            router.post(`/admin/tables/${table.id}`, {
                _method: 'put',
                ...form.data,
            }, {
                forceFormData: true,
                onSuccess: () => form.reset(),
                onError: (errors) => {
                    if (errors.table_number) {
                        form.setError('table_number', errors.table_number);
                    }
                },
            });
        } else {
            router.post('/admin/tables', formData, {
                onSuccess: () => form.reset(),
                onError: (errors) => {
                    if (errors.table_number) {
                        form.setError('table_number', errors.table_number);
                    }
                },
            });
        }
    };

    return (
        <Card className="border-border/50 shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold">
                    {table?.id ? 'Modifier la table' : 'Créer une nouvelle table'}
                </CardTitle>
                <CardDescription>
                    {table?.id 
                        ? 'Mettez à jour les informations de la table' 
                        : 'Remplissez les informations pour créer une nouvelle table'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="restaurant_id">
                                Restaurant <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                value={String(form.data.restaurant_id) || ''}
                                onValueChange={(value) => form.setData('restaurant_id', value)}
                                required
                            >
                                <SelectTrigger id="restaurant_id" className="w-full">
                                    <SelectValue placeholder="Sélectionnez un restaurant" />
                                </SelectTrigger>
                                <SelectContent>
                                    {restaurants.map((restaurant) => (
                                        <SelectItem key={restaurant.id} value={String(restaurant.id)}>
                                            {restaurant.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={form.errors.restaurant_id} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="table_number">
                                Numéro de table <span className="text-destructive">*</span>
                            </Label>
                            <div className="relative">
                                <Input
                                    type="text"
                                    id="table_number"
                                    value={form.data.table_number}
                                    onChange={(e) => {
                                        form.setData('table_number', e.target.value);
                                        if (e.target.value !== form.data.table_number) {
                                            setTableStatus({ available: null, message: '' });
                                        }
                                    }}
                                    placeholder="Ex: Table 1"
                                    required
                                    disabled={isChecking}
                                    className={`w-full pr-10 ${
                                        tableStatus.available === false 
                                            ? 'border-destructive' 
                                            : tableStatus.available === true 
                                                ? 'border-green-500'
                                                : ''
                                    }`}
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    {isChecking && (
                                        <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
                                    )}
                                    {!isChecking && tableStatus.available === true && (
                                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    )}
                                    {!isChecking && tableStatus.available === false && (
                                        <XCircle className="h-5 w-5 text-destructive" />
                                    )}
                                </div>
                            </div>
                            {tableStatus.message && (
                                <p className={`text-sm ${
                                    tableStatus.available === true 
                                        ? 'text-green-600' 
                                        : tableStatus.available === false 
                                            ? 'text-destructive' 
                                            : 'text-muted-foreground'
                                }`}>
                                    {tableStatus.message}
                                </p>
                            )}
                            <InputError message={form.errors.table_number} />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="qr_code">QR Code (optionnel)</Label>
                            <Input
                                type="file"
                                id="qr_code"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        form.setData('qr_code', e.target.files[0]);
                                    }
                                }}
                                accept="image/*"
                                className="w-full cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                            />
                            <InputError message={form.errors.qr_code} />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-border">
                        <Button
                            type="button"
                            variant="outline"
                            asChild
                        >
                            <Link href="/admin/tables">Annuler</Link>
                        </Button>
                        <Button
                            type="submit"
                            disabled={form.processing || isChecking}
                            className="min-w-[120px]"
                        >
                            {form.processing ? (
                                <>
                                    <Spinner className="mr-2" />
                                    Enregistrement...
                                </>
                            ) : (
                                'Enregistrer'
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
