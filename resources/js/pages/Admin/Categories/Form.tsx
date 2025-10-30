import React from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/Components/Button';
import Input from '@/Components/Input';
import InputError from '@/Components/InputError';
import Label from '@/Components/Label';

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
        <form onSubmit={submit} className="space-y-6">
            <div>
                <Label htmlFor="name" value="Nom de la catégorie" />
                <Input
                    id="name"
                    type="text"
                    className="mt-1 block w-full"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    required
                    autoFocus
                />
                <InputError message={errors.name} className="mt-2" />
            </div>

            <div>
                <Label htmlFor="description" value="Description" />
                <textarea
                    id="description"
                    className="mt-1 block w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
                    rows={3}
                    value={data.description || ''}
                    onChange={(e) => setData('description', e.target.value)}
                />
                <InputError message={errors.description} className="mt-2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="order" value="Ordre d'affichage" />
                    <Input
                        id="order"
                        type="number"
                        className="mt-1 block w-full"
                        value={data.order}
                        onChange={(e) => setData('order', parseInt(e.target.value) || 0)}
                    />
                    <InputError message={errors.order} className="mt-2" />
                </div>

                <div className="flex items-center">
                    <div className="flex items-center h-5">
                        <input
                            id="is_active"
                            type="checkbox"
                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                            checked={data.is_active}
                            onChange={(e) => setData('is_active', e.target.checked)}
                        />
                    </div>
                    <div className="ml-3 text-sm">
                        <label htmlFor="is_active" className="font-medium text-gray-700">
                            Catégorie active
                        </label>
                        <p className="text-gray-500">Si désactivé, la catégorie ne sera pas visible sur le site.</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end mt-4">
                <Button
                    type="button"
                    className="bg-gray-100 text-gray-800 hover:bg-gray-200 mr-4"
                    onClick={() => window.history.back()}
                >
                    Annuler
                </Button>
                <Button type="submit" disabled={processing}>
                    {category?.id ? 'Mettre à jour' : 'Créer la catégorie'}
                </Button>
            </div>
        </form>
    );
}
