import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { create, all } from 'mathjs';
import { performConversion } from './src/data/conversions.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const math = create(all, {
  number: 'BigNumber',
  precision: 64,
});

// Utility function to clean expressions
const cleanExpression = (expr: string): string => {
  if (typeof expr !== 'string') return '';
  return expr
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/π/g, 'pi')
    .replace(/√/g, 'sqrt')
    .replace(/∛/g, 'cbrt')
    .replace(/ln\(/g, 'log(')
    .replace(/log10\(/g, 'log10(')
    .replace(/log2\(/g, 'log2(');
};

// Utility function to create a scope with angle-unit-aware trig functions
const createTrigScope = (angleUnit: 'deg' | 'rad' = 'rad'): Record<string, any> => {
  if (angleUnit !== 'deg') return {};
  const degToRad = (x: number) => (x * Math.PI) / 180;
  const radToDeg = (x: number) => (x * 180) / Math.PI;
  const trigFunctions: Record<string, (x: number) => number> = {
    sin: (x) => Math.sin(degToRad(x)), cos: (x) => Math.cos(degToRad(x)), tan: (x) => Math.tan(degToRad(x)), cot: (x) => 1 / Math.tan(degToRad(x)), sec: (x) => 1 / Math.cos(degToRad(x)), csc: (x) => 1 / Math.sin(degToRad(x)), asin: (x) => radToDeg(Math.asin(x)), acos: (x) => radToDeg(Math.acos(x)), atan: (x) => radToDeg(Math.atan(x)),
  };
  return trigFunctions;
};

// Utility function for the programmer calculator to parse values from different bases
const parseBigIntFromBase = (value: string = '0', base: number = 10): bigint => {
  if (base === 16) return BigInt(`0x${value || '0'}`);
  if (base === 8) return BigInt(`0o${value || '0'}`);
  if (base === 2) return BigInt(`0b${value || '0'}`);
  return BigInt(value || '0');
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Health Endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Evaluate Expression Endpoint
  app.post('/api/evaluate', (req, res, next) => {
    try {
      const { expression, angleUnit = 'rad' } = req.body;

      if (!expression || typeof expression !== 'string') {
        return res.status(400).json({ success: false, error: 'Invalid expression provided' });
      }

      // Pre-clean expression
      const cleanExpr = cleanExpression(expression);

      // Create a scope with trig functions modified for degrees
      const scope = createTrigScope(angleUnit);

      // Evaluate using mathjs parser
      const rawResult = math.evaluate(cleanExpr, scope);

      let formattedResult = '';
      if (typeof rawResult === 'object' && rawResult !== null && 'toString' in rawResult) {
        formattedResult = rawResult.toString();
      } else if (typeof rawResult === 'number') {
        // Round tiny floating point inaccuracies
        const rounded = Number(Math.round(Number(rawResult + 'e12')) + 'e-12');
        formattedResult = String(rounded);
      } else {
        formattedResult = String(rawResult);
      }

      return res.json({
        success: true,
        result: formattedResult,
      });
    } catch (err) {
      next(err);
    }
  });

  app.post('/api/convert', (req, res, next) => {
    try {
      const { category, fromUnit, toUnit, value } = req.body;
      const numVal = parseFloat(value);
      if (isNaN(numVal)) {
        return res.json({ success: false, error: 'Invalid number value' });
      }

      const { result, formula } = performConversion(category, fromUnit, toUnit, numVal);
      return res.json({
        success: true,
        result,
        formula,
      });
    } catch (err) {
      next(err);
    }
  });

  app.post('/api/programmer', (req, res, next) => {
    try {
      const { value, fromBase = 10, operation, operand2, bitLength = 32 } = req.body;

      const bigVal = parseBigIntFromBase(value, fromBase);
      let resultBig = bigVal;
      if (operation && operand2 !== undefined) {
        const op2 = parseBigIntFromBase(operand2, fromBase);

        switch (operation) {
          case 'AND':
            resultBig = bigVal & op2;
            break;
          case 'OR':
            resultBig = bigVal | op2;
            break;
          case 'XOR':
            resultBig = bigVal ^ op2;
            break;
          case 'NOT':
            resultBig = ~bigVal;
            break;
          case 'LSH':
            resultBig = bigVal << BigInt(Math.min(Number(op2), 64));
            break;
          case 'RSH':
            resultBig = bigVal >> BigInt(Math.min(Number(op2), 64));
            break;
          case 'NAND':
            resultBig = ~(bigVal & op2);
            break;
          case 'NOR':
            resultBig = ~(bigVal | op2);
            break;
        }
      } else if (operation === 'NOT') {
        resultBig = ~bigVal;
      }

      // Format bases
      // Mask according to bit length
      const mask = (BigInt(1) << BigInt(bitLength)) - BigInt(1);
      const maskedResult = resultBig & mask;

      const hex = maskedResult.toString(16).toUpperCase();
      const dec = maskedResult.toString(10);
      const oct = maskedResult.toString(8);
      let bin = maskedResult.toString(2).padStart(bitLength, '0');
      if (bin.length > bitLength) bin = bin.slice(-bitLength);

      // Bits array for visual bit toggle display
      const bitsArr = bin.split('').map((b) => parseInt(b, 10));

      return res.json({
        success: true,
        hex,
        dec,
        oct,
        bin,
        bits: bitsArr,
      });
    } catch (err) {
      next(err);
    }
  });

  app.post('/api/graph-data', (req, res, next) => {
    try {
      const { functions = ['sin(x)'], xMin = -10, xMax = 10, points = 200, angleUnit = 'rad' } = req.body;

      const compiledFuncs = functions.map((fnStr) => {
        return math.compile(cleanExpression(fnStr));
      });

      const step = (xMax - xMin) / points;
      const data = [];

      for (let i = 0; i <= points; i++) {
        const x = xMin + i * step;
        const row: Record<string, number | null> = { x: Number(x.toFixed(4)) };

        compiledFuncs.forEach((compiled, idx) => {
          try {
            const scope = { x, ...createTrigScope(angleUnit) };
            const y = compiled.evaluate(scope);
            if (typeof y === 'number' && isFinite(y) && !isNaN(y)) {
              row[`f${idx}`] = Number(y.toFixed(4));
            } else {
              row[`f${idx}`] = null;
            }
          } catch {
            row[`f${idx}`] = null;
          }
        });

        data.push(row);
      }

      return res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  });

  app.post('/api/calculus', (req, res, next) => {
    try {
      const { type, expression, xValue = 1, lowerLimit = 0, upperLimit = 1, angleUnit = 'rad' } = req.body;

      if (!expression) {
        return res.json({ success: false, error: 'Expression required for calculus' });
      }

      const compiled = math.compile(expression);

      const evalAt = (xVal: number) => {
        const scope = { x: xVal, ...createTrigScope(angleUnit) };
        return compiled.evaluate(scope);
      };

      if (type === 'derivative') {
        const h = 0.00001;
        const d = (evalAt(xValue + h) - evalAt(xValue - h)) / (2 * h);
        if (!isFinite(d)) {
          return res.json({ success: false, error: 'Result is undefined at this point (e.g., division by zero).' });
        }
        return res.json({
          success: true,
          result: d.toFixed(6),
          steps: `d/dx (${expression}) at x = ${xValue} ≈ ${d.toFixed(6)}`,
        });
      } else if (type === 'integral') {
        // Simpson's 1/3 rule
        const n = 1000;
        const h = (upperLimit - lowerLimit) / n;
        let sum = evalAt(lowerLimit) + evalAt(upperLimit);

        for (let i = 1; i < n; i++) {
          const x = lowerLimit + i * h;
          const factor = i % 2 === 0 ? 2 : 4;
          sum += factor * evalAt(x);
        }

        const integralVal = (sum * h) / 3;
        if (!isFinite(integralVal)) {
          return res.json({ success: false, error: 'Integral does not converge or is undefined in this range.' });
        }
        return res.json({
          success: true,
          result: integralVal.toFixed(6),
          steps: `∫[${lowerLimit} to ${upperLimit}] (${expression}) dx ≈ ${integralVal.toFixed(6)}`,
        });
      }

      return res.json({ success: false, error: 'Invalid calculus type' });
    } catch (err) {
      next(err);
    }
  });

  // Vite development vs production static handling
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Global Error Handler
  app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
      success: false,
      error: err.message || 'An unexpected error occurred.',
    });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
