import React from 'react';
import { Delete } from 'lucide-react';
import { motion } from 'motion/react';

interface StandardKeypadProps {
  onInput: (val: string) => void;
  onClear: () => void;
  onClearEntry: () => void;
  onBackspace: () => void;
  onEquals: () => void;
  onMemoryAdd: () => void;
  onMemoryRecall: () => void;
  onMemoryClear: () => void;
}

export const StandardKeypad: React.FC<StandardKeypadProps> = ({
  onInput,
  onClear,
  onClearEntry,
  onBackspace,
  onEquals,
  onMemoryAdd,
  onMemoryRecall,
  onMemoryClear,
}) => {
  const btnProps = {
    whileHover: { scale: 1.04, y: -1 },
    whileTap: { scale: 0.93, y: 1 },
    transition: { type: 'spring', stiffness: 500, damping: 25 },
  };

  return (
    <div className="grid grid-cols-4 gap-2.5 select-none font-mono">
      {/* Memory Row */}
      <motion.button
        {...btnProps}
        id="btn-std-mc"
        onClick={onMemoryClear}
        className="h-12 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 font-medium text-sm transition-all shadow-sm"
      >
        MC
      </motion.button>
      <motion.button
        {...btnProps}
        id="btn-std-mr"
        onClick={onMemoryRecall}
        className="h-12 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 font-medium text-sm transition-all shadow-sm"
      >
        MR
      </motion.button>
      <motion.button
        {...btnProps}
        id="btn-std-mplus"
        onClick={onMemoryAdd}
        className="h-12 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 font-medium text-sm transition-all shadow-sm"
      >
        M+
      </motion.button>
      <motion.button
        {...btnProps}
        id="btn-std-percent"
        onClick={() => onInput('%')}
        className="h-12 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 font-medium text-sm transition-all shadow-sm"
      >
        %
      </motion.button>

      {/* Row 1 */}
      <motion.button
        {...btnProps}
        id="btn-std-ce"
        onClick={onClearEntry}
        className="h-14 rounded-2xl bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30 font-semibold transition-all shadow-sm"
      >
        CE
      </motion.button>
      <motion.button
        {...btnProps}
        id="btn-std-c"
        onClick={onClear}
        className="h-14 rounded-2xl bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 font-semibold transition-all shadow-sm"
      >
        C
      </motion.button>
      <motion.button
        {...btnProps}
        id="btn-std-backspace"
        onClick={onBackspace}
        className="flex items-center justify-center h-14 rounded-2xl bg-white/5 border border-white/10 text-rose-400 hover:bg-white/10 transition-all shadow-sm"
      >
        <Delete className="w-5 h-5" />
      </motion.button>
      <motion.button
        {...btnProps}
        id="btn-std-divide"
        onClick={() => onInput('÷')}
        className="h-14 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white font-semibold text-xl transition-all shadow-md shadow-blue-500/10"
      >
        ÷
      </motion.button>

      {/* Row 2 */}
      <motion.button
        {...btnProps}
        id="btn-std-7"
        onClick={() => onInput('7')}
        className="h-14 rounded-2xl bg-white/10 text-white border border-white/10 hover:bg-white/20 font-semibold text-lg transition-all shadow-sm"
      >
        7
      </motion.button>
      <motion.button
        {...btnProps}
        id="btn-std-8"
        onClick={() => onInput('8')}
        className="h-14 rounded-2xl bg-white/10 text-white border border-white/10 hover:bg-white/20 font-semibold text-lg transition-all shadow-sm"
      >
        8
      </motion.button>
      <motion.button
        {...btnProps}
        id="btn-std-9"
        onClick={() => onInput('9')}
        className="h-14 rounded-2xl bg-white/10 text-white border border-white/10 hover:bg-white/20 font-semibold text-lg transition-all shadow-sm"
      >
        9
      </motion.button>
      <motion.button
        {...btnProps}
        id="btn-std-multiply"
        onClick={() => onInput('×')}
        className="h-14 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white font-semibold text-xl transition-all shadow-md shadow-blue-500/10"
      >
        ×
      </motion.button>

      {/* Row 3 */}
      <motion.button
        {...btnProps}
        id="btn-std-4"
        onClick={() => onInput('4')}
        className="h-14 rounded-2xl bg-white/10 text-white border border-white/10 hover:bg-white/20 font-semibold text-lg transition-all shadow-sm"
      >
        4
      </motion.button>
      <motion.button
        {...btnProps}
        id="btn-std-5"
        onClick={() => onInput('5')}
        className="h-14 rounded-2xl bg-white/10 text-white border border-white/10 hover:bg-white/20 font-semibold text-lg transition-all shadow-sm"
      >
        5
      </motion.button>
      <motion.button
        {...btnProps}
        id="btn-std-6"
        onClick={() => onInput('6')}
        className="h-14 rounded-2xl bg-white/10 text-white border border-white/10 hover:bg-white/20 font-semibold text-lg transition-all shadow-sm"
      >
        6
      </motion.button>
      <motion.button
        {...btnProps}
        id="btn-std-subtract"
        onClick={() => onInput('−')}
        className="h-14 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white font-semibold text-xl transition-all shadow-md shadow-blue-500/10"
      >
        −
      </motion.button>

      {/* Row 4 */}
      <motion.button
        {...btnProps}
        id="btn-std-1"
        onClick={() => onInput('1')}
        className="h-14 rounded-2xl bg-white/10 text-white border border-white/10 hover:bg-white/20 font-semibold text-lg transition-all shadow-sm"
      >
        1
      </motion.button>
      <motion.button
        {...btnProps}
        id="btn-std-2"
        onClick={() => onInput('2')}
        className="h-14 rounded-2xl bg-white/10 text-white border border-white/10 hover:bg-white/20 font-semibold text-lg transition-all shadow-sm"
      >
        2
      </motion.button>
      <motion.button
        {...btnProps}
        id="btn-std-3"
        onClick={() => onInput('3')}
        className="h-14 rounded-2xl bg-white/10 text-white border border-white/10 hover:bg-white/20 font-semibold text-lg transition-all shadow-sm"
      >
        3
      </motion.button>
      <motion.button
        {...btnProps}
        id="btn-std-add"
        onClick={() => onInput('+')}
        className="h-14 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white font-semibold text-xl transition-all shadow-md shadow-blue-500/10"
      >
        +
      </motion.button>

      {/* Row 5 */}
      <motion.button
        {...btnProps}
        id="btn-std-pm"
        onClick={() => onInput('±')}
        className="h-14 rounded-2xl bg-white/5 border border-white/10 text-slate-300 hover:text-white font-semibold transition-all shadow-sm"
      >
        ±
      </motion.button>
      <motion.button
        {...btnProps}
        id="btn-std-0"
        onClick={() => onInput('0')}
        className="h-14 rounded-2xl bg-white/10 text-white border border-white/10 hover:bg-white/20 font-semibold text-lg transition-all shadow-sm"
      >
        0
      </motion.button>
      <motion.button
        {...btnProps}
        id="btn-std-dot"
        onClick={() => onInput('.')}
        className="h-14 rounded-2xl bg-white/10 text-white border border-white/10 hover:bg-white/20 font-semibold text-lg transition-all shadow-sm"
      >
        .
      </motion.button>
      <motion.button
        {...btnProps}
        id="btn-std-equals"
        onClick={onEquals}
        className="h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-2xl shadow-lg shadow-blue-500/30 border border-blue-400/30 transition-all"
      >
        =
      </motion.button>
    </div>
  );
};

