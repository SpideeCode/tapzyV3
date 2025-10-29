import React from 'react';
import { useForm, router } from '@inertiajs/react';

interface Restaurant {
    id: number;
    name: string;
}

interface UserFormData {
    name: string;
    email: string;
    role: string;
    password: string;
    password_confirmation: string;
    restaurant_id: string;
}

interface UserFormProps {
    user?: {
        id?: number;
        name: string;
        email: string;
        role: string;
        restaurant_id?: number | null;
    };
    restaurants: Restaurant[];
    roles: Record<string, string>;
}

export default function UserForm({ user, restaurants, roles }: UserFormProps) {
    const { data, setData, post, processing, errors } = useForm<UserFormData>(
        {
            name: user?.name || '',
            email: user?.email || '',
            password: '',
            password_confirmation: '',
            role: user?.role || 'staff',
            restaurant_id: user?.restaurant_id ? String(user.restaurant_id) : '',
        },
        {
            resetOnSuccess: false,
            preserveState: false,
        }
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const formData = {
            name: data.name,
            email: data.email,
            role: data.role,
            ...(data.password && { 
                password: data.password,
                password_confirmation: data.password_confirmation 
            }),
            ...(data.restaurant_id && { restaurant_id: parseInt(data.restaurant_id) })
        };
        
        if (user?.id) {
            router.post(`/admin/users/${user.id}`, {
                _method: 'put',
                ...formData,
            });
        } else {
            post('/admin/users', formData as any);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Nom complet <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div className="sm:col-span-3">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Adresse email <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div className="sm:col-span-3">
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                        Rôle <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="role"
                        value={data.role}
                        onChange={(e) => setData('role', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
                    >
                        {Object.entries(roles).map(([value, label]) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                    {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
                </div>

                <div className="sm:col-span-3">
                    <label htmlFor="restaurant_id" className="block text-sm font-medium text-gray-700">
                        Restaurant
                    </label>
                    <select
                        id="restaurant_id"
                        value={data.restaurant_id || ''}
                        onChange={(e) => setData('restaurant_id', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                        <option value="">Sélectionner un restaurant (optionnel)</option>
                        {restaurants.map((restaurant) => (
                            <option key={restaurant.id} value={restaurant.id}>
                                {restaurant.name}
                            </option>
                        ))}
                    </select>
                    {errors.restaurant_id && <p className="mt-1 text-sm text-red-600">{errors.restaurant_id}</p>}
                </div>

                <div className="sm:col-span-3">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        {user?.id ? 'Nouveau mot de passe' : 'Mot de passe'} {!user?.id && <span className="text-red-500">*</span>}
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required={!user?.id}
                        autoComplete="new-password"
                    />
                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                </div>

                <div className="sm:col-span-3">
                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                        Confirmer le mot de passe {!user?.id && <span className="text-red-500">*</span>}
                    </label>
                    <input
                        type="password"
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required={!user?.id}
                    />
                </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6">
                <a
                    href="/admin/users"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Annuler
                </a>
                <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                    {processing ? 'Enregistrement...' : 'Enregistrer'}
                </button>
            </div>
        </form>
    );
}
