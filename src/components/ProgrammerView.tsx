import React, { useState, useEffect } from 'react';
import { ProgrammerResponse } from '../types';

export const ProgrammerView: React.FC = () => {
  const [activeBase, setActiveBase] = useState<number>(10); // 16, 10, 8, 2
  const [inputValue, setInputValue] = useState<string>('255');
  const [operand2, setOperand2] = useState<string>('');
  const [selectedOp, setSelectedOp] = useState<string | null>(null);
  const [bitLength, setBitLength] = useState<8 | 16 | 32 | 64>(32);
  const [calcData, setCalcData] = useState<ProgrammerResponse | null>(null);

  useEffect(() => {
    fetchProgrammerData();
  }, [inputValue, activeBase, operand2, selectedOp, bitLength]);

  const fetchProgrammerData = async () => {
    try {
      const res = await fetch('/api/programmer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          value: inputValue,
          fromBase: activeBase,
          operation: selectedOp,
          operand2: operand2 || undefined,
          bitLength,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCalcData(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBitClick = (index: number) => {
    if (!calcData?.bin) return;
    const bits = calcData.bin.split('');
    bits[index] = bits[index] === '1' ? '0' : '1';
    const newBin = bits.join('');
    setActiveBase(2);
    setInputValue(newBin);
  };

  const handleCharInput = (char: string) => {
    setInputValue((prev) => (prev === '0' ? char : prev + char));
  };

  const isCharDisabled = (char: string): boolean => {
    if (activeBase === 2) return !['0', '1'].includes(char);
    if (activeBase === 8) return !['0', '1', '2', '3', '4', '5', '6', '7'].includes(char);
    if (activeBase === 10) return !['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(char);
    // Base 16 accepts 0-9 and A-F
    return false;
  };

  return (
    <div className="flex flex-col h-full bg-[#141416] p-6 rounded-2xl border border-white/10 space-y-5 select-none">
      {/* Base Display Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
        {[
          { base: 16, label: 'HEX', val: calcData?.hex || '0' },
          { base: 10, label: 'DEC', val: calcData?.dec || '0' },
          { base: 8, label: 'OCT', val: calcData?.oct || '0' },
          { base: 2, label: 'BIN', val: calcData?.bin || '0' },
        ].map((item) => (
          <div
            key={item.base}
            id={`programmer-base-${item.label.toLowerCase()}`}
            onClick={() => setActiveBase(item.base)}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              activeBase === item.base
                ? 'bg-blue-500/20 border-blue-500/50 text-blue-300 shadow-md'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <div className="text-[10px] font-bold uppercase tracking-widest">{item.label}</div>
            <div className="text-sm font-semibold truncate mt-1">{item.val}</div>
          </div>
        ))}
      </div>

      {/* Bit Word-Size Selector */}
      <div className="flex items-center justify-between px-1 text-xs font-mono text-slate-400">
        <span className="font-semibold">Word Size:</span>
        <div className="flex space-x-2">
          {[8, 16, 32, 64].map((len) => (
            <button
              key={len}
              onClick={() => setBitLength(len as any)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                bitLength === len
                  ? 'bg-blue-600 text-white border border-blue-500/40'
                  : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              {len}-BIT
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Bit Toggle Grid */}
      {calcData?.bits && (
        <div className="p-4 bg-[#0A0A0B] rounded-xl border border-white/10">
          <div className="text-[11px] font-mono text-slate-400 mb-2.5">Interactive Bits (click to flip):</div>
          <div className="grid grid-cols-8 sm:grid-cols-16 gap-1 font-mono text-xs">
            {calcData.bits.map((bit, idx) => (
              <button
                key={idx}
                onClick={() => handleBitClick(idx)}
                className={`py-1.5 rounded-md text-center font-bold transition-colors ${
                  bit === 1
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white/5 text-slate-500 hover:text-slate-300 border border-white/5'
                }`}
              >
                {bit}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bitwise Operations & Keypad */}
      <div className="grid grid-cols-6 gap-2 select-none">
        {['AND', 'OR', 'XOR', 'NOT', 'LSH', 'RSH', 'NAND', 'NOR'].map((op) => (
          <button
            key={op}
            onClick={() => setSelectedOp(selectedOp === op ? null : op)}
            className={`h-11 rounded-xl text-xs font-mono font-bold transition-all ${
              selectedOp === op
                ? 'bg-blue-600 text-white shadow-lg border border-blue-400/40'
                : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
            }`}
          >
            {op}
          </button>
        ))}

        <button
          onClick={() => {
            setInputValue('0');
            setOperand2('');
            setSelectedOp(null);
          }}
          className="h-11 col-span-2 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 font-bold text-xs font-mono"
        >
          CLEAR
        </button>

        {/* HEX/DEC Buttons A-F and 0-9 */}
        {['A', 'B', 'C', 'D', 'E', 'F', '7', '8', '9', '4', '5', '6', '1', '2', '3', '0'].map((keyChar) => {
          const disabled = isCharDisabled(keyChar);
          return (
            <button
              key={keyChar}
              disabled={disabled}
              onClick={() => handleCharInput(keyChar)}
              className={`h-12 rounded-xl font-mono font-bold text-sm sm:text-base transition-all ${
                disabled
                  ? 'bg-white/2 text-slate-700 cursor-not-allowed border border-white/5'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
              }`}
            >
              {keyChar}
            </button>
          );
        })}
      </div>
    </div>
  );
};
