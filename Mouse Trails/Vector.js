
export class Vector {
  /*** static */
  static add(v1, v2) {
    let v3 = new Vector();

    v3.setX(v1.getX() + v2.getX());
    v3.setY(v1.getY() + v2.getY());

    return v3;
  }

  static subtract(v1, v2) {
    let v3 = new Vector();

    v3.setX(v1.getX() - v2.getX());
    v3.setY(v1.getY() - v2.getY());

    return v3;
  }

  static multiply(v1, v2) {
    let v3 = new Vector();

    v3.setX(v1.getX() * v2.getX());
    v3.setY(v1.getY() * v2.getY());

    return v3;
  }

  static divide(v1, v2) {
    let v3 = new Vector();

    v3.setX(v1.getX() / v2.getX());
    v3.setY(v1.getY() / v2.getY());

    return v3;
  }

  static mix(a, b, t) {
    return a * (1 - t) + b * t;
  }

  ////////////////////////////////////////
  constructor(x, y) {
    this._x = x;
    this._y = y;
    // this._length = this.getLength();
  }

  setX(x) {
    this._x = x;
  }
  setY(y) {
    this._y = y;
  }

  getX() {
    return this._x;
  }
  getY() {
    return this._y;
  }

  setAngle(angle) {
    let length = this.getLength();
    this._x = Math.cos(angle) * length;
    this._y = Math.sin(angle) * length;
  }
  getAngle() {
    return Math.atan2(this._y, this._x);
  }

  setLength(length) {
    let angle = this.getAngle();

    this._x = Math.cos(angle) * length;
    this._y = Math.sin(angle) * length;
  }

  getLength() {
    return Math.sqrt(this._x * this._x + this._y * this._y);
  }

  add(v2) {
    return new Vector(this._x + v2.x, this._y + v2.y);
  }

  addTo(v2) {
    this._x += v2.getX();
    this._y += v2.getY();
  }

  subtractFrom(v2) {
    this._x -= v2.getX();
    this._y -= v2.getY();
  }

  multiplyBy(f) {
    this._x *= f;
    this._y *= f;
  }

  divideBy(f) {
    this._x /= f;
    this._y /= f;
  }

  lerp(p2, t) {
    this._x = Vector.mix(this._x, p2._x, t);
    this._y = Vector.mix(this._y, p2._y, t);
  }
}