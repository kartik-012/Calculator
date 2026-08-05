import React from 'react';
import { AngleUnit } from '../types';
import { formatDisplayNumber } from '../lib/calcEngine';
import { motion, AnimatePresence } from 'motion/react';

interface DisplayProps {
  expression: string;
  currentInput: string;
  resultPreview?: string;
  angleUnit: AngleUnit;
  onToggleAngleUnit: () => void;
  is2ndActive: boolean;
  hasMemory: boolean;
  memoryValue?: number;
  error?: string | null;
}

export const Display: React.FC<DisplayProps> = ({
  expression,
  currentInput,
  resultPreview,
  angleUnit,
  onToggleAngleUnit,
  is2ndActive,
  hasMemory,
  error,
}) => {
  const formattedDisplay = error ? error : formatDisplayNumber(currentInput || '0');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative flex flex-col justify-between p-6 bg-gradient-to-b from-[#161B26]/90 to-[#0F131C]/90 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl shadow-blue-500/5 select-text min-h-[160px] mb-4 overflow-hidden"
    >
      {/* Subtle Glow Overlay */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Status & Flags */}
      <div className="flex items-center justify-between text-xs font-mono mb-2 relative z-10">
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            id="btn-toggle-deg-rad-badge"
            onClick={onToggleAngleUnit}
            className={`px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm ${
              angleUnit === 'deg'
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
            }`}
          >
            {angleUnit}
          </motion.button>

          {is2ndActive && (
            <motion.span
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="px-3 py-1 rounded-lg text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm animate-pulse"
            >
              2ND
            </motion.span>
          )}

          {hasMemory && (
            <motion.span
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="px-3 py-1 rounded-lg text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm"
            >
              MEM
            </motion.span>
          )}
        </div>

        {/* Expression Line e.g., (256 + 123) * (845 / 25) = */}
        <AnimatePresence mode="wait">
          <motion.div
            key={expression}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="text-slate-400 font-mono text-xs sm:text-sm tracking-wide overflow-x-auto whitespace-nowrap max-w-[70%] text-right no-scrollbar"
          >
            {expression ? `${expression} =` : ''}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Main Result Line */}
      <div className="flex flex-col items-end justify-end mt-3 relative z-10">
        <div
          id="calc-main-display"
          className={`font-mono text-right font-medium tracking-tight overflow-x-auto w-full no-scrollbar transition-all ${
            error
              ? 'text-rose-400 text-2xl'
              : formattedDisplay.length > 18
              ? 'text-2xl sm:text-3xl text-slate-100'
              : formattedDisplay.length > 12
              ? 'text-3xl sm:text-4xl text-slate-100'
              : 'text-4xl sm:text-5xl text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.1)]'
          }`}
        >
          {formattedDisplay}
        </div>

        {/* Dynamic preview if user is typing */}
        {resultPreview && !error && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-mono text-slate-400 mt-1.5 tracking-wider bg-white/5 px-2 py-0.5 rounded border border-white/5"
          >
            ≈ {resultPreview}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

