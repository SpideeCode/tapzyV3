import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import TableForm from './TableForm';

interface Restaurant {
    id: number;
    nom: string;
}

interface CreateTableProps {
    restaurants: Restaurant[];
}

export default function Create({ restaurants }: CreateTableProps) {
    return (
        <AdminLayout>
            <Head title="Ajouter une table" />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Ajouter une table</h2>
                            <TableForm restaurants={restaurants} />
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
