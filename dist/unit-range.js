"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitIDRange = void 0;
const exception_1 = require("./exception");
const memoize_1 = require("./memoize");
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
        while (this._unit.upper !== undefined) {
            const upper = this._unit.upper.toString();
            let diff;
            switch (upper) {
                case 'century':
                    diff = Math.floor((this._end._date.year() - this._start._date.year()) / 100);
                    break;
                case 'decade':
                    diff = Math.floor((this._end._date.year() - this._start._date.year()) / 10);
                    break;
                default:
                    diff = this._end._date.diff(this._start._date, upper);
                    break;
            }
            if (diff === 0) {
                break;
            }
            this._unit = this._unit.upper;
        }
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
    static fromJSON({ unit, start, end }) {
        return UnitIDRange.fromDayjs(start, end, unit_1.Unit.fromOrder(unit));
    }
    toJSON() {
        return {
            unit: this._unit._order,
            start: this._start._date.toDate(),
            end: this._end._date.toDate()
        };
    }
    toDate() {
        return [this._start.toDate(), this._end.toDate()];
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
    get unit() { return this._unit; }
    get ids() {
        return Array(this._end.diff(this._start) + 1)
            .fill(0)
            .map((_, i) => this._start.add(i));
    }
    get length() {
        return this._end.diff(this._start) + 1;
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
}
__decorate([
    memoize_1.memoize
], UnitIDRange.prototype, "ids", null);
__decorate([
    memoize_1.memoize
], UnitIDRange.prototype, "length", null);
exports.UnitIDRange = UnitIDRange;
