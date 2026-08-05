import React, { useState, useEffect, useRef } from 'react';
import { GraphPoint } from '../types';
import { ZoomIn, ZoomOut, RotateCcw, Plus, Trash2 } from 'lucide-react';

// A custom hook to debounce any fast-changing value
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const GraphView: React.FC = () => {
  const [functions, setFunctions] = useState<string[]>(['sin(x)', 'x^2 - 4']);
  const [xMin, setXMin] = useState<number>(-10);
  const [xMax, setXMax] = useState<number>(10);
  const [graphData, setGraphData] = useState<GraphPoint[]>([]);
  const [hoverCoord, setHoverCoord] = useState<{ x: number; y: number } | null>(null);
  const debouncedFunctions = useDebounce(functions, 300);
  const debouncedXMin = useDebounce(xMin, 300);
  const debouncedXMax = useDebounce(xMax, 300);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const colors = ['#3b82f6', '#10b981', '#f43f5e', '#a855f7'];

  useEffect(() => {
    fetchGraphData();
  }, [debouncedFunctions, debouncedXMin, debouncedXMax]);

  const fetchGraphData = async () => {
    try {
      const res = await fetch('/api/graph-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          functions: debouncedFunctions.filter((f) => f.trim().length > 0),
          xMin: debouncedXMin,
          xMax: debouncedXMax,
          points: 300,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setGraphData(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Draw Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, width, height);

    // Compute y min and max from graph data
    let yMin = debouncedXMin;
    let yMax = debouncedXMax;

    if (graphData.length > 0) {
      const allY = graphData.flatMap((pt) => Object.values(pt).filter((val) => typeof val === 'number' && isFinite(val))) as number[];

      if (allY.length > 0) {
        const dataMinY = Math.min(...allY);
        const dataMaxY = Math.max(...allY);
        const range = dataMaxY - dataMinY;
        const padding = range === 0 ? 5 : range * 0.1;

        // Set y-axis with padding, but clamp to a reasonable max range
        yMin = Math.max(-50, dataMinY - padding);
        yMax = Math.min(50, dataMaxY + padding);
      }
    }

    // Mapping coords to canvas space
    const toCanvasX = (x: number) => ((x - xMin) / (xMax - xMin)) * width;
    const toCanvasY = (y: number) => height - ((y - yMin) / (yMax - yMin)) * height;

    // Draw Grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;

    // Function to calculate a "nice" step for grid lines
    const getNiceStep = (range: number) => {
      const exponent = Math.floor(Math.log10(range));
      const fraction = range / Math.pow(10, exponent);
      let niceFraction;
      if (fraction < 1.5) niceFraction = 1;
      else if (fraction < 3) niceFraction = 2;
      else if (fraction < 7) niceFraction = 5;
      else niceFraction = 10;
      return (niceFraction * Math.pow(10, exponent)) / 5; // Divide for more lines
    };

    const xStep = getNiceStep(xMax - xMin);
    for (let x = Math.floor(xMin / xStep) * xStep; x <= xMax; x += xStep) {
      const cx = toCanvasX(x);
      ctx.beginPath();
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, height);
      ctx.stroke();
    }
    const yStep = getNiceStep(yMax - yMin);
    for (let y = Math.floor(yMin / yStep) * yStep; y <= yMax; y += yStep) {
      const cy = toCanvasY(y);
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(width, cy);
      ctx.stroke();
    }

    // Draw Axes (X=0 and Y=0)
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;

    const originX = toCanvasX(0);
    const originY = toCanvasY(0);

    // Y Axis
    ctx.beginPath();
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, height);
    ctx.stroke();

    // X Axis
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    ctx.stroke();

    // Draw Functions
    if (graphData.length > 1) {
      functions.forEach((_, fnIdx) => {
        const color = colors[fnIdx % colors.length];
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;
        ctx.beginPath();

        let isDrawing = false;
        graphData.forEach((pt) => {
          const xVal = pt.x;
          const yVal = pt[`f${fnIdx}`];

          if (yVal !== null && yVal !== undefined && isFinite(yVal)) {
            const cx = toCanvasX(xVal);
            const cy = toCanvasY(yVal);

            if (!isDrawing) {
              ctx.moveTo(cx, cy);
              isDrawing = true;
            } else {
              ctx.lineTo(cx, cy);
            }
          } else {
            isDrawing = false;
          }
        });
        ctx.stroke();
      });
    }
  }, [graphData, xMin, xMax, functions, debouncedXMin, debouncedXMax]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;

    const xVal = xMin + (mouseX / canvas.width) * (xMax - xMin);
    setHoverCoord({ x: Number(xVal.toFixed(2)), y: 0 });
  };

  const handleZoom = (factor: number) => {
    const center = (xMin + xMax) / 2;
    const range = (xMax - xMin) * factor;
    setXMin(center - range / 2);
    setXMax(center + range / 2);
  };

  const handleReset = () => {
    setXMin(-10);
    setXMax(10);
  };

  const updateFunction = (idx: number, val: string) => {
    const updated = [...functions];
    updated[idx] = val;
    setFunctions(updated);
  };

  const addFunction = () => {
    if (functions.length < 4) {
      setFunctions([...functions, '']);
    }
  };

  const removeFunction = (idx: number) => {
    setFunctions(functions.filter((_, i) => i !== idx));
  };

  return (
    <div className="flex flex-col lg:flex-row h-full bg-[#141416] p-6 rounded-2xl border border-white/10 gap-6 select-none">
      {/* Left Input Sidebar */}
      <div className="flex flex-col w-full lg:w-80 space-y-4">
        <div className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider">Functions f(x)</div>

        <div className="space-y-2">
          {functions.map((fnStr, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: colors[idx % colors.length] }}
              />
              <input
                type="text"
                value={fnStr}
                onChange={(e) => updateFunction(idx, e.target.value)}
                placeholder={`f${idx + 1}(x) e.g., sin(x)`}
                className="flex-1 bg-[#0A0A0B] border border-white/10 text-white text-xs font-mono px-3 py-2.5 rounded-xl focus:outline-none focus:border-blue-500/80 transition-all"
              />
              {functions.length > 1 && (
                <button
                  onClick={() => removeFunction(idx)}
                  className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-white/10 border border-white/5"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}

          {functions.length < 4 && (
            <button
              onClick={addFunction}
              className="flex items-center space-x-1.5 text-xs text-blue-400 hover:text-blue-300 font-mono font-medium pt-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add Function</span>
            </button>
          )}
        </div>

        {/* Range Controls */}
        <div className="pt-4 border-t border-white/10 space-y-3 font-mono">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Domain Range</div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="text-slate-400">xMin:</label>
              <input
                type="number"
                value={xMin}
                onChange={(e) => setXMin(parseFloat(e.target.value) || -10)}
                className="w-full mt-1 bg-[#0A0A0B] border border-white/10 text-white p-2 rounded-xl focus:outline-none focus:border-blue-500/80"
              />
            </div>
            <div>
              <label className="text-slate-400">xMax:</label>
              <input
                type="number"
                value={xMax}
                onChange={(e) => setXMax(parseFloat(e.target.value) || 10)}
                className="w-full mt-1 bg-[#0A0A0B] border border-white/10 text-white p-2 rounded-xl focus:outline-none focus:border-blue-500/80"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex flex-col items-center justify-center relative bg-[#0A0A0B] rounded-2xl border border-white/10 p-3 min-h-[350px]">
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverCoord(null)}
          className="w-full h-auto max-w-[600px] max-h-[400px] rounded-xl cursor-crosshair border border-white/10 shadow-inner"
        />

        {/* Graph Floating Controls */}
        <div className="absolute top-5 right-5 flex items-center space-x-1 bg-[#141416] border border-white/15 p-1 rounded-xl shadow-xl">
          <button
            onClick={() => handleZoom(0.8)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom(1.25)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Reset Range"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Hover Coordinate HUD */}
        {hoverCoord && (
          <div className="absolute bottom-5 left-5 bg-[#141416] border border-white/15 px-3 py-1.5 rounded-xl text-xs font-mono text-blue-400 shadow-xl">
            x ≈ {hoverCoord.x}
          </div>
        )}
      </div>
    </div>
  );
};
