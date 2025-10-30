import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Form from './Form';

export default function Create() {
    return (
        <AdminLayout>
            <Head title="Créer une catégorie" />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Créer une nouvelle catégorie</h1>
                    
                    <div className="bg-white shadow-sm overflow-hidden sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <Form />
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
