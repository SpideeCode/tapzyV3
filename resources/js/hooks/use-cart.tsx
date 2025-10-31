import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

type CartItem = {
    itemId: number;
    name: string;
    price: number;
    quantity: number;
    image?: string | null;
};

type CartState = {
    restaurantId: number | null;
    tableNumber: string | null;
    items: CartItem[];
};

type CartContextValue = {
    state: CartState;
    setRestaurant: (restaurantId: number) => void;
    setTableNumber: (tableNumber: string) => void;
    addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
    increment: (itemId: number) => void;
    decrement: (itemId: number) => void;
    removeItem: (itemId: number) => void;
    clear: () => void;
    total: number;
    count: number;
    submit: () => Promise<{ ok: boolean; order?: unknown; error?: string }>;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = (restaurantId: number | null) => `tapzy.cart.${restaurantId ?? 'none'}`;

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<CartState>({ restaurantId: null, tableNumber: null, items: [] });
    const initialized = useRef(false);

    // Load from localStorage when restaurantId changes
    useEffect(() => {
        if (!initialized.current) return;
        const key = STORAGE_KEY(state.restaurantId);
        const raw = localStorage.getItem(key);
        if (raw) {
            try {
                const parsed = JSON.parse(raw) as CartState;
                setState((prev) => ({ ...prev, tableNumber: parsed.tableNumber, items: parsed.items }));
            } catch {}
        } else {
            setState((prev) => ({ ...prev, tableNumber: null, items: [] }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.restaurantId]);

    // Persist
    useEffect(() => {
        const key = STORAGE_KEY(state.restaurantId);
        localStorage.setItem(key, JSON.stringify(state));
        initialized.current = true;
    }, [state]);

    const setRestaurant = useCallback((restaurantId: number) => {
        setState((prev) => ({ ...prev, restaurantId }));
    }, []);

    const setTableNumber = useCallback((tableNumber: string) => {
        setState((prev) => ({ ...prev, tableNumber }));
    }, []);

    const addItem = useCallback((item: Omit<CartItem, 'quantity'>, quantity = 1) => {
        setState((prev) => {
            const existing = prev.items.find((i) => i.itemId === item.itemId);
            if (existing) {
                return {
                    ...prev,
                    items: prev.items.map((i) => (i.itemId === item.itemId ? { ...i, quantity: i.quantity + quantity } : i)),
                };
            }
            return { ...prev, items: [...prev.items, { ...item, quantity }] };
        });
    }, []);

    const increment = useCallback((itemId: number) => {
        setState((prev) => ({
            ...prev,
            items: prev.items.map((i) => (i.itemId === itemId ? { ...i, quantity: i.quantity + 1 } : i)),
        }));
    }, []);

    const decrement = useCallback((itemId: number) => {
        setState((prev) => ({
            ...prev,
            items: prev.items
                .map((i) => (i.itemId === itemId ? { ...i, quantity: i.quantity - 1 } : i))
                .filter((i) => i.quantity > 0),
        }));
    }, []);

    const removeItem = useCallback((itemId: number) => {
        setState((prev) => ({ ...prev, items: prev.items.filter((i) => i.itemId !== itemId) }));
    }, []);

    const clear = useCallback(() => {
        setState((prev) => ({ ...prev, items: [] }));
    }, []);

    const total = useMemo(() => state.items.reduce((sum, i) => sum + i.price * i.quantity, 0), [state.items]);
    const count = useMemo(() => state.items.reduce((sum, i) => sum + i.quantity, 0), [state.items]);

    const submit = useCallback(async () => {
        if (!state.restaurantId) return { ok: false, error: "restaurant manquant" };
        if (!state.tableNumber) return { ok: false, error: "numéro de table manquant" };
        if (state.items.length === 0) return { ok: false, error: "panier vide" };

        const csrf = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null;
        const res = await fetch('/public/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrf?.content || '',
                'X-Requested-With': 'XMLHttpRequest',
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                restaurant_id: state.restaurantId,
                table_number: state.tableNumber,
                items: state.items.map((i) => ({ item_id: i.itemId, quantity: i.quantity })),
            }),
        });

        if (!res.ok) {
            try {
                const err = await res.json();
                return { ok: false, error: err.message || 'Erreur serveur' };
            } catch {
                return { ok: false, error: 'Erreur serveur' };
            }
        }

        const order = await res.json();
        clear();
        return { ok: true, order };
    }, [state, clear]);

    const value = useMemo(
        () => ({ state, setRestaurant, setTableNumber, addItem, increment, decrement, removeItem, clear, total, count, submit }),
        [state, setRestaurant, setTableNumber, addItem, increment, decrement, removeItem, clear, total, count, submit],
    );

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within CartProvider');
    return ctx;
}


