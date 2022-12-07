"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unit = exports.UNITS = void 0;
const exception_1 = require("./exception");
exports.UNITS = ['century', 'decade', 'year', 'month', 'date', 'hour', 'minute', 'second'];
const LENGTH = 8;
class Unit {
    constructor(_order = 4) {
        this._order = _order;
        if (_order < 0 || _order >= LENGTH) {
            throw new exception_1.UnitIDException('Unit', `expect 0 < order < ${LENGTH}, got ${_order}`);
        }
    }
    static fromOrder(order) {
        return new Unit(order);
    }
    static fromUnit(unit) {
        if (typeof unit === 'string') {
            if (!exports.UNITS.includes(unit)) {
                throw new exception_1.UnitIDException('Unit fromUnit', `expect unit in ${exports.UNITS}, got ${unit}`);
            }
            return new Unit(exports.UNITS.indexOf(unit));
        }
        else {
            return unit;
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
}
exports.Unit = Unit;
