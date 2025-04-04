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

export type GridValues = Map<number, Map<number, ComplexCoordinate>> // map of rows; Map.get(yCoord) = row

export const LOWER_LIMIT = -2;
export const UPPER_LIMIT = 2;
export const STEP_SIZE = .1;

export const roundNumber = (n: number): number => Number(n.toFixed(10));

export const range = (start: number, stop: number, step: number = 1) =>
  Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);