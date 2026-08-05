import React from 'react';
import { CalcMode } from '../types';
import { Sun, Moon, History, Calculator, LineChart, Binary, ArrowRightLeft, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface HeaderProps {
  currentMode: CalcMode;
  onSelectMode: (mode: CalcMode) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  showSidebar: boolean;
  onToggleSidebar: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  isDarkMode,
  onToggleTheme,
  showSidebar,
  onToggleSidebar,
  historyCount,
}) => {
  const modes: { id: CalcMode; label: string; icon: React.ReactNode }[] = [
    { id: 'standard', label: 'Standard', icon: <Calculator className="w-3.5 h-3.5" /> },
    { id: 'scientific', label: 'Scientific', icon: <Calculator className="w-3.5 h-3.5" /> },
    { id: 'graph', label: 'Graph', icon: <LineChart className="w-3.5 h-3.5" /> },
    { id: 'programmer', label: 'Programmer', icon: <Binary className="w-3.5 h-3.5" /> },
    { id: 'converter', label: 'Converter', icon: <ArrowRightLeft className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="relative flex flex-col md:flex-row md:items-center justify-between px-4 sm:px-6 py-3 border-b border-white/10 bg-[#0B0F17]/90 backdrop-blur-md select-none gap-2 sm:gap-4 z-20">
      <div className="flex items-center justify-between md:justify-start space-x-2 sm:space-x-3 min-w-0">
        <div className="flex items-center space-x-2 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-bold text-sm">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              <span>MathEngine</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">v2.5.0</span>
            </h1>
            <p className="hidden lg:block text-[8px] sm:text-[9px] text-slate-400 font-mono tracking-widest uppercase">PRECISION SCIENTIFIC COMPUTING ENVIRONMENT</p>
          </div>
        </div>

        {/* Desktop Mode Navigation Pills */}
        <nav className="hidden md:flex items-center space-x-1 ml-2 pl-2 border-l border-white/10 overflow-x-auto no-scrollbar shrink-0">
          {modes.map((m) => {
            const isActive = currentMode === m.id;
            return (
              <button
                key={m.id}
                id={`btn-mode-${m.id}`}
                onClick={() => onSelectMode(m.id)}
                className={`relative flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-mono font-medium rounded-xl transition-all whitespace-nowrap ${
                  isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeHeaderModePill"
                    className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-indigo-600/90 rounded-xl border border-blue-400/30 shadow-md shadow-blue-500/20"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  {m.icon}
                  <span>{m.label}</span>
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Mode Navigation Pills */}
      <nav className="flex md:hidden items-center space-x-1.5 overflow-x-auto no-scrollbar pb-1">
        {modes.map((m) => {
          const isActive = currentMode === m.id;
          return (
            <button
              key={m.id}
              id={`btn-mode-mobile-${m.id}`}
              onClick={() => onSelectMode(m.id)}
              className={`relative flex items-center space-x-1 px-3 py-1.5 text-xs font-mono rounded-xl whitespace-nowrap transition-all ${
                isActive ? 'text-white bg-blue-600/90 border border-blue-400/30' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              {m.icon}
              <span>{m.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Right Tools & Status */}
      <div className="flex items-center space-x-3 text-xs font-mono justify-end">
        {/* Right Tools */}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          id="btn-toggle-theme"
          onClick={onToggleTheme}
          className="p-2 text-slate-400 hover:text-amber-400 hover:bg-white/5 rounded-xl transition-colors border border-white/10 bg-white/5"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <Moon className="w-4 h-4 text-blue-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          id="btn-toggle-history-sidebar"
          onClick={onToggleSidebar}
          className={`relative p-2 rounded-xl transition-colors border ${
            showSidebar
              ? 'text-blue-400 bg-blue-500/20 border-blue-500/40 shadow-lg shadow-blue-500/10'
              : 'text-slate-400 hover:text-white hover:bg-white/5 border-white/10 bg-white/5'
          }`}
          title="Toggle Calculation History"
        >
          <History className="w-4 h-4" />
          {historyCount > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[16px] h-4 px-1 text-[10px] font-bold text-white bg-blue-600 rounded-full border border-blue-400/40">
              {historyCount > 99 ? '99+' : historyCount}
            </span>
          )}
        </motion.button>
      </div>
    </header>
  );
};

