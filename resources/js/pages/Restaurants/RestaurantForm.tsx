import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface RestaurantFormProps {
    restaurant?: {
        id?: number;
        name: string;
    };
}

interface FormData {
    name: string;
}

export default function RestaurantForm({ restaurant }: RestaurantFormProps) {
    const { data, setData, post, put, processing, errors } = useForm<FormData>({
        name: restaurant?.name || ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (restaurant?.id) {
            put(`/admin/restaurants/${restaurant.id}`);
        } else {
            post('/admin/restaurants');
        }
    };

    return (
        <AdminLayout>
            <Head title={restaurant ? 'Modifier le restaurant' : 'Ajouter un restaurant'} />
            
            <div className="py-6">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <Card className="border-border/50 shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-2xl font-semibold">
                                {restaurant ? 'Modifier le restaurant' : 'Ajouter un nouveau restaurant'}
                            </CardTitle>
                            <CardDescription>
                                {restaurant 
                                    ? 'Mettez à jour les informations du restaurant' 
                                    : 'Remplissez les informations pour créer un nouveau restaurant'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">
                                        Nom du restaurant <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        type="text"
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Nom du restaurant"
                                        required
                                        autoFocus
                                        className="w-full"
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-border">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        asChild
                                    >
                                        <Link href="/admin/restaurants">Annuler</Link>
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="min-w-[120px]"
                                    >
                                        {processing ? 'Enregistrement...' : 'Enregistrer'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
