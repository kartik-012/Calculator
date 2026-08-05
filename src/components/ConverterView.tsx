import React, { useState, useEffect } from 'react';
import { CONVERSION_CATEGORIES, performConversion } from '../data/conversions';
import { ArrowLeftRight, Calculator } from 'lucide-react';

export const ConverterView: React.FC = () => {
  const [selectedCatId, setSelectedCatId] = useState<string>('length');
  const [fromUnitId, setFromUnitId] = useState<string>('m');
  const [toUnitId, setToUnitId] = useState<string>('ft');
  const [inputValue, setInputValue] = useState<string>('1');
  const [resultValue, setResultValue] = useState<number>(3.28084);
  const [formulaText, setFormulaText] = useState<string>('');

  const currentCategory = CONVERSION_CATEGORIES.find((c) => c.id === selectedCatId) || CONVERSION_CATEGORIES[0];

  // Update units when category changes
  useEffect(() => {
    if (currentCategory && currentCategory.units.length >= 2) {
      setFromUnitId(currentCategory.units[0].id);
      setToUnitId(currentCategory.units[1].id);
    }
  }, [selectedCatId]);

  // Recalculate on input/unit change
  useEffect(() => {
    const num = parseFloat(inputValue);
    if (!isNaN(num)) {
      const { result, formula } = performConversion(selectedCatId, fromUnitId, toUnitId, num);
      setResultValue(result);
      setFormulaText(formula);
    } else {
      setResultValue(0);
      setFormulaText('');
    }
  }, [selectedCatId, fromUnitId, toUnitId, inputValue]);

  const handleSwap = () => {
    const prevFrom = fromUnitId;
    setFromUnitId(toUnitId);
    setToUnitId(prevFrom);
  };

  return (
    <div className="flex flex-col h-full bg-[#141416] p-6 rounded-2xl border border-white/10 space-y-6 select-none">
      {/* Category selector pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {CONVERSION_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            id={`btn-cat-${cat.id}`}
            onClick={() => setSelectedCatId(cat.id)}
            className={`px-3.5 py-2 text-xs font-mono font-medium rounded-xl whitespace-nowrap transition-all ${
              selectedCatId === cat.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-500/50'
                : 'bg-white/5 text-slate-400 border border-white/10 hover:text-white hover:bg-white/10'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Main Conversion Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center relative">
        {/* FROM Card */}
        <div className="flex flex-col p-5 bg-[#0A0A0B] rounded-2xl border border-white/10 space-y-3 shadow-sm">
          <label className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-400">From</label>

          <input
            id="converter-from-input"
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full bg-[#141416] border border-white/10 text-white text-3xl font-mono font-semibold p-3.5 rounded-xl focus:outline-none focus:border-blue-500/80 transition-all"
            placeholder="0"
          />

          <select
            id="converter-from-unit-select"
            value={fromUnitId}
            onChange={(e) => setFromUnitId(e.target.value)}
            className="w-full bg-[#141416] border border-white/10 text-slate-200 text-xs font-mono p-3 rounded-xl focus:outline-none focus:border-blue-500/80 cursor-pointer"
          >
            {currentCategory.units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.symbol})
              </option>
            ))}
          </select>
        </div>

        {/* Swap Button in center */}
        <div className="md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 flex justify-center z-10">
          <button
            id="btn-swap-units"
            onClick={handleSwap}
            className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-xl transition-all active:scale-90 border border-blue-400/30"
            title="Swap Units"
          >
            <ArrowLeftRight className="w-5 h-5" />
          </button>
        </div>

        {/* TO Card */}
        <div className="flex flex-col p-5 bg-[#0A0A0B] rounded-2xl border border-white/10 space-y-3 shadow-sm">
          <label className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-400">To</label>

          <div
            id="converter-result-display"
            className="w-full bg-[#141416] border border-white/10 text-blue-400 text-3xl font-mono font-semibold p-3.5 rounded-xl overflow-x-auto whitespace-nowrap no-scrollbar"
          >
            {resultValue.toLocaleString('en-US', { maximumFractionDigits: 8 })}
          </div>

          <select
            id="converter-to-unit-select"
            value={toUnitId}
            onChange={(e) => setToUnitId(e.target.value)}
            className="w-full bg-[#141416] border border-white/10 text-slate-200 text-xs font-mono p-3 rounded-xl focus:outline-none focus:border-blue-500/80 cursor-pointer"
          >
            {currentCategory.units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.symbol})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Formula Explanation Footer */}
      {formulaText && (
        <div className="flex items-center justify-between p-4 bg-[#0A0A0B] rounded-xl border border-white/10 text-xs font-mono text-slate-400">
          <div className="flex items-center space-x-2">
            <Calculator className="w-4 h-4 text-blue-400" />
            <span>Formula Ratio:</span>
          </div>
          <span className="text-white font-semibold">{formulaText}</span>
        </div>
      )}
    </div>
  );
};
