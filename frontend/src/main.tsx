import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { registerSW } from "virtual:pwa-register";

registerSW({
  onNeedRefresh() {
    if (confirm("New update available! Reload?")) {
      location.reload();
    }
  },
  onOfflineReady() {
    console.log("Cinefy is ready to work offline.");
  },
  onRegisterError(error) {
    console.error("SW registration error:", error);
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
