"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitIDRange = void 0;
const exception_1 = require("./exception");
const unit_1 = require("./unit");
const unit_id_1 = require("./unit-id");
class UnitIDRange {
    constructor(_start, _end) {
        this._start = _start;
        this._end = _end;
        if (!_start.unit.isSame(_end.unit)) {
            throw new exception_1.UnitIDException('UnitIDRange', 'unit not match');
        }
        this._unit = _start.unit;
        this._start = this._start.start;
        this._end = this._end.end;
    }
    static fromUnitID(start, end) {
        if (start.isBefore(end)) {
            return new UnitIDRange(start, end);
        }
        else {
            return new UnitIDRange(end, start);
        }
    }
    static fromDayjs(start, end, unit) {
        return new UnitIDRange(unit_id_1.UnitID.fromDayjs(start, unit), unit_id_1.UnitID.fromDayjs(end, unit));
    }
    static deserialize(str) {
        const [unit, start, end] = str.split('_');
        return UnitIDRange.fromDayjs(start, end, unit_1.Unit.fromOrder(parseInt(unit)));
    }
    serialize() {
        return `${this._unit.order}_${this._start._date.format()}_${this._end._date.format()}`;
    }
    get start() { return this._start; }
    get end() { return this._end; }
    get ids() {
        return Array(this._end.diff(this._start) + 1).fill(0).map((_, i) => this._start.add(i));
    }
    length(unit) {
        if (unit) {
            const start = this._start.as(unit);
            const end = this._end.as(unit);
            return end.diff(start);
        }
        else {
            return this._end.diff(this._start) + 1;
        }
    }
    add(count) {
        return new UnitIDRange(this._start.add(count), this._end.add(count));
    }
    sub(count) {
        return new UnitIDRange(this._start.sub(count), this._end.sub(count));
    }
    as(unit) {
        return new UnitIDRange(this._start.as(unit), this._end.as(unit));
    }
    isIntersect(range) {
        return this._start.isBefore(range._end) && this._end.isAfter(range._start) ||
            range._start.isBefore(this._end) && range._end.isAfter(this._start);
    }
    toJSON() {
        return {
            unit: this._unit._order,
            start: this._start._date.format(),
            end: this._end._date.format()
        };
    }
}
exports.UnitIDRange = UnitIDRange;
