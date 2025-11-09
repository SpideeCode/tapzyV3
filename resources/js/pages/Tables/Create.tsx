import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import TableForm from './TableForm';

interface Restaurant {
    id: number;
    nom: string;
}

interface Table {
    id: number;
    table_number: string;
    restaurant_id: number;
}

interface CreateTableProps {
    restaurants: Restaurant[];
    existingTables: Table[];
}

export default function Create({ restaurants, existingTables }: CreateTableProps) {
    return (
        <AdminLayout>
            <Head title="Ajouter une table" />
            <div className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <TableForm restaurants={restaurants} existingTables={existingTables} />
                </div>
            </div>
        </AdminLayout>
    );
}
