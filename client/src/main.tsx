import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

const style = document.createElement('style');
style.textContent = `*, *::before, *::after { box-sizing: border-box; } body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f3f4f6; } a { color: inherit; }`;
document.head.appendChild(style);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
