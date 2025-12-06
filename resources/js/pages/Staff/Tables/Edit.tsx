import React from 'react';
import { Head } from '@inertiajs/react';
import StaffLayout from '@/layouts/StaffLayout';
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
        <StaffLayout>
            <Head title={`Modifier la table ${table.table_number}`} />
            <div className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <TableForm table={table} restaurants={restaurants} />
                </div>
            </div>
        </StaffLayout>
    );
}
