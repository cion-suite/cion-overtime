import { Outlet } from 'react-router-dom';

import { SidebarInset, SidebarProvider } from '@/shared/ui/shadcn/sidebar';
import { AppSidebar } from '@/widgets/app-sidebar';
import { Navbar } from '@/widgets/app-navbar';
import { ErrorBoundary } from '@/shared/ui/error-boundary';
import { useLocalStorage } from '@/shared/lib/local-storage';
import { STORAGE_KEYS } from '@/shared/config/storage-keys';

export function Layout() {
    const [open, setOpen] = useLocalStorage(STORAGE_KEYS.SIDEBAR_OPEN, true);

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
