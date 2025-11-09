import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import UserForm from './UserForm';

interface Restaurant {
    id: number;
    name: string;
}

interface CreateUserProps {
    restaurants: Restaurant[];
}

export default function CreateUser({ restaurants }: CreateUserProps) {
    const roles = {
        admin: 'Administrateur',
        manager: 'Gérant',
        staff: 'Employé'
    };

    return (
        <AdminLayout>
            <Head title="Créer un utilisateur" />
            <div className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <UserForm 
                        restaurants={restaurants} 
                        roles={roles} 
                    />
                </div>
            </div>
        </AdminLayout>
    );
}
