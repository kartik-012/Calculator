# MathEngine v2.5.0 — Comprehensive Technical Guide & System Architecture

MathEngine is a high-performance, precision computing environment built with React, TypeScript, MathJS, HTML5 Canvas, and Tailwind CSS. It supports 5 distinct calculation modes: Scientific Computing & Calculus, Standard Calculator, Interactive 2D Function Grapher, 64-Bit Programmer Base & Logic Engine, and Multi-Unit & Real-time FX Currency Converter.

---

## 📐 System Architecture Overview

```
                        ┌──────────────────────────────────────────┐
                        │              MathEngine App              │
                        └────────────────────┬─────────────────────┘
                                             │
      ┌──────────────────┬───────────────────┼───────────────────┬──────────────────┐
      ▼                  ▼                   ▼                   ▼                  ▼
┌───────────────┐ ┌───────────────┐ ┌──────────────────┐ ┌───────────────┐ ┌─────────────────┐
│ Scientific    │ │ Standard      │ │ 2D Grapher       │ │ Programmer    │ │ Unit Converter  │
│ Mode          │ │ Mode          │ │ Canvas Engine    │ │ Bitwise Engine│ │ & FX Exchange   │
└──────┬────────┘ └──────┬────────┘ └────────┬─────────┘ └──────┬────────┘ └────────┬────────┘
       │                 │                   │                  │                   │
       └────────┬────────┘                   │                  │                   │
                ▼                            ▼                  ▼                   ▼
     ┌────────────────────┐       ┌────────────────────┐┌────────────────┐ ┌────────────────┐
     │ MathJS AST Parser  │       │ Canvas 2D Plotter  ││ BigInt Bit Grid│ │ FX API Rates   │
     │ & Evaluator        │       │ Trace & Tangent    ││ Radix 2/8/10/16│ │ & Unit Matrix  │
     └────────────────────┘       └────────────────────┘└────────────────┘ └────────────────┘
```

---

## 🚀 Key Subsystems & Technical Details

### 1. Scientific & Calculus Engine (`Keypad.tsx`, `Display.tsx`, `App.tsx`)
* **AST Evaluation**: Utilizes MathJS Abstract Syntax Tree parsing for continuous evaluation without `eval()`.
* **Numerical Calculus**:
  * **Numerical Derivative**: Central finite difference method:
    $$f'(x) \approx \frac{f(x + h) - f(x - h)}{2h} \quad (h = 10^{-7})$$
  * **Definite Integral**: Composite Simpson's 1/3 Rule over $N = 1000$ subintervals:
    $$\int_{a}^{b} f(x)dx \approx \frac{\Delta x}{3} \left[ f(x_0) + 4\sum_{\text{odd}} f(x_i) + 2\sum_{\text{even}} f(x_i) + f(x_n) \right]$$
* **Trigonometry & Memory**: Full support for standard, inverse, hyperbolic trig (`sin`, `cos`, `tan`, `asin`, `acos`, `atan`, `sinh`, `cosh`, `tanh`, `cot`, `sec`, `csc`), angle conversion ($\text{rad} \leftrightarrow \text{deg}$), and registers (`MC`, `MR`, `M+`, `M-`).

---

### 2. Interactive 2D Function Graphing Engine (`GraphView.tsx`)
* **HTML5 Canvas 2D**: Hardware-accelerated 60 FPS plotting loop with automatic container sizing via `ResizeObserver`.
* **Multi-Plot Support**: Supports up to 4 simultaneous dynamic curves ($f_1(x), f_2(x), f_3(x), f_4(x)$).
* **Live Derivative Tangent Tracing**:
  * Calculates the exact slope $m = f'(x_0)$ at mouse coordinate $x_0$.
  * Renders the tangent line equation $y = m(x - x_0) + f(x_0)$ live on screen.
* **Coordinate Grid & Axis Scaling**: Dynamic zoom-in/zoom-out, grid panning, and origin auto-alignment.

---

### 3. 64-Bit Programmer Calculator (`ProgrammerView.tsx`)
* **BigInt Bit Grid**: Interactive 64-bit grid (Bits 0 to 63) allowing instantaneous toggling of individual binary bits.
* **Radix Synchronized Display**:
  * **HEX**: Hexadecimal (Base 16)
  * **DEC**: Signed/Unsigned Decimal (Base 10)
  * **OCT**: Octal (Base 8)
  * **BIN**: Binary (Base 2)
* **Bitwise Operations**: `AND`, `OR`, `XOR`, `NOT`, `NAND`, `NOR`, `LSH` (Left Shift), `RSH` (Right Shift), `ROL`, `ROR`.
* **Word Size Masking**: QWORD (64-bit), DWORD (32-bit), WORD (16-bit), BYTE (8-bit).

---

### 4. Unit & Live Currency Converter (`ConverterView.tsx`)
* **Physical Units Engine**: Covers 8 key dimensions: Length, Mass, Temperature, Area, Volume, Speed, Time, Data.
* **Live FX Currency Exchange**:
  * Real-time currency fetch via public FX endpoints (USD, EUR, GBP, JPY, CAD, AUD, CHF, INR, CNY, BRL).
  * Interactive exchange rate trends mini-chart using Recharts.
  * Instant swap function for input and output units.

---

### 5. History & State Archiving (`HistorySidebar.tsx`)
* **Persistent Session Storage**: Automatically logs all calculations with timestamps.
* **Archive & Pinning**: Pin favorite results or reuse past outputs in active inputs.
* **Export Options**: Clear history or restore past expressions with a single click.

---

## ⌨️ Keyboard Shortcuts & Hotkeys

| Key | Action / Function |
|---|---|
| `0` - `9` | Numeric Input |
| `+`, `-`, `*`, `/` | Basic Operators (`+`, `−`, `×`, `÷`) |
| `Enter` or `=` | Evaluate Expression |
| `Backspace` | Delete last character |
| `Escape` or `c` | Clear calculation (C / CE) |
| `(` / `)` | Parentheses |
| `^` | Power / Exponentiation |
| `s`, `c`, `t` | Insert `sin(`, `cos(`, `tan(` |
| `l` | Insert `ln(` |

---

## 🛠️ Tech Stack & Dependencies

* **Frontend Framework**: React 18 with Vite
* **Programming Language**: TypeScript
* **Math Computation**: MathJS v12.4+
* **Animations**: Motion (`motion/react`)
* **Icons**: Lucide React
* **Data Visualization**: Recharts
* **Styling**: Tailwind CSS v4

---
*Created for MathEngine v2.5.0 Production Environment.*
