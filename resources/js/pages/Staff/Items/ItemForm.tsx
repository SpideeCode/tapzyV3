import React from 'react';
import { useForm, router, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import InputError from '@/components/input-error';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Restaurant {
    id: number;
    name: string;
}

interface Category {
    id: number;
    name: string;
}

interface ItemFormData {
    restaurant_id: string;
    category_id: string;
    name: string;
    description: string;
    price: string;
    available: boolean;
}

interface ItemFormProps {
    item?: {
        id?: number;
        restaurant_id: number | null;
        category_id: number | null;
        name: string;
        description: string | null;
        price: number;
        available: boolean;
    };
    restaurants: Restaurant[];
    categories: Category[];
}

export default function ItemForm({ item, restaurants, categories }: ItemFormProps) {
    const { data, setData, post, put, processing, errors } = useForm<ItemFormData>({
        restaurant_id: item?.restaurant_id ? String(item.restaurant_id) : '',
        category_id: item?.category_id ? String(item.category_id) : 'none',
        name: item?.name || '',
        description: item?.description || '',
        price: item?.price ? item.price.toString() : '0',
        available: item?.available ?? true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = {
            restaurant_id: data.restaurant_id,
            category_id: data.category_id && data.category_id !== 'none' ? data.category_id : null,
            name: data.name,
            description: data.description,
            price: parseFloat(data.price) || 0,
            available: data.available
        };

        if (item?.id) {
            router.put(`/staff/items/${item.id}`, formData as any);
        } else {
            post('/staff/items', formData as any);
        }
    };

    return (
        <Card className="border-border/50 shadow-lg dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {item?.id ? 'Modifier l\'article' : 'Créer un nouvel article'}
                </CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">
                    {item?.id
                        ? 'Mettez à jour les informations de l\'article'
                        : 'Remplissez les informations pour créer un nouvel article'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="restaurant_id" className="text-gray-900 dark:text-white">
                                Restaurant <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                value={data.restaurant_id || ''}
                                onValueChange={(value) => setData('restaurant_id', value)}
                                required
                            >
                                <SelectTrigger id="restaurant_id" className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
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
                            <InputError message={errors.restaurant_id} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category_id" className="text-gray-900 dark:text-white">Catégorie</Label>
                            <Select
                                value={data.category_id || 'none'}
                                onValueChange={(value) => setData('category_id', value)}
                            >
                                <SelectTrigger id="category_id" className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                                    <SelectValue placeholder="Aucune catégorie" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Aucune catégorie</SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={String(category.id)}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.category_id} />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="name" className="text-gray-900 dark:text-white">
                                Nom <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                type="text"
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Nom de l'article"
                                required
                                className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="description" className="text-gray-900 dark:text-white">Description</Label>
                            <Textarea
                                id="description"
                                rows={4}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Description de l'article (optionnel)"
                                className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                            />
                            <InputError message={errors.description} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="price" className="text-gray-900 dark:text-white">
                                Prix (€) <span className="text-destructive">*</span>
                            </Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-muted-foreground text-sm">€</span>
                                </div>
                                <Input
                                    type="number"
                                    id="price"
                                    min="0"
                                    step="0.01"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    placeholder="0.00"
                                    required
                                    className="w-full pl-7 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                                />
                            </div>
                            <InputError message={errors.price} />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-gray-900 dark:text-white">Statut</Label>
                            <div className="flex items-center space-x-3 pt-2">
                                <Checkbox
                                    id="available"
                                    checked={data.available}
                                    onCheckedChange={(checked) => setData('available', checked === true)}
                                    className="border-gray-300 dark:border-gray-600"
                                />
                                <label
                                    htmlFor="available"
                                    className="text-sm font-medium leading-none cursor-pointer text-gray-900 dark:text-white"
                                >
                                    Disponible à la vente
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-border dark:border-gray-700">
                        <Button
                            type="button"
                            variant="outline"
                            asChild
                            className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                            <Link href="/staff/items">Annuler</Link>
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
    );
}
