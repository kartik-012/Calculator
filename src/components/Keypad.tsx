import React, { useState } from 'react';
import { AngleUnit } from '../types';
import { ChevronDown, Delete } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface KeypadProps {
  onInput: (val: string) => void;
  onClear: () => void;
  onClearEntry: () => void;
  onBackspace: () => void;
  onEquals: () => void;
  onMemoryAdd: () => void;
  onMemoryRecall: () => void;
  onMemoryClear: () => void;
  is2ndActive: boolean;
  onToggle2nd: () => void;
  angleUnit: AngleUnit;
  onToggleAngleUnit: () => void;
  onCalculusAction: (actionType: 'derivative' | 'integral') => void;
}

export const Keypad: React.FC<KeypadProps> = ({
  onInput,
  onClear,
  onClearEntry,
  onBackspace,
  onEquals,
  onMemoryAdd,
  onMemoryRecall,
  onMemoryClear,
  is2ndActive,
  onToggle2nd,
  angleUnit,
  onToggleAngleUnit,
  onCalculusAction,
}) => {
  const [openMenu, setOpenMenu] = useState<'trig' | 'prob' | 'calc' | null>(null);

  const handleInsert = (val: string) => {
    onInput(val);
    setOpenMenu(null);
  };

  const btnProps = {
    whileHover: { scale: 1.04, y: -1 },
    whileTap: { scale: 0.93, y: 1 },
    transition: { type: 'spring', stiffness: 500, damping: 25 },
  };

  return (
    <div className="flex flex-col space-y-3 select-none">
      {/* Sub-toolbars: Trigonometry, Probability, Calculus, Quick Angle */}
      <div className="relative flex items-center justify-between gap-2 px-1 text-xs font-mono text-slate-300 mb-1">
        <div className="flex items-center gap-2">
          {/* Trigonometry Dropdown */}
          <div className="relative">
            <motion.button
              {...btnProps}
              id="btn-trig-dropdown"
              onClick={() => setOpenMenu(openMenu === 'trig' ? null : 'trig')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-all shadow-sm"
            >
              <span>Trigonometry</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </motion.button>

            <AnimatePresence>
              {openMenu === 'trig' && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  className="absolute top-full left-0 mt-2 w-52 p-2 bg-[#141822]/95 border border-white/15 rounded-2xl shadow-2xl z-40 grid grid-cols-3 gap-1.5 text-xs font-mono backdrop-blur-xl"
                >
                  <button
                    onClick={() => handleInsert(is2ndActive ? 'asin(' : 'sin(')}
                    className="p-2 text-center hover:bg-blue-500/20 rounded-xl text-slate-200 hover:text-white transition-colors border border-transparent hover:border-blue-500/30"
                  >
                    {is2ndActive ? 'sin⁻¹' : 'sin'}
                  </button>
                  <button
                    onClick={() => handleInsert(is2ndActive ? 'acos(' : 'cos(')}
                    className="p-2 text-center hover:bg-blue-500/20 rounded-xl text-slate-200 hover:text-white transition-colors border border-transparent hover:border-blue-500/30"
                  >
                    {is2ndActive ? 'cos⁻¹' : 'cos'}
                  </button>
                  <button
                    onClick={() => handleInsert(is2ndActive ? 'atan(' : 'tan(')}
                    className="p-2 text-center hover:bg-blue-500/20 rounded-xl text-slate-200 hover:text-white transition-colors border border-transparent hover:border-blue-500/30"
                  >
                    {is2ndActive ? 'tan⁻¹' : 'tan'}
                  </button>
                  <button
                    onClick={() => handleInsert('cot(')}
                    className="p-2 text-center hover:bg-white/10 rounded-xl text-slate-200 transition-colors"
                  >
                    cot
                  </button>
                  <button
                    onClick={() => handleInsert('sec(')}
                    className="p-2 text-center hover:bg-white/10 rounded-xl text-slate-200 transition-colors"
                  >
                    sec
                  </button>
                  <button
                    onClick={() => handleInsert('csc(')}
                    className="p-2 text-center hover:bg-white/10 rounded-xl text-slate-200 transition-colors"
                  >
                    csc
                  </button>
                  <button
                    onClick={() => handleInsert('sinh(')}
                    className="p-2 text-center hover:bg-white/10 rounded-xl text-slate-200 transition-colors"
                  >
                    sinh
                  </button>
                  <button
                    onClick={() => handleInsert('cosh(')}
                    className="p-2 text-center hover:bg-white/10 rounded-xl text-slate-200 transition-colors"
                  >
                    cosh
                  </button>
                  <button
                    onClick={() => handleInsert('tanh(')}
                    className="p-2 text-center hover:bg-white/10 rounded-xl text-slate-200 transition-colors"
                  >
                    tanh
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Probability Dropdown */}
          <div className="relative">
            <motion.button
              {...btnProps}
              id="btn-prob-dropdown"
              onClick={() => setOpenMenu(openMenu === 'prob' ? null : 'prob')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-all shadow-sm"
            >
              <span>Probability</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </motion.button>

            <AnimatePresence>
              {openMenu === 'prob' && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  className="absolute top-full left-0 mt-2 w-48 p-2 bg-[#141822]/95 border border-white/15 rounded-2xl shadow-2xl z-40 flex flex-col gap-1 text-xs font-mono backdrop-blur-xl"
                >
                  <button
                    onClick={() => handleInsert('!')}
                    className="p-2 text-left hover:bg-blue-500/20 rounded-xl text-slate-200 hover:text-white transition-colors"
                  >
                    Factorial (x!)
                  </button>
                  <button
                    onClick={() => handleInsert('permutations(')}
                    className="p-2 text-left hover:bg-blue-500/20 rounded-xl text-slate-200 hover:text-white transition-colors"
                  >
                    Permutations nPr
                  </button>
                  <button
                    onClick={() => handleInsert('combinations(')}
                    className="p-2 text-left hover:bg-blue-500/20 rounded-xl text-slate-200 hover:text-white transition-colors"
                  >
                    Combinations nCr
                  </button>
                  <button
                    onClick={() => handleInsert('random()')}
                    className="p-2 text-left hover:bg-blue-500/20 rounded-xl text-slate-200 hover:text-white transition-colors"
                  >
                    Random [0,1)
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Calculus Dropdown */}
          <div className="relative">
            <motion.button
              {...btnProps}
              id="btn-calc-dropdown"
              onClick={() => setOpenMenu(openMenu === 'calc' ? null : 'calc')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-all shadow-sm"
            >
              <span>Calculus</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </motion.button>

            <AnimatePresence>
              {openMenu === 'calc' && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  className="absolute top-full left-0 mt-2 w-52 p-2 bg-[#141822]/95 border border-white/15 rounded-2xl shadow-2xl z-40 flex flex-col gap-1 text-xs font-mono backdrop-blur-xl"
                >
                  <button
                    onClick={() => {
                      onCalculusAction('derivative');
                      setOpenMenu(null);
                    }}
                    className="p-2.5 text-left hover:bg-blue-500/20 rounded-xl text-slate-200 hover:text-white transition-colors flex items-center justify-between"
                  >
                    <span>Derivative d/dx</span>
                    <span className="text-[10px] text-blue-400 bg-blue-500/20 px-1.5 py-0.5 rounded font-mono">NUM</span>
                  </button>
                  <button
                    onClick={() => {
                      onCalculusAction('integral');
                      setOpenMenu(null);
                    }}
                    className="p-2.5 text-left hover:bg-blue-500/20 rounded-xl text-slate-200 hover:text-white transition-colors flex items-center justify-between"
                  >
                    <span>Integral ∫[a,b]</span>
                    <span className="text-[10px] text-blue-400 bg-blue-500/20 px-1.5 py-0.5 rounded font-mono">NUM</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Angle Unit Toggle */}
        <motion.button
          {...btnProps}
          id="btn-angle-unit-toggle"
          onClick={onToggleAngleUnit}
          className="px-3 py-1.5 text-xs font-mono font-semibold rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-all uppercase shadow-sm"
        >
          {angleUnit}
        </motion.button>
      </div>

      {/* Main Grid Keypad with 3D Tactile Buttons */}
      <div className="grid grid-cols-8 gap-1.5 sm:gap-2">
        {/* Row 1 */}
        <motion.button
          {...btnProps}
          id="btn-2nd"
          onClick={onToggle2nd}
          className={`h-11 sm:h-12 rounded-2xl font-mono font-medium text-xs sm:text-sm transition-all border shadow-sm ${
            is2ndActive
              ? 'bg-amber-500/30 text-amber-300 border-amber-500/50 shadow-lg shadow-amber-500/20'
              : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white'
          }`}
        >
          2nd
        </motion.button>
        <motion.button
          {...btnProps}
          id="btn-mr"
          onClick={onMemoryRecall}
          className="h-11 sm:h-12 rounded-2xl font-mono font-medium text-xs sm:text-sm bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white transition-all shadow-sm"
        >
          mr
        </motion.button>
        <motion.button
          {...btnProps}
          id="btn-mplus"
          onClick={onMemoryAdd}
          className="h-11 sm:h-12 rounded-2xl font-mono font-medium text-xs sm:text-sm bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white transition-all shadow-sm"
        >
          m+
        </motion.button>
        <motion.button
          {...btnProps}
          id="btn-mc"
          onClick={onMemoryClear}
          className="h-11 sm:h-12 rounded-2xl font-mono font-medium text-xs sm:text-sm bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white transition-all shadow-sm"
        >
          mc
        </motion.button>
        <motion.button
          {...btnProps}
          id="btn-const-e"
          onClick={() => handleInsert(is2ndActive ? 'π' : 'e')}
          className="h-11 sm:h-12 rounded-2xl font-mono font-medium text-xs sm:text-sm bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white transition-all shadow-sm"
        >
          {is2ndActive ? 'π' : 'e'}
        </motion.button>
        <motion.button
          {...btnProps}
          id="btn-ce"
          onClick={onClearEntry}
          className="h-11 sm:h-12 rounded-2xl font-mono font-semibold text-xs sm:text-sm bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30 transition-all shadow-sm"
        >
          CE
        </motion.button>
        <motion.button
          {...btnProps}
          id="btn-c"
          onClick={onClear}
          className="h-11 sm:h-12 rounded-2xl font-mono font-semibold text-xs sm:text-sm bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 transition-all shadow-sm"
        >
          C
        </motion.button>
        <motion.button
          {...btnProps}
          id="btn-backspace"
          onClick={onBackspace}
          className="flex items-center justify-center h-11 sm:h-12 rounded-2xl bg-white/5 text-rose-400 border border-white/10 hover:bg-white/10 transition-all shadow-sm"
          title="Backspace"
        >
          <Delete className="w-4 h-4" />
        </motion.button>

        {/* Row 2 */}
        <motion.button
          {...btnProps}
          id="btn-trig-sin"
          onClick={() => handleInsert(is2ndActive ? 'asin(' : 'sin(')}
          className="h-11 sm:h-12 rounded-2xl font-mono font-medium text-xs sm:text-sm bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white transition-all shadow-sm"
        >
          {is2ndActive ? 'sin⁻¹' : 'sin'}
        </motion.button>
        <motion.button
          {...btnProps}
          id="btn-trig-cos"
          onClick={() => handleInsert(is2ndActive ? 'acos(' : 'cos(')}
          className="h-11 sm:h-12 rounded-2xl font-mono font-medium text-xs sm:text-sm bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white transition-all shadow-sm"
        >
          {is2ndActive ? 'cos⁻¹' : 'cos'}
        </motion.button>
        <motion.button
          {...btnProps}
          id="btn-trig-tan"
          onClick={() => handleInsert(is2ndActive ? 'atan(' : 'tan(')}
          className="h-11 sm:h-12 rounded-2xl font-mono font-medium text-xs sm:text-sm bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white transition-all shadow-sm"
        >
          {is2ndActive ? 'tan⁻¹' : 'tan'}
        </motion.button>
        <motion.button
          {...btnProps}
          id="btn-trig-cot"
          onClick={() => handleInsert('cot(')}
          className="h-11 sm:h-12 rounded-2xl font-mono font-medium text-xs sm:text-sm bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white transition-all shadow-sm"
        >
          cot
        </motion.button>
        <motion.button
          {...btnProps}
          id="btn-paren-open"
          onClick={() => handleInsert('(')}
          className="h-11 sm:h-12 rounded-2xl font-mono font-medium text-xs sm:text-sm bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white transition-all shadow-sm"
        >
          (
        </motion.button>
        <motion.button
          {...btnProps}
          id="btn-paren-close"
          onClick={() => handleInsert(')')}
          className="h-11 sm:h-12 rounded-2xl font-mono font-medium text-xs sm:text-sm bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white transition-all shadow-sm"
        >
          )
        </motion.button>
        <motion.button
          {...btnProps}
          id="btn-percent"
          onClick={() => handleInsert('%')}
          className="h-11 sm:h-12 rounded-2xl font-mono font-medium text-xs sm:text-sm bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white transition-all shadow-sm"
        >
          %
        </motion.button>
        <motion.button
          {...btnProps}
          id="btn-op-divide"
          onClick={() => handleInsert('÷')}
          className="h-11 sm:h-12 rounded-2xl font-mono font-semibold text-base sm:text-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white transition-all shadow-md shadow-blue-500/10"
        >
          ÷
        </motion.button>

        {/* Row 3 */}
        <motion.button
          {...btnProps}
          id="btn-trig-sec"
          onClick={() => handleInsert('sec(')}
          className="h-11 sm:h-12 rounded-2xl font-mono font-medium text-xs sm:text-sm bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white transition-all shadow-sm"
        >
          sec
        </motion.button>
        <motion.button
          {...btnProps}
          id="btn-trig-csc"
          onClick={() => handleInsert('csc(')}
          className="h-11 sm:h-12 rounded-2xl font-mono font-medium text-xs sm:text-sm bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white transition-all shadow-sm"
        >
          csc
        </motion.button>
        <motion.button
          {...btnProps}
          id="btn-num-7"
          onClick={() => handleInsert('7')}
          className="h-11 sm:h-12 rounded-2xl font-mono font-semibold text-base sm:text-lg bg-white/10 text-white border border-white/10 hover:bg-white/20 transition-all shadow-sm"
        >
          7
        </motion.button>
        <motion.button
          {...btnProps}
          id="btn-num-8"
          onClick={() => handleInsert('8')}
          className="h-11 sm:h-12 rounded-2xl font-mono font-semibold text-base sm:text-lg bg-white/10 text-white border border-white/10 hover:bg-white/20 transition-all shadow-sm"
        >
          8
        </motion.button>
        <motion.button
          {...btnProps}
          id="btn-num-9"
          onClick={() => handleInsert('9')}
          className="h-11 sm:h-12 rounded-2xl font-mono font-semibold text-base sm:text-lg bg-white/10 text-white border border-white/10 hover:bg-white/20 transition-all shadow-sm"
        >
          9
        </motion.button>
        <motion.button
          {...btnProps}
          id="btn-op-multiply"
          onClick={() => handleInsert('×')}
          className="h-11 sm:h-12 rounded-2xl font-mono font-semibold text-base sm:text-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white transition-all shadow-md shadow-blue-500/10 col-span-3 sm:col-span-1"
        >
          ×
        </motion.button>

        {/* Row 4 */}
        <motion.button
          {...btnProps}
          id="btn-square"
          onClick={() => handleInsert(is2ndActive ? '√(' : '^2')}
          className="h-11 sm:h-12 rounded-2xl font-mono font-medium text-xs sm:text-sm bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white transition-all shadow-sm"
        >
          {is2ndActive ? '√x' : 'x²'}
        </motion.button>
        <motion.button
          {...btnProps}
          id="btn-cube"
          onClick={() => handleInsert(is2ndActive ? '∛(' : '^3')}
          className="h-11 sm:h-12 rounded-2xl font-mono font-medium text-xs sm:text-sm bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white transition-all shadow-sm"
        >
          {is2ndActive ? '³√x' : 'x³'}
        </motion.button>
        <motion.button
          {...btnProps}
          id="btn-power"
          onClick={() => handleInsert('^')}
          className="h-11 sm:h-12 rounded-2xl font-mono font-medium text-xs sm:text-sm bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white transition-all shadow-sm"
        >
          xʸ
        </motion.button>
        <motion.button
          {...btnProps}
          id="btn-e-power"
          onClick={() => handleInsert('e^')}
          className="h-11 sm:h-12 rounded-2xl font-mono font-medium text-xs sm:text-sm bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white transition-all shadow-sm"
        >
          eˣ
        </motion.button>
        <motion.button
          {...btnProps}
          id="btn-num-4"
          onClick={() => handleInsert('4')}
          className="h-11 sm:h-12 rounded-2xl font-mono font-semibold text-base sm:text-lg bg-white/10 text-white border border-white/10 hover:bg-white/20 transition-all shadow-sm"
        >
          4
        </motion.button>
        <motion.button
          {...btnProps}
          id="btn-num-5"
          onClick={() => handleInsert('5')}
          className="h-11 sm:h-12 rounded-2xl font-mono font-semibold text-base sm:text-lg bg-white/10 text-white border border-white/10 hover:bg-white/20 transition-all shadow-sm"
        >
          5
        </motion.button>
        <motion.button
          {...btnProps}
          id="btn-num-6"
          onClick={() => handleInsert('6')}
          className="h-11 sm:h-12 rounded-2xl font-mono font-semibold text-base sm:text-lg bg-white/10 text-white border border-white/10 hover:bg-white/20 transition-all shadow-sm"
        >
          6
        </motion.button>
        <motion.button
          {...btnProps}
          id="btn-op-subtract"
          onClick={() => handleInsert('−')}
          className="h-11 sm:h-12 rounded-2xl font-mono font-semibold text-base sm:text-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white transition-all shadow-md shadow-blue-500/10"
        >
          −
        </motion.button>

        {/* Row 5 */}
        <motion.button
          {...btnProps}
          id="btn-10-power"
          onClick={() => handleInsert('10^')}
          className="h-11 sm:h-12 rounded-2xl font-mono font-medium text-xs sm:text-sm bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white transition-all shadow-sm"
        >
          10ˣ
        </motion.button>
        <motion.button
          {...btnProps}
          id="btn-ln"
          onClick={() => handleInsert('ln(')}
          className="h-11 sm:h-12 rounded-2xl font-mono font-medium text-xs sm:text-sm bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white transition-all shadow-sm"
        >
          ln
        </motion.button>
        <motion.button
          {...btnProps}
          id="btn-2-power"
          onClick={() => handleInsert('2^')}
          className="h-11 sm:h-12 rounded-2xl font-mono font-medium text-xs sm:text-sm bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white transition-all shadow-sm"
        >
          2ˣ
        </motion.button>
        <motion.button
          {...btnProps}
          id="btn-abs"
          onClick={() => handleInsert('abs(')}
          className="h-11 sm:h-12 rounded-2xl font-mono font-medium text-xs sm:text-sm bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white transition-all shadow-sm"
        >
          |x|
        </motion.button>
        <motion.button
          {...btnProps}
          id="btn-num-1"
          onClick={() => handleInsert('1')}
          className="h-11 sm:h-12 rounded-2xl font-mono font-semibold text-base sm:text-lg bg-white/10 text-white border border-white/10 hover:bg-white/20 transition-all shadow-sm"
        >
          1
        </motion.button>
        <motion.button
          {...btnProps}
          id="btn-num-2"
          onClick={() => handleInsert('2')}
          className="h-11 sm:h-12 rounded-2xl font-mono font-semibold text-base sm:text-lg bg-white/10 text-white border border-white/10 hover:bg-white/20 transition-all shadow-sm"
        >
          2
        </motion.button>
        <motion.button
          {...btnProps}
          id="btn-num-3"
          onClick={() => handleInsert('3')}
          className="h-11 sm:h-12 rounded-2xl font-mono font-semibold text-base sm:text-lg bg-white/10 text-white border border-white/10 hover:bg-white/20 transition-all shadow-sm"
        >
          3
        </motion.button>
        <motion.button
          {...btnProps}
          id="btn-op-add"
          onClick={() => handleInsert('+')}
          className="h-11 sm:h-12 rounded-2xl font-mono font-semibold text-base sm:text-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white transition-all shadow-md shadow-blue-500/10"
        >
          +
        </motion.button>

        {/* Row 6 */}
        <motion.button
          {...btnProps}
          id="btn-angle-unit-key"
          onClick={onToggleAngleUnit}
          className="h-11 sm:h-12 rounded-2xl font-mono font-bold text-xs uppercase bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white transition-all shadow-sm"
        >
          {angleUnit}
        </motion.button>
        <motion.button
          {...btnProps}
          id="btn-log10"
          onClick={() => handleInsert('log10(')}
          className="h-11 sm:h-12 rounded-2xl font-mono font-medium text-xs sm:text-sm bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white transition-all shadow-sm"
        >
          log₁₀
        </motion.button>
        <motion.button
          {...btnProps}
          id="btn-log2"
          onClick={() => handleInsert('log2(')}
          className="h-11 sm:h-12 rounded-2xl font-mono font-medium text-xs sm:text-sm bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white transition-all shadow-sm"
        >
          log₂
        </motion.button>
        <motion.button
          {...btnProps}
          id="btn-factorial"
          onClick={() => handleInsert('!')}
          className="h-11 sm:h-12 rounded-2xl font-mono font-medium text-xs sm:text-sm bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white transition-all shadow-sm"
        >
          x!
        </motion.button>
        <motion.button
          {...btnProps}
          id="btn-negate"
          onClick={() => handleInsert('±')}
          className="h-11 sm:h-12 rounded-2xl font-mono font-medium text-xs sm:text-sm bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white transition-all shadow-sm"
        >
          ±
        </motion.button>
        <motion.button
          {...btnProps}
          id="btn-num-0"
          onClick={() => handleInsert('0')}
          className="h-11 sm:h-12 rounded-2xl font-mono font-semibold text-base sm:text-lg bg-white/10 text-white border border-white/10 hover:bg-white/20 transition-all shadow-sm"
        >
          0
        </motion.button>
        <motion.button
          {...btnProps}
          id="btn-dot"
          onClick={() => handleInsert('.')}
          className="h-11 sm:h-12 rounded-2xl font-mono font-semibold text-base sm:text-lg bg-white/10 text-white border border-white/10 hover:bg-white/20 transition-all shadow-sm"
        >
          .
        </motion.button>
        <motion.button
          {...btnProps}
          id="btn-equals"
          onClick={onEquals}
          className="h-11 sm:h-12 rounded-2xl font-mono font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/30 border border-blue-400/30 transition-all"
        >
          =
        </motion.button>
      </div>
    </div>
  );
};

