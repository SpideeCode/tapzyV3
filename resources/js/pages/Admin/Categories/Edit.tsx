import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Form from './Form';

interface Category {
    id: number;
    name: string;
    description: string | null;
    order: number;
    is_active: boolean;
}

interface EditProps {
    category: Category;
}

export default function Edit({ category }: EditProps) {
    return (
        <AdminLayout>
            <Head title={`Modifier ${category.name}`} />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">
                        Modifier la catégorie : {category.name}
                    </h1>
                    
                    <div className="bg-white shadow-sm overflow-hidden sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <Form category={category} />
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
