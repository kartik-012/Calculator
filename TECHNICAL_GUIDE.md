# Technical Guide & Application Showcase

This document provides a deep dive into the technical architecture and functionality of the Scientific Calculator web application. It's designed for developers, contributors, or anyone interested in how the application works under the hood.

## Table of Contents
1.  [High-Level Architecture](#high-level-architecture)
2.  [Backend (Express.js)](#backend-expressjs)
    -   [Core Dependencies](#core-dependencies)
    -   [API Endpoints](#api-endpoints)
3.  [Frontend (React)](#frontend-react)
    -   [Project Structure](#project-structure)
    -   [State Management](#state-management)
    -   [Component Breakdown](#component-breakdown)
4.  [Application Features in Action (with Screenshots)](#application-features-in-action-with-screenshots)
    -   [Scientific Calculator](#scientific-calculator)
    -   [Graphing Calculator](#graphing-calculator)
    -   [Programmer's Calculator](#programmers-calculator)
    -   [Unit Converter](#unit-converter)
    -   [Calculus Tools](#calculus-tools)
    -   [History Sidebar](#history-sidebar)

---

## High-Level Architecture

The application is a modern full-stack web app built with a **React frontend** and an **Express.js backend**.

-   **Backend**: A Node.js server using Express handles all the complex mathematical computations, unit conversions, and data generation for graphs. This keeps the client-side light and ensures consistent and accurate results. It's written in TypeScript.
-   **Frontend**: A responsive and interactive user interface built with React, TypeScript, and styled with Tailwind CSS. It communicates with the backend via a set of RESTful API endpoints. Vite is used as the build tool for a fast development experience.

This client-server architecture allows for powerful, server-side calculations while providing a smooth and dynamic user experience in the browser.

---

## Backend (Express.js)

The backend is a single file, `server.ts`, which sets up an Express server to expose several API endpoints for the frontend to consume.

### Core Dependencies
-   `express`: The web server framework.
-   `mathjs`: A powerful math library used for parsing and evaluating mathematical expressions with support for big numbers to maintain precision.
-   `vite`: Used in development mode to serve the frontend application.

### API Endpoints

The server exposes the following JSON-based API endpoints:

#### `POST /api/evaluate`
-   **Purpose**: Evaluates a standard mathematical expression.
-   **Request Body**: `{ "expression": "2+sin(45)", "angleUnit": "deg" }`
-   **Logic**:
    1.  It receives an expression string (e.g., `"2*sin(45)"`).
    2.  The `cleanExpression` utility function converts user-friendly symbols (like `×`, `÷`, `√`) into `mathjs`-compatible syntax (`*`, `/`, `sqrt`).
    3.  If `angleUnit` is `'deg'`, it creates a custom scope using `createTrigScope` that overrides the default trigonometric functions (sin, cos, tan, etc.) with versions that convert degree inputs to radians before calculation.
    4.  `math.evaluate(expression, scope)` is called to compute the result.
    5.  The result is formatted as a string and sent back to the client.

#### `POST /api/graph-data`
-   **Purpose**: Generates data points for plotting function graphs.
-   **Request Body**: `{ "functions": ["sin(x)", "x^2"], "xMin": -10, "xMax": 10 }`
-   **Logic**:
    1.  It takes an array of function strings (e.g., `['sin(x)', 'x^2/2']`), a domain (`xMin`, `xMax`), and the number of points to generate.
    2.  For each function, it uses `math.compile()` for performance.
    3.  It iterates from `xMin` to `xMax`, calculating the `y` value for each function at each `x` step.
    4.  It returns an array of data points, like `[{ "x": -10, "f0": 0.54, "f1": 50 }, ...]`, where `f0` corresponds to the first function, `f1` to the second, and so on.

#### `POST /api/programmer`
-   **Purpose**: Performs bitwise operations and base conversions for the programmer calculator.
-   **Request Body**: `{ "value": "FF", "fromBase": 16, "operation": "AND", "operand2": "A5", "bitLength": 8 }`
-   **Logic**:
    1.  It parses the input values from their specified base (`fromBase`) into `BigInt` to handle large numbers.
    2.  It performs the requested bitwise operation (AND, OR, NOT, LSH, etc.).
    3.  The result is masked based on the selected `bitLength` (e.g., 8, 16, 32, or 64-bit).
    4.  It converts the final result into all four bases (HEX, DEC, OCT, BIN) and also returns an array of bits for the interactive UI.

#### `POST /api/calculus`
-   **Purpose**: Numerically computes derivatives or definite integrals.
-   **Request Body**: `{ "type": "integral", "expression": "x^2", "lowerLimit": 0, "upperLimit": 1 }`
-   **Logic**:
    -   **Derivative**: Uses the central difference formula `(f(x+h) - f(x-h)) / 2h` for a small `h` to approximate the derivative at a point.
    -   **Integral**: Uses **Simpson's 1/3 rule** to numerically approximate the definite integral of the expression between the lower and upper limits.

---

## Frontend (React)

The frontend is a single-page application (SPA) built with React and Vite.

### Project Structure

```
src/
├── components/       # Reusable React components (Keypad, Display, GraphView, etc.)
├── data/             # Static data, like unit conversion factors
├── lib/              # Client-side helper functions (e.g., calcEngine.ts)
├── types/            # TypeScript type definitions
├── App.tsx           # Main application component, manages state and layout
├── main.tsx          # Application entry point
└── index.css         # Global styles and Tailwind CSS imports
```

### State Management

The core of the frontend is the `App.tsx` component. It uses React hooks (`useState`, `useEffect`) to manage the entire application state, including:
-   `mode`: The current calculator mode ('scientific', 'graph', 'programmer', etc.).
-   `expression` & `currentInput`: The strings for the calculator display.
-   `angleUnit`: 'deg' or 'rad'.
-   `history`: An array of past calculations, which is persisted to `localStorage`.
-   `isDarkMode`: The current theme.
-   `calcModalOpen`: The visibility of the calculus tools modal.

### Component Breakdown

-   **`Header.tsx`**: A top bar that contains the mode switcher dropdown and the theme toggle button. It allows the user to navigate between the different calculator views.
-   **`Display.tsx`**: The main screen of the calculator. It shows the previous expression, the current user input, and any errors returned from the API.
-   **`Keypad.tsx`**: The grid of buttons for the scientific calculator. It includes standard numbers, operators, and special function buttons (trigonometry, calculus, memory). It handles user input and calls the appropriate handler functions passed down from `App.tsx`.
-   **`GraphView.tsx`**:
    -   Allows users to input multiple functions.
    -   Uses a custom `useDebounce` hook to avoid sending too many API requests while the user is typing their function or changing the range.
    -   Fetches graph data from the `/api/graph-data` endpoint.
    -   Renders the functions, axes, and grid onto an HTML5 `<canvas>` element.
-   **`ProgrammerView.tsx`**:
    -   Provides an interface for number system conversions and bitwise logic.
    -   When the user enters a number, selects an operation, or clicks a bit, it calls the `/api/programmer` endpoint.
    -   The UI updates reactively to display the results in HEX, DEC, OCT, and BIN formats. The interactive bit grid is a key feature, allowing users to flip individual bits and see the result instantly.
-   **`HistorySidebar.tsx`**: Displays a list of previous calculations from the `history` state. It allows users to clear history or click on a past entry to load it back into the calculator.

---

## Application Features in Action (with Screenshots)

This section showcases the primary features of the application.

### Scientific Calculator

The main view for performing advanced mathematical calculations. It supports arithmetic, percentages, parentheses, powers, roots, and trigonometric functions. The "2nd" key modifies the function of many keys to provide access to inverse functions (e.g., `sin⁻¹`, `x³`).

*[Screenshot: The scientific calculator interface showing a complex expression like "sin(45) + log(100)" and its result on the display.]*

### Graphing Calculator

A powerful tool for visualizing functions. Users can plot up to four functions simultaneously. The view supports panning (by changing xMin/xMax) and zooming. The y-axis scales automatically to fit the plotted functions.

*[Screenshot: The graphing calculator plotting two functions, for example, `sin(x)` (a wave) and `x^2 - 4` (a parabola), with different colors.]*

### Programmer's Calculator

An essential tool for software engineers. It allows for calculations in different number bases (Hexadecimal, Decimal, Octal, Binary) and performs bitwise operations. The most unique feature is the interactive bit display, where clicking a bit flips its value and instantly updates the numbers in all bases.

*[Screenshot: The programmer's calculator in 32-bit mode. The HEX, DEC, OCT, and BIN fields are filled, and the interactive bit grid below shows the binary representation.]*

### Unit Converter

A handy utility for converting between various units of measurement, such as length, mass, temperature, and more. The user selects a category, input and output units, and enters a value to see the conversion.

*[Screenshot: The unit converter view showing a conversion from "100" Kilometers to Miles, with the result displayed below.]*

### Calculus Tools

For more advanced users, the calculator provides numerical tools for calculus. These are accessed via a modal window.
-   **Numerical Derivative**: Calculates the slope of a function `f(x)` at a given point `x`.
-   **Numerical Integral**: Calculates the area under the curve of a function `f(x)` between a lower and upper limit.

*[Screenshot: The calculus modal open, configured to calculate the definite integral of `x^2` from 0 to 2, with the input fields filled out.]*

### History Sidebar

The calculator automatically saves every calculation. The history can be accessed via a sidebar, allowing users to review their work or reuse previous expressions and results.

*[Screenshot: The main calculator view with the history sidebar open on the right, showing a list of past calculations with their expressions and results.]*