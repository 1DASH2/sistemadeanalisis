import { useState } from 'react';
import { Navbar, type NavTab } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { RegistroFacial } from './pages/RegistroFacial';
import { Reconocimiento } from './pages/Reconocimiento';
import { Probabilidades } from './pages/Probabilidades';
import { Historial } from './pages/Historial';
import { isMockMode } from './services/api';

export function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [mockEnabled, setMockEnabled] = useState<boolean>(isMockMode());

  const renderActivePage = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentTab} />;
      case 'registro':
        return <RegistroFacial />;
      case 'reconocimiento':
        return <Reconocimiento />;
      case 'probabilidades':
        return <Probabilidades />;
      case 'historial':
        return <Historial />;
      default:
        return <Dashboard onNavigate={setCurrentTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      {/* Barra de Navegación Principal */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        mockEnabled={mockEnabled}
        onToggleMock={setMockEnabled}
      />

      {/* Contenedor Principal de Vistas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderActivePage()}
      </main>

      {/* Pie de Página Técnico */}
      <footer className="w-full border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Sistema Inteligente de Reconocimiento Facial y Análisis de Probabilidades
          </span>
          <span className="font-mono text-[11px] text-slate-400">
            Stack: React 19 + TypeScript + Vite + Tailwind CSS | Deep Learning & Scikit-Learn
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
