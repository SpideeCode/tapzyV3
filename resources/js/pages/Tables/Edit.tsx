import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import TableForm from './TableForm';

interface Restaurant {
    id: number;
    name: string;
}

interface Table {
    id: number;
    table_number: string;
    qr_code: string | null;
    restaurant_id: number;
}

interface EditTableProps {
    table: Table;
    restaurants: Restaurant[];
}

export default function Edit({ table, restaurants }: EditTableProps) {
    return (
        <AdminLayout>
            <Head title={`Modifier la table ${table.table_number}`} />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                Modifier la table {table.table_number}
                            </h2>
                            <TableForm table={table} restaurants={restaurants} />
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
