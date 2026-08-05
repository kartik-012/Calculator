export interface UnitDefinition {
  id: string;
  name: string;
  symbol: string;
  ratio: number; // Ratio relative to base unit
  offset?: number; // For temperature
}

export interface CategoryDefinition {
  id: string;
  name: string;
  baseUnit: string;
  units: UnitDefinition[];
}

export const CONVERSION_CATEGORIES: CategoryDefinition[] = [
  {
    id: 'length',
    name: 'Length',
    baseUnit: 'm',
    units: [
      { id: 'mm', name: 'Millimeters', symbol: 'mm', ratio: 0.001 },
      { id: 'cm', name: 'Centimeters', symbol: 'cm', ratio: 0.01 },
      { id: 'm', name: 'Meters', symbol: 'm', ratio: 1 },
      { id: 'km', name: 'Kilometers', symbol: 'km', ratio: 1000 },
      { id: 'in', name: 'Inches', symbol: 'in', ratio: 0.0254 },
      { id: 'ft', name: 'Feet', symbol: 'ft', ratio: 0.3048 },
      { id: 'yd', name: 'Yards', symbol: 'yd', ratio: 0.9144 },
      { id: 'mi', name: 'Miles', symbol: 'mi', ratio: 1609.344 },
      { id: 'nmi', name: 'Nautical Miles', symbol: 'nmi', ratio: 1852 },
    ],
  },
  {
    id: 'mass',
    name: 'Mass & Weight',
    baseUnit: 'kg',
    units: [
      { id: 'mg', name: 'Milligrams', symbol: 'mg', ratio: 0.000001 },
      { id: 'g', name: 'Grams', symbol: 'g', ratio: 0.001 },
      { id: 'kg', name: 'Kilograms', symbol: 'kg', ratio: 1 },
      { id: 'ton', name: 'Metric Tons', symbol: 't', ratio: 1000 },
      { id: 'oz', name: 'Ounces', symbol: 'oz', ratio: 0.028349523125 },
      { id: 'lb', name: 'Pounds', symbol: 'lb', ratio: 0.45359237 },
      { id: 'st', name: 'Stone', symbol: 'st', ratio: 6.35029318 },
    ],
  },
  {
    id: 'temperature',
    name: 'Temperature',
    baseUnit: 'C',
    units: [
      { id: 'C', name: 'Celsius', symbol: '°C', ratio: 1, offset: 0 },
      { id: 'F', name: 'Fahrenheit', symbol: '°F', ratio: 1, offset: 0 }, // Handled specially
      { id: 'K', name: 'Kelvin', symbol: 'K', ratio: 1, offset: 0 },      // Handled specially
    ],
  },
  {
    id: 'area',
    name: 'Area',
    baseUnit: 'sqm',
    units: [
      { id: 'sqcm', name: 'Square Centimeters', symbol: 'cm²', ratio: 0.0001 },
      { id: 'sqm', name: 'Square Meters', symbol: 'm²', ratio: 1 },
      { id: 'sqkm', name: 'Square Kilometers', symbol: 'km²', ratio: 1000000 },
      { id: 'sqin', name: 'Square Inches', symbol: 'in²', ratio: 0.00064516 },
      { id: 'sqft', name: 'Square Feet', symbol: 'ft²', ratio: 0.09290304 },
      { id: 'acre', name: 'Acres', symbol: 'ac', ratio: 4046.8564224 },
      { id: 'ha', name: 'Hectares', symbol: 'ha', ratio: 10000 },
    ],
  },
  {
    id: 'volume',
    name: 'Volume',
    baseUnit: 'L',
    units: [
      { id: 'ml', name: 'Milliliters', symbol: 'mL', ratio: 0.001 },
      { id: 'L', name: 'Liters', symbol: 'L', ratio: 1 },
      { id: 'cum', name: 'Cubic Meters', symbol: 'm³', ratio: 1000 },
      { id: 'tsp', name: 'Teaspoons (US)', symbol: 'tsp', ratio: 0.00492892 },
      { id: 'tbsp', name: 'Tablespoons (US)', symbol: 'tbsp', ratio: 0.0147868 },
      { id: 'floz', name: 'Fluid Ounces (US)', symbol: 'fl oz', ratio: 0.0295735 },
      { id: 'cup', name: 'Cups (US)', symbol: 'cup', ratio: 0.24 },
      { id: 'pt', name: 'Pints (US)', symbol: 'pt', ratio: 0.473176 },
      { id: 'gal', name: 'Gallons (US)', symbol: 'gal', ratio: 3.78541 },
    ],
  },
  {
    id: 'time',
    name: 'Time',
    baseUnit: 's',
    units: [
      { id: 'ms', name: 'Milliseconds', symbol: 'ms', ratio: 0.001 },
      { id: 's', name: 'Seconds', symbol: 's', ratio: 1 },
      { id: 'min', name: 'Minutes', symbol: 'min', ratio: 60 },
      { id: 'hr', name: 'Hours', symbol: 'hr', ratio: 3600 },
      { id: 'day', name: 'Days', symbol: 'd', ratio: 86400 },
      { id: 'wk', name: 'Weeks', symbol: 'wk', ratio: 604800 },
      { id: 'yr', name: 'Years', symbol: 'yr', ratio: 31536000 },
    ],
  },
  {
    id: 'speed',
    name: 'Speed',
    baseUnit: 'mps',
    units: [
      { id: 'mps', name: 'Meters / second', symbol: 'm/s', ratio: 1 },
      { id: 'kmh', name: 'Kilometers / hour', symbol: 'km/h', ratio: 0.277777778 },
      { id: 'mph', name: 'Miles / hour', symbol: 'mph', ratio: 0.44704 },
      { id: 'knot', name: 'Knots', symbol: 'kn', ratio: 0.514444444 },
    ],
  },
  {
    id: 'data',
    name: 'Digital Data',
    baseUnit: 'B',
    units: [
      { id: 'b', name: 'Bits', symbol: 'b', ratio: 0.125 },
      { id: 'B', name: 'Bytes', symbol: 'B', ratio: 1 },
      { id: 'KB', name: 'Kilobytes', symbol: 'KB', ratio: 1024 },
      { id: 'MB', name: 'Megabytes', symbol: 'MB', ratio: 1048576 },
      { id: 'GB', name: 'Gigabytes', symbol: 'GB', ratio: 1073741824 },
      { id: 'TB', name: 'Terabytes', symbol: 'TB', ratio: 1099511627776 },
    ],
  },
  {
    id: 'pressure',
    name: 'Pressure',
    baseUnit: 'Pa',
    units: [
      { id: 'Pa', name: 'Pascal', symbol: 'Pa', ratio: 1 },
      { id: 'kPa', name: 'Kilopascal', symbol: 'kPa', ratio: 1000 },
      { id: 'bar', name: 'Bar', symbol: 'bar', ratio: 100000 },
      { id: 'psi', name: 'PSI (Pounds/sq in)', symbol: 'psi', ratio: 6894.75729 },
      { id: 'atm', name: 'Atmosphere', symbol: 'atm', ratio: 101325 },
    ],
  },
  {
    id: 'energy',
    name: 'Energy',
    baseUnit: 'J',
    units: [
      { id: 'J', name: 'Joules', symbol: 'J', ratio: 1 },
      { id: 'kJ', name: 'Kilojoules', symbol: 'kJ', ratio: 1000 },
      { id: 'cal', name: 'Calories', symbol: 'cal', ratio: 4.184 },
      { id: 'kcal', name: 'Kilocalories', symbol: 'kcal', ratio: 4184 },
      { id: 'Wh', name: 'Watt-hours', symbol: 'Wh', ratio: 3600 },
      { id: 'kWh', name: 'Kilowatt-hours', symbol: 'kWh', ratio: 3600000 },
      { id: 'eV', name: 'Electronvolts', symbol: 'eV', ratio: 1.602176634e-19 },
    ],
  },
  {
    id: 'power',
    name: 'Power',
    baseUnit: 'W',
    units: [
      { id: 'W', name: 'Watts', symbol: 'W', ratio: 1 },
      { id: 'kW', name: 'Kilowatts', symbol: 'kW', ratio: 1000 },
      { id: 'MW', name: 'Megawatts', symbol: 'MW', ratio: 1000000 },
      { id: 'hp', name: 'Horsepower (Mechanical)', symbol: 'hp', ratio: 745.699872 },
    ],
  },
];

export function performConversion(
  categoryId: string,
  fromUnitId: string,
  toUnitId: string,
  val: number
): { result: number; formula: string } {
  if (isNaN(val)) return { result: 0, formula: '' };

  if (categoryId === 'temperature') {
    let celsiusVal = val;
    if (fromUnitId === 'F') celsiusVal = (val - 32) * (5 / 9);
    else if (fromUnitId === 'K') celsiusVal = val - 273.15;

    let finalVal = celsiusVal;
    if (toUnitId === 'F') finalVal = celsiusVal * (9 / 5) + 32;
    else if (toUnitId === 'K') finalVal = celsiusVal + 273.15;

    let formulaText = `${val} °${fromUnitId} → ${finalVal.toFixed(4)} °${toUnitId}`;
    return { result: finalVal, formula: formulaText };
  }

  const cat = CONVERSION_CATEGORIES.find((c) => c.id === categoryId);
  if (!cat) return { result: val, formula: '' };

  const fromUnit = cat.units.find((u) => u.id === fromUnitId);
  const toUnit = cat.units.find((u) => u.id === toUnitId);

  if (!fromUnit || !toUnit) return { result: val, formula: '' };

  const baseVal = val * fromUnit.ratio;
  const result = baseVal / toUnit.ratio;

  const formulaText = `1 ${fromUnit.symbol} = ${(fromUnit.ratio / toUnit.ratio).toPrecision(6)} ${toUnit.symbol}`;
  return { result, formula: formulaText };
}
