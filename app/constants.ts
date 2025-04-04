export class ComplexCoordinate {
    real: number
    imag: number
  constructor(real: number, imag: number) {
    this.real = real;
    this.imag = imag;
  }

  add(other: ComplexCoordinate): ComplexCoordinate {
    return new ComplexCoordinate(this.real + other.real, this.imag + other.imag);
  }

  subtract(other: ComplexCoordinate): ComplexCoordinate {
    return new ComplexCoordinate(this.real - other.real, this.imag - other.imag);
  }

    /** (a + bi) (x + yi) = ax + ayi + bix - by = ax - by + (ay + bx)i
     *
     * @param other ComplexCoordinate
     */
  multiply(other: ComplexCoordinate): ComplexCoordinate {
    const real = this.real * other.real - this.imag * other.imag;
    const imag = this.real * other.imag + this.imag * other.real;
    return new ComplexCoordinate(real, imag);
  }

  square(): ComplexCoordinate {
      return this.multiply(this);
  }

  magnitude(): number {
    return Math.sqrt(this.real**2 + this.imag**2)
  }

  toString(): string {
      return `${this.real} + ${this.imag}i`
  }
}

export class LRUCache<CacheValue> {
    map: Map<string, CacheValue>
    capacity: number;
    keys: Array<string>;
    cacheMisses: number;
    cacheHits: number;

    constructor(capacity: number) {
        this.capacity = capacity;
        this.map = new Map();
        this.keys = [];
        this.cacheMisses = 0;
        this.cacheHits = 0;
    }
    setValue(input: string, value: CacheValue) {
        if (this.map.has(input)) {
            this.keys = this.keys.filter(k => k !== input);
        }

        this.keys.push(input);
        this.map.set(input, value);
        this.map.set(input, value);
        if (this.map.size > this.capacity) {
            const oldestKey = this.keys.shift();
            if (oldestKey != null) {
                this.map.delete(oldestKey);
            }
        }
    }
    getValue(input: string) {
        if (!this.map.has(input)) {
            this.cacheMisses += 1
            return null;
        }
        this.cacheHits += 1

        const value = this.map.get(input);
        this.keys = this.keys.filter(k => k !== input);
        this.keys.push(input);
        return value;
    }
}

export type GridValues = Map<number, Map<number, ComplexCoordinate>> // map of rows; Map.get(yCoord) = row

export const LOWER_LIMIT = -2;
export const UPPER_LIMIT = 2;
export const STEP_SIZE = .01;

export const roundNumber = (n: number): number => Number(n.toFixed(2));

export const range = (start: number, stop: number, step: number = 1) =>
  Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);