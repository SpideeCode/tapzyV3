import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import InputError from '@/components/input-error';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface CategoryFormProps {
    category?: {
        id?: number;
        name: string;
        description: string | null;
        order: number;
        is_active: boolean;
    };
}

export default function CategoryForm({ category }: CategoryFormProps) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: category?.name || '',
        description: category?.description || '',
        order: category?.order || 0,
        is_active: category?.is_active ?? true,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (category?.id) {
            put(`/admin/categories/${category.id}`);
        } else {
            post('/admin/categories');
        }
    };

    return (
        <Card className="border-border/50 shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold">
                    {category?.id ? 'Modifier la catégorie' : 'Créer une nouvelle catégorie'}
                </CardTitle>
                <CardDescription>
                    {category?.id 
                        ? 'Mettez à jour les informations de la catégorie' 
                        : 'Remplissez les informations pour créer une nouvelle catégorie'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={submit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">
                            Nom de la catégorie <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="name"
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Nom de la catégorie"
                            required
                            autoFocus
                            className="w-full"
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            rows={4}
                            value={data.description || ''}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Description de la catégorie (optionnel)"
                            className="w-full"
                        />
                        <InputError message={errors.description} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="order">Ordre d'affichage</Label>
                            <Input
                                id="order"
                                type="number"
                                value={data.order}
                                onChange={(e) => setData('order', parseInt(e.target.value) || 0)}
                                placeholder="0"
                                min="0"
                                className="w-full"
                            />
                            <InputError message={errors.order} />
                        </div>

                        <div className="space-y-2">
                            <Label>Statut</Label>
                            <div className="flex items-center space-x-3 pt-2">
                                <Checkbox
                                    id="is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(checked) => setData('is_active', checked === true)}
                                />
                                <div className="space-y-1">
                                    <label 
                                        htmlFor="is_active" 
                                        className="text-sm font-medium leading-none cursor-pointer"
                                    >
                                        Catégorie active
                                    </label>
                                    <p className="text-sm text-muted-foreground">
                                        Si désactivé, la catégorie ne sera pas visible sur le site.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.history.back()}
                        >
                            Annuler
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={processing}
                            className="min-w-[140px]"
                        >
                            {processing 
                                ? 'Enregistrement...' 
                                : category?.id 
                                    ? 'Mettre à jour' 
                                    : 'Créer la catégorie'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
