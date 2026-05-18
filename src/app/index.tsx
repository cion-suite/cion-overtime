import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { initI18n, DEFAULT_LOCALE, SUPPORTED_LOCALES, type SupportedLocale } from '@/shared/i18n';
import { LOCAL_STORAGE } from '@/shared/config/storage-keys';

import { App } from './App.js';
import { AppProvider } from './providers';
import './styles/index.css';
import '../entities/index.js';
import '../features/index.js';
import '../widgets/index.js';

const savedLang = localStorage.getItem(LOCAL_STORAGE.lang.key);
const locale: SupportedLocale = SUPPORTED_LOCALES.includes(savedLang as SupportedLocale)
    ? (savedLang as SupportedLocale)
    : DEFAULT_LOCALE;
initI18n(locale);

const savedRoute = localStorage.getItem(LOCAL_STORAGE.lastRoute.key);
const currentHash = window.location.hash.replace(/^#/, '');
if (savedRoute && savedRoute !== '/' && (!currentHash || currentHash === '/')) {
    window.location.hash = savedRoute;
}

const container = document.getElementById('root');
if (!container) throw new Error('root element missing');

createRoot(container).render(
    <StrictMode>
        <AppProvider>
            <App />
        </AppProvider>
    </StrictMode>,
);
