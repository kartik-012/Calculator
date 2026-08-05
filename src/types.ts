export type CalcMode = 'scientific' | 'standard' | 'graph' | 'programmer' | 'converter';

export type AngleUnit = 'deg' | 'rad';

export interface CalculationHistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
  mode: CalcMode;
  angleUnit?: AngleUnit;
  isArchived?: boolean;
}

export interface EvalRequest {
  expression: string;
  angleUnit?: AngleUnit; // 'deg' | 'rad'
  precision?: number;
}

export interface EvalResponse {
  success: boolean;
  result?: string;
  formattedResult?: string;
  error?: string;
}

export interface UnitConversionCategory {
  id: string;
  name: string;
  iconName: string;
  units: {
    id: string;
    name: string;
    symbol: string;
    toBase: (val: number) => number;
    fromBase: (val: number) => number;
  }[];
}

export interface ConvertRequest {
  category: string;
  fromUnit: string;
  toUnit: string;
  value: number;
}

export interface ConvertResponse {
  success: boolean;
  result?: number;
  formattedResult?: string;
  formula?: string;
  error?: string;
}

export interface ProgrammerRequest {
  value: string;
  fromBase: number; // 16, 10, 8, 2
  operation?: 'AND' | 'OR' | 'XOR' | 'NOT' | 'LSH' | 'RSH' | 'NAND' | 'NOR';
  operand2?: string;
  bitLength?: 8 | 16 | 32 | 64;
}

export interface ProgrammerResponse {
  success: boolean;
  hex?: string;
  dec?: string;
  oct?: string;
  bin?: string;
  bits?: number[];
  error?: string;
}

export interface GraphRequest {
  functions: string[]; // e.g. ["sin(x)", "x^2 - 4"]
  xMin: number;
  xMax: number;
  points?: number;
  angleUnit?: AngleUnit;
}

export interface GraphPoint {
  x: number;
  [key: string]: number | null; // y values for functions f0, f1, etc.
}

export interface GraphResponse {
  success: boolean;
  data?: GraphPoint[];
  error?: string;
}

export interface CalculusRequest {
  type: 'derivative' | 'integral';
  expression: string; // f(x)
  xValue?: number; // for derivative
  lowerLimit?: number; // for integral
  upperLimit?: number; // for integral
  angleUnit?: AngleUnit;
}

export interface CalculusResponse {
  success: boolean;
  result?: string;
  formattedResult?: string;
  steps?: string;
  error?: string;
}
