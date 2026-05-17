import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { Layout } from '@/widgets/app-layout';
import { ROUTES } from '@/shared/config/routes';

const HomePage = lazy(() => import('@/pages/home').then((m) => ({ default: m.HomePage })));
const SettingsPage = lazy(() =>
    import('@/pages/settings').then((m) => ({ default: m.SettingsPage }))
);

export function AppRouter() {
    return (
        <Suspense fallback={null}>
            <Routes>
                <Route element={<Layout />}>
                    <Route path={ROUTES.home} element={<HomePage />} />
                    <Route path={ROUTES.settings} element={<SettingsPage />} />
                </Route>
                <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
            </Routes>
        </Suspense>
    );
}
