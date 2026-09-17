import React from 'react';
import {
  LayoutDashboard,
  UserPlus,
  ScanFace,
  TrendingUp,
  History,
  Cpu,
} from 'lucide-react';
import { setMockMode } from '../services/api';

export type NavTab = 'dashboard' | 'registro' | 'reconocimiento' | 'probabilidades' | 'historial';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  mockEnabled: boolean;
  onToggleMock: (enabled: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  mockEnabled,
  onToggleMock,
}) => {
  const tabs = [
    { id: 'dashboard' as NavTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'registro' as NavTab, label: 'Registro Facial', icon: UserPlus },
    { id: 'reconocimiento' as NavTab, label: 'Reconocimiento', icon: ScanFace },
    { id: 'probabilidades' as NavTab, label: 'Probabilidades ML', icon: TrendingUp },
    { id: 'historial' as NavTab, label: 'Historial', icon: History },
  ];

  return (
    <header className="w-full bg-slate-900/90 backdrop-blur border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Título del Proyecto */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <ScanFace className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
                <span>BiometricAI</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800">
                  DL + ML
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Reconocimiento Facial y Análisis de Probabilidades
              </p>
            </div>
          </div>

          {/* Navegación por Pestañas */}
          <nav className="hidden md:flex items-center gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Controles de Estado / Selector Mock */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const next = !mockEnabled;
                setMockMode(next);
                onToggleMock(next);
              }}
              title="Alternar entre Simulación Demo y API Real"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                mockEnabled
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80 hover:bg-emerald-900/60'
                  : 'bg-cyan-950/60 text-cyan-300 border-cyan-800/80 hover:bg-cyan-900/60'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Modo:</span>
              <strong className="font-semibold">{mockEnabled ? 'Demo Mock' : 'FastAPI'}</strong>
            </button>
          </div>
        </div>

        {/* Barra de pestañas móvil */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-1 border-t border-slate-800/60">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs whitespace-nowrap font-medium transition-all ${
                  isActive
                    ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
