import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import debounce from 'lodash/debounce';

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
                    <div className="relative">
                    <input
                        type="text"
                        id="table_number"
                        value={form.data.table_number}
                        onChange={(e) => {
                            form.setData('table_number', e.target.value);
                            // Réinitialiser l'état de disponibilité quand l'utilisateur tape
                            if (e.target.value !== form.data.table_number) {
                                setTableStatus({ available: null, message: '' });
                            }
                        }}
                        className={`mt-1 block w-full rounded-md ${
                            tableStatus.available === false 
                                ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                                : tableStatus.available === true 
                                    ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                                    : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                        } shadow-sm focus:ring-2 focus:ring-offset-2 sm:text-sm`}
                        required
                        disabled={isChecking}
                    />
                    {isChecking && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    )}
                    {!isChecking && tableStatus.available === true && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                    )}
                    {!isChecking && tableStatus.available === false && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                    )}
                    {form.errors.table_number && (
                        <p className="mt-1 text-sm text-red-600">{form.errors.table_number}</p>
                    )}
                    </div>
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
