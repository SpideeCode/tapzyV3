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
            <div className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <Form category={category} />
                </div>
            </div>
        </AdminLayout>
    );
}
