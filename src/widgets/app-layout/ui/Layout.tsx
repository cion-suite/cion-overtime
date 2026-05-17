import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import { SidebarInset, SidebarProvider } from '@/shared/ui/shadcn/sidebar';
import { AppSidebar } from '@/widgets/app-sidebar';
import { Navbar } from '@/widgets/app-navbar';
import { ErrorBoundary } from '@/shared/ui/error-boundary';

const SIDEBAR_OPEN_KEY = 'cion-overtime:sidebar-open';

function readInitialOpen(): boolean {
    try {
        return localStorage.getItem(SIDEBAR_OPEN_KEY) === 'true';
    } catch {
        return false;
    }
}

export function Layout() {
    const [open, setOpen] = useState(readInitialOpen);

    useEffect(() => {
        try {
            localStorage.setItem(SIDEBAR_OPEN_KEY, String(open));
        } catch {
            /* ignore quota / privacy errors */
        }
    }, [open]);

    return (
        <SidebarProvider open={open} onOpenChange={setOpen}>
            <AppSidebar />
            <SidebarInset className="h-svh overflow-hidden">
                <Navbar />
                <main className="flex min-h-0 flex-1 flex-col overflow-hidden px-6 py-6">
                    <ErrorBoundary>
                        <Outlet />
                    </ErrorBoundary>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
