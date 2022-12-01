"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unit = exports.UNITS = void 0;
exports.UNITS = ['century', 'decade', 'year', 'month', 'day', 'hour', 'minute', 'second'];
const LENGTH = 8;
class Unit {
    constructor(_order = 4) {
        this._order = _order;
    }
    static fromOrder(order) {
        if (order >= LENGTH) {
            throw new Error(`expect order < ${LENGTH}, got ${order}`);
        }
        return new Unit(order);
    }
    static fromUnit(unit) {
        if (typeof unit === 'string') {
            return new Unit(exports.UNITS.indexOf(unit));
        }
        else {
            return unit.clone();
        }
    }
    get upper() {
        return this._order > 0 ? new Unit(this._order - 1) : undefined;
    }
    get lower() {
        return this._order < LENGTH - 1 ? new Unit(this._order + 1) : undefined;
    }
    get order() { return this._order; }
    isSame(unit) {
        if (typeof unit === 'string') {
            return this.toString() === unit;
        }
        else {
            return this._order === unit._order;
        }
    }
    isUpper(unit) {
        if (typeof unit === 'string') {
            return this._order < exports.UNITS.indexOf(unit);
        }
        else {
            return this._order < unit._order;
        }
    }
    isLower(unit) {
        if (typeof unit === 'string') {
            return this._order > exports.UNITS.indexOf(unit);
        }
        else {
            return this._order > unit._order;
        }
    }
    toString() { return exports.UNITS[this._order]; }
    clone() { return new Unit(this._order); }
}
exports.Unit = Unit;
