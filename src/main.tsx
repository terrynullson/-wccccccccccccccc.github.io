import React from 'react';
import { createRoot } from 'react-dom/client';
import AppShell from './widgets/layout/AppShell';

const rootElement = document.getElementById('root');
if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<AppShell />);
}