interface ToNumberOptions {
  default?: number;
  min?: number;
  max?: number;
}

export function trim(value: string): string {
  return value.trim();
}

export function toDate(value: string): Date {
  return new Date(value);
}

export function toNumber(value: string, opts: ToNumberOptions = {}): number {
  let newValue: number = Number(value);

  if (Number.isNaN(newValue)) {
    newValue = opts.default !== undefined ? opts.default : NaN;
  }

  if (opts.min !== undefined && newValue < opts.min) {
    newValue = opts.min;
  }

  if (opts.max !== undefined && newValue > opts.max) {
    newValue = opts.max;
  }

  return newValue;
}
