import React from 'react';
import { useForm, router } from '@inertiajs/react';

interface Restaurant {
    id: number;
    name: string;
}

interface ItemFormData {
    restaurant_id: string;
    name: string;
    description: string;
    price: string;
    available: boolean;
}

interface ItemFormProps {
    item?: {
        id?: number;
        restaurant_id: number | null;
        name: string;
        description: string | null;
        price: number;
        available: boolean;
    };
    restaurants: Restaurant[];
}

export default function ItemForm({ item, restaurants }: ItemFormProps) {
    const { data, setData, post, put, processing, errors } = useForm<ItemFormData>({
        restaurant_id: item?.restaurant_id ? String(item.restaurant_id) : '',
        name: item?.name || '',
        description: item?.description || '',
        price: item?.price ? item.price.toString() : '0',
        available: item?.available ?? true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const formData = {
            restaurant_id: data.restaurant_id,
            name: data.name,
            description: data.description,
            price: parseFloat(data.price) || 0,
            available: data.available
        };
        
        if (item?.id) {
            router.put(`/admin/items/${item.id}`, formData as any);
        } else {
            post('/admin/items', formData as any);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-6">
                    <label htmlFor="restaurant_id" className="block text-sm font-medium text-gray-700">
                        Restaurant <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="restaurant_id"
                        value={data.restaurant_id}
                        onChange={(e) => setData('restaurant_id', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
                    >
                        <option value="">Sélectionnez un restaurant</option>
                        {restaurants.map((restaurant) => (
                            <option key={restaurant.id} value={restaurant.id}>
                                {restaurant.name}
                            </option>
                        ))}
                    </select>
                    {errors.restaurant_id && <p className="mt-1 text-sm text-red-600">{errors.restaurant_id}</p>}
                </div>

                <div className="sm:col-span-6">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Nom <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div className="sm:col-span-6">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        id="description"
                        rows={3}
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                </div>

                <div className="sm:col-span-3">
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                        Prix (€) <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">€</span>
                        </div>
                        <input
                            type="number"
                            id="price"
                            min="0"
                            step="0.01"
                            value={data.price}
                            onChange={(e) => setData('price', e.target.value)}
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                            placeholder="0.00"
                            required
                        />
                    </div>
                    {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                </div>

                <div className="sm:col-span-6">
                    <div className="flex items-center">
                        <input
                            id="available"
                            type="checkbox"
                            checked={data.available}
                            onChange={(e) => setData('available', e.target.checked)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="available" className="ml-2 block text-sm text-gray-700">
                            Disponible à la vente
                        </label>
                    </div>
                </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6">
                <a
                    href="/admin/items"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Annuler
                </a>
                <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                    {processing ? 'Enregistrement...' : 'Enregistrer'}
                </button>
            </div>
        </form>
    );
}
