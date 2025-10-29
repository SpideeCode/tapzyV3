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
            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                Modifier l'utilisateur : {user.name}
                            </h2>
                            <UserForm 
                                user={user} 
                                restaurants={restaurants} 
                                roles={roles} 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
