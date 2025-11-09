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
            <div className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <ItemForm 
                        restaurants={restaurants}
                        categories={categories}
                    />
                </div>
            </div>
        </AdminLayout>
    );
}
