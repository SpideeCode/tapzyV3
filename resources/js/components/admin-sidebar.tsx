import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    LayoutDashboard,
    ShoppingBag,
    Store,
    Table,
    Tags,
    Users,
    Utensils,
} from 'lucide-react';
import AppLogo from './app-logo';

const adminNavItems: NavItem[] = [
    {
        title: 'Tableau de bord',
        href: '/admin/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Restaurants',
        href: '/admin/restaurants',
        icon: Store,
    },
    {
        title: 'Tables',
        href: '/admin/tables',
        icon: Table,
    },
    {
        title: 'Commandes',
        href: '/admin/orders',
        icon: ShoppingBag,
    },
    {
        title: 'Articles',
        href: '/admin/items',
        icon: Utensils,
    },
    {
        title: 'Utilisateurs',
        href: '/admin/users',
        icon: Users,
    },
    {
        title: 'Catégories',
        href: '/admin/categories',
        icon: Tags,
    },
];

export function AdminSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/admin/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={adminNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
