import React from 'react';
import { useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';

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
}

export default function TableForm({ table, restaurants }: TableFormProps) {
    const form = useForm({
        table_number: table?.table_number || '',
        restaurant_id: table?.restaurant_id || '',
        qr_code: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
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
            });
        } else {
            router.post('/admin/tables', form.data, {
                forceFormData: true,
                onSuccess: () => form.reset(),
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                    <label htmlFor="restaurant_id" className="block text-sm font-medium text-gray-700">
                        Restaurant
                    </label>
                    <select
                        id="restaurant_id"
                        value={form.data.restaurant_id}
                        onChange={(e) => form.setData('restaurant_id', e.target.value)}
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
                    {form.errors.restaurant_id && <p className="mt-1 text-sm text-red-600">{form.errors.restaurant_id}</p>}
                </div>

                <div className="sm:col-span-3">
                    <label htmlFor="table_number" className="block text-sm font-medium text-gray-700">
                        Numéro de table
                    </label>
                    <input
                        type="text"
                        id="table_number"
                        value={form.data.table_number}
                        onChange={(e) => form.setData('table_number', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
                    />
                    {form.errors.table_number && <p className="mt-1 text-sm text-red-600">{form.errors.table_number}</p>}
                </div>

                <div className="sm:col-span-6">
                    <label htmlFor="qr_code" className="block text-sm font-medium text-gray-700">
                        QR Code (optionnel)
                    </label>
                    <input
                        type="file"
                        id="qr_code"
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                form.setData('qr_code', e.target.files[0]);
                            }
                        }}
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                    {form.errors.qr_code && <p className="mt-1 text-sm text-red-600">{form.errors.qr_code}</p>}
                </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6">
                <a
                    href="/admin/tables"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Annuler
                </a>
                <button
                    type="submit"
                    disabled={form.processing}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                    {form.processing ? 'Enregistrement...' : 'Enregistrer'}
                </button>
            </div>
        </form>
    );
}
