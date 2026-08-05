/**
 * Helper utilities for formatting and normalizing calculator mathematical expressions.
 */

export function formatDisplayNumber(numStr: string): string {
  if (!numStr) return '0';
  if (numStr === 'Error' || numStr.includes('NaN') || numStr.includes('Infinity')) {
    return numStr;
  }

  // Handle scientific notation e.g., 1.23e+10
  if (numStr.includes('e') || numStr.includes('E')) {
    return numStr;
  }

  // Split integer and decimal parts
  const parts = numStr.split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1];

  // Format integer part with commas if it's a valid integer
  const isNegative = integerPart.startsWith('-');
  const cleanInt = isNegative ? integerPart.slice(1) : integerPart;

  if (!/^\d+$/.test(cleanInt)) {
    return numStr;
  }

  const formattedInt = cleanInt.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const sign = isNegative ? '-' : '';

  if (decimalPart !== undefined) {
    return `${sign}${formattedInt}.${decimalPart}`;
  }
  return `${sign}${formattedInt}`;
}

/**
 * Pre-processes UI expression symbols to mathjs compatible syntax
 */
export function normalizeExpressionForMathJs(expr: string, angleUnit: 'deg' | 'rad' = 'deg'): string {
  if (!expr) return '';

  let normalized = expr
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/π/g, 'pi')
    .replace(/√\(/g, 'sqrt(')
    .replace(/∛\(/g, 'cbrt(')
    .replace(/mod/g, '%')
    .replace(/ln\(/g, 'log(') // mathjs log() is natural log
    .replace(/log₁₀\(/g, 'log10(')
    .replace(/log₂\(/g, 'log2(')
    .replace(/abs\(/g, 'abs(')
    .replace(/\|([^|]+)\|/g, 'abs($1)');

  // Convert trig functions to degree equivalents if angleUnit === 'deg'
  if (angleUnit === 'deg') {
    // Replace sin(x) with sin(x deg) or sin(x * deg)
    // Note: mathjs handles sin(45 deg) or sin(45 * deg)
    // In mathjs, sin(45 deg) automatically evaluates correctly in degrees!
    // We handle degree evaluation directly in server.ts scope or expression transformations
  }

  return normalized;
}

export function sanitizeInputExpression(current: string, keyLabel: string): string {
  // Prevent double operators
  const lastChar = current.slice(-1);
  const isOp = (c: string) => ['+', '-', '*', '/', '×', '÷', '−'].includes(c);

  if (isOp(lastChar) && isOp(keyLabel)) {
    return current.slice(0, -1) + keyLabel;
  }

  return current + keyLabel;
}
