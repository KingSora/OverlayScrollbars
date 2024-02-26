const precisionErrorTolerance = 0.000001;

class Vector {
  offset: number;
  length: number;
  elements: number[];

  constructor(elements: number[] = [], offset = 0, length = 0) {
    this.offset = offset;
    this.length = length;
    this.elements = elements;
  }

  getAtIndex(index: number) {
    return this.elements[index + this.offset];
  }

  setAtIndex(index: number, value: number) {
    this.elements[index + this.offset] = value;
  }

  multiply(a: Vector) {
    let result = 0;
    for (let i = 0; i < this.length; i += 1) {
      result += this.getAtIndex(i) * a.getAtIndex(i);
    }
    return result;
  }

  norm() {
    return Math.sqrt(this.multiply(this));
  }
}

class Matrix {
  columns: number;
  elements: number[];

  constructor(rows: number, cols: number) {
    this.columns = cols;
    this.elements = [];
  }

  get(row: number, col: number) {
    return this.elements[row * this.columns + col];
  }
  set(row: number, col: number, value: number) {
    this.elements[row * this.columns + col] = value;
  }

  getRow(row: number) {
    return new Vector(this.elements, row * this.columns, this.columns);
  }
}

export const solveLsq = (x: number[], y: number[], w: number[], degree: number) => {
  if (degree > x.length) {
    // Not enough data to fit a curve.
    return null;
  }

  const polynomialFitCoefficients: number[] = [];
  let polynomialFitConfidence = 0;

  // Shorthands for the purpose of notation equivalence to original C++ code.
  const m = x.length;
  const n = degree + 1;

  // Expand the X vector to a matrix A, pre-multiplied by the weights.
  const a = new Matrix(n, m);
  for (let h = 0; h < m; h += 1) {
    a.set(0, h, w[h]);
    for (let i = 1; i < n; i += 1) {
      a.set(i, h, a.get(i - 1, h) * x[h]);
    }
  }

  // Apply the Gram-Schmidt process to A to obtain its QR decomposition.

  // Orthonormal basis, column-major ordVectorer.
  const q = new Matrix(n, m);
  // Upper triangular matrix, row-major order.
  const r = new Matrix(n, n);
  for (let j = 0; j < n; j += 1) {
    for (let h = 0; h < m; h += 1) {
      q.set(j, h, a.get(j, h));
    }
    for (let i = 0; i < j; i += 1) {
      const dot = q.getRow(j).multiply(q.getRow(i));
      for (let h = 0; h < m; h += 1) {
        q.set(j, h, q.get(j, h) - dot * q.get(i, h));
      }
    }

    const norm = q.getRow(j).norm();
    if (norm < precisionErrorTolerance) {
      // Vectors are linearly dependent or zero so no solution.
      return null;
    }

    const inverseNorm = 1.0 / norm;
    for (let h = 0; h < m; h += 1) {
      q.set(j, h, q.get(j, h) * inverseNorm);
    }
    for (let i = 0; i < n; i += 1) {
      r.set(j, i, i < j ? 0.0 : q.getRow(j).multiply(a.getRow(i)));
    }
  }

  // Solve R B = Qt W Y to find B. This is easy because R is upper triangular.
  // We just work from bottom-right to top-left calculating B's coefficients.
  const wy = new Vector([], 0, m);
  for (let h = 0; h < m; h += 1) {
    wy.setAtIndex(h, y[h] * w[h]);
  }
  for (let i = n - 1; i >= 0; i -= 1) {
    polynomialFitCoefficients[i] = q.getRow(i).multiply(wy);
    for (let j = n - 1; j > i; j -= 1) {
      polynomialFitCoefficients[i] -= r.get(i, j) * polynomialFitCoefficients[j];
    }
    polynomialFitCoefficients[i] /= r.get(i, i);
  }

  // Calculate the coefficient of determination (confidence) as:
  //   1 - (sumSquaredError / sumSquaredTotal)
  // ...where sumSquaredError is the residual sum of squares (variance of the
  // error), and sumSquaredTotal is the total sum of squares (variance of the
  // data) where each has been weighted.
  let yMean = 0.0;
  for (let h = 0; h < m; h += 1) {
    yMean += y[h];
  }
  yMean /= m;

  let sumSquaredError = 0.0;
  let sumSquaredTotal = 0.0;
  for (let h = 0; h < m; h += 1) {
    let term = 1.0;
    let err = y[h] - polynomialFitCoefficients[0];
    for (let i = 1; i < n; i += 1) {
      term *= x[h];
      err -= term * polynomialFitCoefficients[i];
    }
    sumSquaredError += w[h] * w[h] * err * err;
    const v = y[h] - yMean;
    sumSquaredTotal += w[h] * w[h] * v * v;
  }

  polynomialFitConfidence =
    sumSquaredTotal <= precisionErrorTolerance ? 1.0 : 1.0 - sumSquaredError / sumSquaredTotal;

  return {
    coeff: polynomialFitCoefficients,
    confidence: polynomialFitConfidence,
  };
};
