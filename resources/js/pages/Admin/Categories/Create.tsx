import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Form from './Form';

export default function Create() {
    return (
        <AdminLayout>
            <Head title="Créer une catégorie" />
            <div className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <Form />
                </div>
            </div>
        </AdminLayout>
    );
}
