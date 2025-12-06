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
    Table,
    Utensils,
} from 'lucide-react';
import AppLogo from './app-logo';

const staffNavItems: NavItem[] = [
    {
        title: 'Tableau de bord',
        href: '/staff/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Commandes',
        href: '/staff/orders',
        icon: ShoppingBag,
    },
    {
        title: 'Tables',
        href: '/staff/tables',
        icon: Table,
    },
    {
        title: 'Articles',
        href: '/staff/items',
        icon: Utensils,
    },
];

export function StaffSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/staff/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={staffNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
