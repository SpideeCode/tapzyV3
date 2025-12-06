import React from 'react';
import { Head } from '@inertiajs/react';
import StaffLayout from '@/layouts/StaffLayout';
import ItemForm from './ItemForm';

interface Restaurant {
    id: number;
    name: string;
}

interface Category {
    id: number;
    name: string;
}

interface Item {
    id: number;
    name: string;
    description: string | null;
    price: number;
    available: boolean;
    restaurant_id: number | null;
    category_id: number | null;
    restaurant: Restaurant | null;
    category: Category | null;
}

interface EditItemProps {
    item: Item;
    restaurants: Restaurant[];
    categories: Category[];
}

export default function EditItem({ item, restaurants, categories }: EditItemProps) {
    return (
        <StaffLayout>
            <Head title={`Modifier ${item.name}`} />
            <div className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <ItemForm
                        item={item}
                        restaurants={restaurants}
                        categories={categories}
                    />
                </div>
            </div>
        </StaffLayout>
    );
}
