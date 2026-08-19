# 🧮 MathEngine v2.5.0 — High-Precision Computing Environment

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB.svg?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4.svg?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/) 
[![License](https://img.shields.io/badge/License-MIT-emerald.svg?style=for-the-badge)](LICENSE)

**MathEngine** is an advanced, high-precision scientific computing and engineering suite built for web browsers. Engineered with React 18, TypeScript, MathJS AST parsing, HTML5 Canvas 2D, and BigInt logic, MathEngine delivers zero-eval numerical accuracy across 5 distinct specialized computing environments in a sleek, responsive dark theme.

## ⚡ Features Overview

### 1. 📐 Scientific & Calculus Engine
* **Safe AST Parsing**: Built on MathJS Abstract Syntax Tree evaluation with zero unsafe `eval()` execution.
* **Numerical Calculus Tools**:
  * **Numerical Derivative**: $f'(x)$ evaluated using central finite difference scheme ($h = 10^{-7}$).
  * **Definite Integral**: $\int_{a}^{b} f(x)dx$ computed via Composite Simpson's 1/3 Rule ($N = 1000$ subintervals).
* **Trigonometric & Hyperbolic Suite**: Full support for standard, inverse, and hyperbolic functions (`sin`, `cos`, `tan`, `asin`, `acos`, `atan`, `sinh`, `cosh`, `tanh`, `cot`, `sec`, `csc`).
* **Memory & Angle Controls**: Degrees/Radians conversion toggle, memory storage registers (`MC`, `MR`, `M+`, `M-`).

### 2. 📈 Interactive 2D Function Grapher
* **60 FPS Hardware-Accelerated Rendering**: Plotting loop executed via HTML5 Canvas 2D with dynamic container responsiveness via `ResizeObserver`.
* **Multi-Function Simultaneous Plotting**: Render up to 4 concurrent mathematical curves with distinct color spectrums.
* **Live Derivative Tangent Tracing**: Displays real-time tangent line vector $y = f'(x_0)(x - x_0) + f(x_0)$ and cursor coordinates $x, y$.
* **Viewport Navigation**: Smooth panning, zooming (+/-), coordinate origin reset, and grid alignment.

### 3. 💻 64-Bit Programmer Calculator
* **Interactive Bit Grid**: Clickable 64-bit grid (Bits 0–63) allowing direct toggle manipulation of binary bits.
* **Synchronized Radix Conversion**: Instantaneous conversion across Hexadecimal (**HEX**), Signed/Unsigned Decimal (**DEC**), Octal (**OCT**), and Binary (**BIN**).
* **Bitwise Operations**: `AND`, `OR`, `XOR`, `NOT`, `NAND`, `NOR`, `LSH` (Left Shift), `RSH` (Right Shift), `ROL` (Rotate Left), `ROR` (Rotate Right).
* **Word Boundary Masking**: Toggle between QWORD (64-bit), DWORD (32-bit), WORD (16-bit), and BYTE (8-bit) bitmasks.

### 4. 🔄 Multi-Unit & Real-Time Currency Converter
* **8 Physical Measurement Dimensions**: Length, Mass, Temperature, Area, Volume, Speed, Time, and Digital Storage.
* **Live FX Currency Exchange**: Fetches real-time exchange rates for global currencies (USD, EUR, GBP, JPY, CAD, AUD, CHF, INR, CNY, BRL).
* **Historical Trend Charts**: Interactive exchange rate trends visualization rendered with Recharts.

### 5. 📜 Session History & Archiving
* **Automated Log Register**: Keeps a complete record of evaluated expressions with timestamps.
* **Pin & Insert**: Pin favorite equations or restore past calculations into active input fields with one click.

---

## 🏛️ System Architecture

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

## 🧮 Numerical Algorithms & Mathematical Foundations

### Numerical Differentiation — Central Difference Scheme
$$\frac{df}{dx} \approx \frac{f(x + h) - f(x - h)}{2h} \quad (h = 10^{-7})$$

### Definite Integration — Composite Simpson's 1/3 Rule
$$\int_{a}^{b} f(x) \, dx \approx \frac{\Delta x}{3} \left[ f(x_0) + 4 \sum_{i=1,3,5}^{N-1} f(x_i) + 2 \sum_{j=2,4,6}^{N-2} f(x_j) + f(x_N) \right]$$

---

## ⌨️ Keyboard Shortcuts

| Key | Function / Action |
|---|---|
| `0` - `9` | Digit entry |
| `+`, `-`, `*`, `/` | Basic arithmetic operators (`+`, `−`, `×`, `÷`) |
| `Enter` / `=` | Evaluate current expression |
| `Backspace` | Delete previous character |
| `Escape` / `c` | Clear entry / reset current field |
| `(` / `)` | Parentheses |
| `^` | Power / exponentiation |
| `s`, `c`, `t` | Quick insert `sin(`, `cos(`, `tan(` |

---

## 📂 Project Directory Structure

```text
.
├── src/
│   ├── components/
│   │   ├── Display.tsx            # Main expression & calculation display
│   │   ├── Keypad.tsx             # Scientific keypad & 2nd functions
│   │   ├── StandardKeypad.tsx     # Standard arithmetic keypad
│   │   ├── GraphView.tsx          # HTML5 Canvas 2D function plotter
│   │   ├── ProgrammerView.tsx     # 64-bit Bitgrid & base conversion
│   │   ├── ConverterView.tsx      # Multi-unit & FX currency converter
│   │   ├── Header.tsx             # Navigation header & mode switches
│   │   └── HistorySidebar.tsx     # Log history & pinned expressions
│   ├── types.ts                   # TypeScript definitions
│   ├── App.tsx                    # Core application state orchestrator
│   └── main.tsx                   # Application entry point
├── TECHNICAL_GUIDE.md             # Developer architecture & specifications
├── README.md                      # GitHub repository documentation
├── package.json                   # Dependencies & build scripts
└── vite.config.ts                 # Vite bundler configuration
```

---

## 💻 Run Locally

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm** or **yarn**

### Quick Start Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/mathengine.git
   cd mathengine
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment (Optional)**:
   ```bash
   cp .env.example .env.local
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

5. **Open Browser**:
   Navigate to `http://localhost:3000` to access MathEngine.

---

## 🛠️ Technology Stack

* **Frontend Framework**: React 18
* **Build System**: Vite 5
* **Type System**: TypeScript 5
* **Mathematical Parser**: MathJS v12.4
* **Canvas Engine**: HTML5 Canvas 2D + ResizeObserver
* **Data Visualization**: Recharts
* **Animation & Motion**: Motion (`motion/react`)
* **Styling**: Tailwind CSS v4

---

## 📄 License

Distributed under the [MIT License](LICENSE).
