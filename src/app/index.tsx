import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { initI18n } from '@/shared/i18n';

import { App } from './App.js';
import { AppProvider } from './providers';
import './styles/index.css';
import '../entities/index.js';
import '../features/index.js';
import '../widgets/index.js';

initI18n();

const container = document.getElementById('root');
if (!container) throw new Error('root element missing');

createRoot(container).render(
    <StrictMode>
        <AppProvider>
            <App />
        </AppProvider>
    </StrictMode>,
);
