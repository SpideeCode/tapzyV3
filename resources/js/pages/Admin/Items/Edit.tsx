import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import ItemForm from './ItemForm';

interface Restaurant {
    id: number;
    name: string;
}

interface Item {
    id: number;
    name: string;
    description: string | null;
    price: number;
    available: boolean;
    restaurant_id: number | null;
    restaurant: Restaurant | null;
}

interface EditItemProps {
    item: Item;
    restaurants: Restaurant[];
}

export default function EditItem({ item, restaurants }: EditItemProps) {
    return (
        <AdminLayout>
            <Head title={`Modifier ${item.name}`} />
            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Modifier l'article : {item.name}</h2>
                            <ItemForm 
                                item={item}
                                restaurants={restaurants} 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
