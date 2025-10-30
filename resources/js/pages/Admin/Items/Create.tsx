import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import ItemForm from './ItemForm';

interface Restaurant {
    id: number;
    name: string;
}

interface Category {
    id: number;
    name: string;
}

interface CreateItemProps {
    restaurants: Restaurant[];
    categories: Category[];
}

export default function CreateItem({ restaurants, categories }: CreateItemProps) {
    return (
        <AdminLayout>
            <Head title="Créer un article" />
            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Créer un nouvel article</h2>
                            <ItemForm 
                                restaurants={restaurants}
                                categories={categories}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
