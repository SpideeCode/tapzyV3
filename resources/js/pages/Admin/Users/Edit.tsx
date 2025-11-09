import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import UserForm from './UserForm';

interface Restaurant {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    restaurant_id: number | null;
    restaurant: Restaurant | null;
}

interface EditUserProps {
    user: User;
    restaurants: Restaurant[];
}

export default function EditUser({ user, restaurants }: EditUserProps) {
    const roles = {
        admin: 'Administrateur',
        manager: 'Gérant',
        staff: 'Employé'
    };

    return (
        <AdminLayout>
            <Head title={`Modifier ${user.name}`} />
            <div className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <UserForm 
                        user={user} 
                        restaurants={restaurants} 
                        roles={roles} 
                    />
                </div>
            </div>
        </AdminLayout>
    );
}
