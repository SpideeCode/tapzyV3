import React from 'react';
import { useForm, router, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
            restaurant_id: user?.restaurant_id ? String(user.restaurant_id) : 'none',
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
            ...(data.restaurant_id && data.restaurant_id !== 'none' && { restaurant_id: parseInt(data.restaurant_id) })
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
        <Card className="border-border/50 shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold">
                    {user?.id ? 'Modifier l\'utilisateur' : 'Créer un nouvel utilisateur'}
                </CardTitle>
                <CardDescription>
                    {user?.id 
                        ? 'Mettez à jour les informations de l\'utilisateur' 
                        : 'Remplissez les informations pour créer un nouvel utilisateur'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">
                                Nom complet <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                type="text"
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Jean Dupont"
                                required
                                className="w-full"
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">
                                Adresse email <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                type="email"
                                id="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="jean.dupont@example.com"
                                required
                                className="w-full"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="role">
                                Rôle <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                value={data.role}
                                onValueChange={(value) => setData('role', value)}
                                required
                            >
                                <SelectTrigger id="role" className="w-full">
                                    <SelectValue placeholder="Sélectionner un rôle" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(roles).map(([value, label]) => (
                                        <SelectItem key={value} value={value}>
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.role} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="restaurant_id">Restaurant</Label>
                            <Select
                                value={data.restaurant_id || 'none'}
                                onValueChange={(value) => setData('restaurant_id', value)}
                            >
                                <SelectTrigger id="restaurant_id" className="w-full">
                                    <SelectValue placeholder="Sélectionner un restaurant (optionnel)" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Aucun restaurant</SelectItem>
                                    {restaurants.map((restaurant) => (
                                        <SelectItem key={restaurant.id} value={String(restaurant.id)}>
                                            {restaurant.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.restaurant_id} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">
                                {user?.id ? 'Nouveau mot de passe' : 'Mot de passe'} 
                                {!user?.id && <span className="text-destructive">*</span>}
                            </Label>
                            <Input
                                type="password"
                                id="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="••••••••"
                                required={!user?.id}
                                autoComplete="new-password"
                                className="w-full"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password_confirmation">
                                Confirmer le mot de passe 
                                {!user?.id && <span className="text-destructive">*</span>}
                            </Label>
                            <Input
                                type="password"
                                id="password_confirmation"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder="••••••••"
                                required={!user?.id}
                                autoComplete="new-password"
                                className="w-full"
                            />
                            <InputError message={errors.password_confirmation} />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-border">
                        <Button
                            type="button"
                            variant="outline"
                            asChild
                        >
                            <Link href="/admin/users">Annuler</Link>
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="min-w-[120px]"
                        >
                            {processing ? 'Enregistrement...' : 'Enregistrer'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
