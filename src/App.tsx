import { useState, useEffect } from 'react';
import { CalcMode, AngleUnit, CalculationHistoryItem } from './types';
import { Header } from './components/Header';
import { Display } from './components/Display';
import { Keypad } from './components/Keypad';
import { StandardKeypad } from './components/StandardKeypad';
import { HistorySidebar } from './components/HistorySidebar';
import { ConverterView } from './components/ConverterView';
import { ProgrammerView } from './components/ProgrammerView';
import { GraphView } from './components/GraphView';
import { X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [mode, setMode] = useState<CalcMode>('scientific');
  const [angleUnit, setAngleUnit] = useState<AngleUnit>('deg');
  const [expression, setExpression] = useState<string>('');
  const [currentInput, setCurrentInput] = useState<string>('0');
  const [resultPreview, setResultPreview] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  // States
  const [is2ndActive, setIs2ndActive] = useState<boolean>(false);
  const [memoryValue, setMemoryValue] = useState<number>(0);
  const [hasMemory, setHasMemory] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [showSidebar, setShowSidebar] = useState<boolean>(false);

  // Calculus Modal State
  const [calcModalOpen, setCalcModalOpen] = useState<boolean>(false);
  const [calcType, setCalcType] = useState<'derivative' | 'integral'>('derivative');
  const [calcExpr, setCalcExpr] = useState<string>('x^2 + 3*x');
  const [calcXVal, setCalcXVal] = useState<number>(2);
  const [calcLower, setCalcLower] = useState<number>(0);
  const [calcUpper, setCalcUpper] = useState<number>(1);

  // History State
  const [history, setHistory] = useState<CalculationHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('calc_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save history on change
  useEffect(() => {
    try {
      localStorage.setItem('calc_history', JSON.stringify(history));
    } catch (e) {
      console.error(e);
    }
  }, [history]);

  // Handle keyboard inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture keys if user is in an input field (e.g. converter, graph, programmer)
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        handleInput(e.key);
      } else if (e.key === '.') {
        handleInput('.');
      } else if (e.key === '+') {
        handleInput('+');
      } else if (e.key === '-') {
        handleInput('−');
      } else if (e.key === '*') {
        handleInput('×');
      } else if (e.key === '/') {
        handleInput('÷');
      } else if (e.key === '(' || e.key === ')') {
        handleInput(e.key);
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentInput, expression, angleUnit, mode]);

  const handleInput = (val: string) => {
    setError(null);

    // Prevent starting with multiple leading zeroes
    if (currentInput === '0' && val !== '.' && !['+', '−', '×', '÷', '%'].includes(val)) {
      setCurrentInput(val);
      return;
    }

    setCurrentInput((prev) => prev + val);
  };

  const handleClear = () => {
    setCurrentInput('0');
    setExpression('');
    setResultPreview(undefined);
    setError(null);
  };

  const handleClearEntry = () => {
    setCurrentInput('0');
    setError(null);
  };

  const handleBackspace = () => {
    setError(null);
    if (currentInput.length <= 1) {
      setCurrentInput('0');
    } else {
      setCurrentInput((prev) => prev.slice(0, -1));
    }
  };

  const handleEquals = async () => {
    if (!currentInput) return;

    setError(null);
    const exprToEval = currentInput;

    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expression: exprToEval,
          angleUnit,
        }),
      });

      const data = await res.json();

      if (data.success && data.result !== undefined) {
        setExpression(exprToEval);
        setCurrentInput(data.result);
        setResultPreview(undefined);

        // Add to history
        const newItem: CalculationHistoryItem = {
          id: Date.now().toString(),
          expression: exprToEval,
          result: data.result,
          timestamp: Date.now(),
          mode,
          angleUnit,
        };
        setHistory((prev) => [newItem, ...prev]);
      } else {
        setError(data.error || 'Evaluation Error');
      }
    } catch (err: any) {
      setError(err.message || 'Server Error');
    }
  };

  // Memory Handlers
  const handleMemoryAdd = () => {
    const val = parseFloat(currentInput);
    if (!isNaN(val)) {
      setMemoryValue((prev) => prev + val);
      setHasMemory(true);
    }
  };

  const handleMemoryRecall = () => {
    if (hasMemory) {
      setCurrentInput(String(memoryValue));
    }
  };

  const handleMemoryClear = () => {
    setMemoryValue(0);
    setHasMemory(false);
  };

  // Calculus Action Trigger
  const handleCalculusTrigger = (type: 'derivative' | 'integral') => {
    setCalcType(type);
    setCalcModalOpen(true);
  };

  const executeCalculus = async () => {
    try {
      const res = await fetch('/api/calculus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: calcType,
          expression: calcExpr,
          xValue: calcXVal,
          lowerLimit: calcLower,
          upperLimit: calcUpper,
          angleUnit,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setExpression(data.steps);
        setCurrentInput(data.result);

        // Add to history
        const newItem: CalculationHistoryItem = {
          id: Date.now().toString(),
          expression: data.steps,
          result: data.result,
          timestamp: Date.now(),
          mode: 'scientific',
          angleUnit,
        };
        setHistory((prev) => [newItem, ...prev]);
        setCalcModalOpen(false);
      } else {
        setError(data.error || 'Calculus Error');
      }
    } catch (err: any) {
      setError(err.message || 'Calculus Request Failed');
    }
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${isDarkMode ? 'bg-[#090d16] text-zinc-100' : 'bg-slate-100 text-slate-900'}`}>
      <div className="flex flex-col h-screen max-w-[1600px] mx-auto overflow-hidden relative">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <Header
          currentMode={mode}
          onSelectMode={setMode}
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode(!isDarkMode)}
          showSidebar={showSidebar}
          onToggleSidebar={() => setShowSidebar(!showSidebar)}
          historyCount={history.length}
        />

        {/* Main Application Body */}
        <div className="flex flex-1 overflow-hidden relative z-10">
          {/* Main Calculator View Area */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-center max-w-4xl mx-auto w-full">
            <AnimatePresence mode="wait">
              {mode === 'scientific' && (
                <motion.div
                  key="scientific"
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.98 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="flex flex-col max-w-3xl mx-auto w-full"
                >
                  <Display
                    expression={expression}
                    currentInput={currentInput}
                    resultPreview={resultPreview}
                    angleUnit={angleUnit}
                    onToggleAngleUnit={() => setAngleUnit(angleUnit === 'deg' ? 'rad' : 'deg')}
                    is2ndActive={is2ndActive}
                    hasMemory={hasMemory}
                    memoryValue={memoryValue}
                    error={error}
                  />
                  <Keypad
                    onInput={handleInput}
                    onClear={handleClear}
                    onClearEntry={handleClearEntry}
                    onBackspace={handleBackspace}
                    onEquals={handleEquals}
                    onMemoryAdd={handleMemoryAdd}
                    onMemoryRecall={handleMemoryRecall}
                    onMemoryClear={handleMemoryClear}
                    is2ndActive={is2ndActive}
                    onToggle2nd={() => setIs2ndActive(!is2ndActive)}
                    angleUnit={angleUnit}
                    onToggleAngleUnit={() => setAngleUnit(angleUnit === 'deg' ? 'rad' : 'deg')}
                    onCalculusAction={handleCalculusTrigger}
                  />
                </motion.div>
              )}

              {mode === 'standard' && (
                <motion.div
                  key="standard"
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.98 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="flex flex-col max-w-md mx-auto w-full"
                >
                  <Display
                    expression={expression}
                    currentInput={currentInput}
                    resultPreview={resultPreview}
                    angleUnit={angleUnit}
                    onToggleAngleUnit={() => setAngleUnit(angleUnit === 'deg' ? 'rad' : 'deg')}
                    is2ndActive={false}
                    hasMemory={hasMemory}
                    memoryValue={memoryValue}
                    error={error}
                  />
                  <StandardKeypad
                    onInput={handleInput}
                    onClear={handleClear}
                    onClearEntry={handleClearEntry}
                    onBackspace={handleBackspace}
                    onEquals={handleEquals}
                    onMemoryAdd={handleMemoryAdd}
                    onMemoryRecall={handleMemoryRecall}
                    onMemoryClear={handleMemoryClear}
                  />
                </motion.div>
              )}

              {mode === 'converter' && (
                <motion.div
                  key="converter"
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.98 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="w-full"
                >
                  <ConverterView />
                </motion.div>
              )}

              {mode === 'programmer' && (
                <motion.div
                  key="programmer"
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.98 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="w-full"
                >
                  <ProgrammerView />
                </motion.div>
              )}

              {mode === 'graph' && (
                <motion.div
                  key="graph"
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.98 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="w-full"
                >
                  <GraphView />
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          {/* Right History Sidebar */}
          <AnimatePresence>
            {showSidebar && (
              <motion.aside
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 300 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed inset-y-0 right-0 z-40 sm:relative sm:z-auto flex-shrink-0"
              >
                <HistorySidebar
                  history={history}
                  onSelectHistoryItem={(item) => {
                    setExpression(item.expression);
                    setCurrentInput(item.result);
                  }}
                  onClearHistory={() => setHistory([])}
                  onToggleArchiveItem={(id) =>
                    setHistory((prev) =>
                      prev.map((i) => (i.id === id ? { ...i, isArchived: !i.isArchived } : i))
                    )
                  }
                  onDeleteItem={(id) => setHistory((prev) => prev.filter((i) => i.id !== id))}
                  onClose={() => setShowSidebar(false)}
                />
              </motion.aside>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Calculus Modal Dialog */}
      <AnimatePresence>
        {calcModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#121622] border border-white/15 rounded-3xl w-full max-w-md p-6 space-y-5 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-lg font-bold text-white capitalize flex items-center gap-2">
                  <span className="p-1.5 rounded-xl bg-blue-500/20 text-blue-400">∫</span>
                  <span>Evaluate Numerical {calcType}</span>
                </h3>
                <button
                  onClick={() => setCalcModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <label className="text-xs font-semibold text-slate-400">Function f(x):</label>
                  <input
                    type="text"
                    value={calcExpr}
                    onChange={(e) => setCalcExpr(e.target.value)}
                    className="w-full mt-1.5 bg-white/5 border border-white/10 text-white font-mono p-3.5 rounded-2xl focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="e.g. x^3 - 2*x + 5"
                  />
                </div>

                {calcType === 'derivative' ? (
                  <div>
                    <label className="text-xs font-semibold text-slate-400">Evaluate d/dx at x =</label>
                    <input
                      type="number"
                      value={calcXVal}
                      onChange={(e) => setCalcXVal(parseFloat(e.target.value) || 0)}
                      className="w-full mt-1.5 bg-white/5 border border-white/10 text-white font-mono p-3.5 rounded-2xl focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-400">Lower Limit (a):</label>
                      <input
                        type="number"
                        value={calcLower}
                        onChange={(e) => setCalcLower(parseFloat(e.target.value) || 0)}
                        className="w-full mt-1.5 bg-white/5 border border-white/10 text-white font-mono p-3.5 rounded-2xl focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-400">Upper Limit (b):</label>
                      <input
                        type="number"
                        value={calcUpper}
                        onChange={(e) => setCalcUpper(parseFloat(e.target.value) || 0)}
                        className="w-full mt-1.5 bg-white/5 border border-white/10 text-white font-mono p-3.5 rounded-2xl focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-white/10">
                <button
                  onClick={() => setCalcModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium bg-white/5 text-slate-300 hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={executeCalculus}
                  className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/30 transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Calculate</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

