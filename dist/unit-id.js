"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitID = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const object_hash_1 = __importDefault(require("object-hash"));
const exception_1 = require("./exception");
const memoize_1 = require("./memoize");
const unit_1 = require("./unit");
const unit_range_1 = require("./unit-range");
class UnitID {
    constructor(_date, _unit) {
        this._date = _date;
        this._unit = _unit;
        if (!_date.isValid()) {
            throw new exception_1.UnitIDException('UnitID', 'invalid date');
        }
        const uType = this._unit.toString();
        const century = this._date.year() / 100;
        const decade = this._date.year() / 10;
        switch (uType) {
            case 'century':
                this._uid = (0, object_hash_1.default)([century]);
                break;
            case 'decade':
                this._uid = (0, object_hash_1.default)([century, decade]);
                break;
            default:
                const rest = unit_1.UNITS.slice(2, this._unit._order + 1).map(unit => this._date.get(unit));
                this._uid = (0, object_hash_1.default)([century, decade, ...rest]);
                break;
        }
    }
    static fromDayjs(dateConfig, unit) {
        return new UnitID((0, dayjs_1.default)(dateConfig), unit_1.Unit.fromUnit(unit));
    }
    static deserialize(str) {
        const [unit, config] = str.split('_');
        const unitOrder = parseInt(unit);
        if (config === undefined || unitOrder === NaN) {
            throw new exception_1.UnitIDException('UnitID deserialize', 'invalid format');
        }
        return new UnitID((0, dayjs_1.default)(config), unit_1.Unit.fromOrder(parseInt(unit)));
    }
    serialize() {
        return `${this._unit.order}_${this._date.format()}`;
    }
    as(unit) { return new UnitID(this._date, unit_1.Unit.fromUnit(unit)); }
    add(value) {
        const uType = this._unit.toString();
        switch (uType) {
            case 'century':
                return new UnitID(this._date.add(value * 100, 'year'), this._unit);
            case 'decade':
                return new UnitID(this._date.add(value * 10, 'year'), this._unit);
            case 'date':
                return new UnitID(this._date.add(value, 'day'), this._unit);
            default:
                return new UnitID(this._date.add(value, uType), this._unit);
        }
    }
    sub(value) { return this.add(-value); }
    get date() { return this._date; }
    get unit() { return this._unit; }
    get next() { return this.add(1); }
    get prev() { return this.sub(1); }
    diff(date, milliSecond = false) {
        if (!this._unit.isSame(date._unit)) {
            throw new exception_1.UnitIDException('UnitID diff', 'unit not match');
        }
        if (milliSecond) {
            return this._date.diff(date._date, 'millisecond');
        }
        const uType = this._unit.toString();
        const start = date._date;
        const end = this._date;
        switch (uType) {
            case 'century':
                return Math.floor(end.diff(start, 'year') / 100);
            case 'decade':
                return Math.floor(end.diff(start, 'year') / 10);
            case 'date':
                return end.diff(start, 'day');
            default:
                return end.diff(start, uType);
        }
    }
    get start() {
        const uType = this._unit.toString();
        switch (uType) {
            case 'century':
                const century = Math.floor(this._date.year() / 100) * 100;
                return new UnitID(this._date.startOf('year').year(century), this._unit);
            case 'decade':
                const decade = Math.floor(this._date.year() / 10) * 10;
                return new UnitID(this._date.startOf('year').year(decade), this._unit);
            default:
                return new UnitID(this._date.startOf(uType), this._unit);
        }
    }
    get isStart() {
        const uType = this._unit.toString();
        if (uType === 'century') {
            return this._date.year() % 100 === 0;
        }
        else if (uType === 'decade') {
            return this._date.year() % 10 === 0;
        }
        else {
            return this._date.startOf(uType).isSame(this._date);
        }
    }
    get end() {
        const uType = this._unit.toString();
        switch (uType) {
            case 'century':
                const century = Math.floor(this._date.year() / 100) * 100 + 99;
                return new UnitID(this._date.endOf('year').year(century), this._unit);
            case 'decade':
                const decade = Math.floor(this._date.year() / 10) * 10 + 9;
                return new UnitID(this._date.endOf('year').year(decade), this._unit);
            default:
                return new UnitID(this._date.endOf(uType), this._unit);
        }
    }
    get isEnd() {
        const uType = this._unit.toString();
        if (uType === 'century') {
            return this._date.year() % 100 === 99;
        }
        else if (uType === 'decade') {
            return this._date.year() % 10 === 9;
        }
        else {
            return this._date.endOf(uType).isSame(this._date);
        }
    }
    get uid() { return this._uid; }
    get parent() {
        const upperUnit = this._unit.upper;
        if (!upperUnit) {
            throw new exception_1.UnitIDException('UnitID parent', 'century has no parent');
        }
        return this.as(upperUnit);
    }
    get childrenRange() {
        const lowerUnit = this._unit.lower;
        if (!lowerUnit) {
            throw new exception_1.UnitIDException('UnitID childrenRange', 'second has no children');
        }
        const start = this.start.as(lowerUnit);
        const end = this.end.as(lowerUnit);
        return new unit_range_1.UnitIDRange(start, end);
    }
    get children() {
        return this.childrenRange.ids;
    }
    toString() {
        const startIdx = this._unit.isLower('decade') ? 2 : 0; // 单位在年以下，只显示年份，不显示世纪
        return unit_1.UNITS.slice(startIdx, this._unit.order + 1).map(unit => this.as(unit).toUnitString()).join('');
    }
    toUnitString() {
        const uType = this._unit.toString();
        switch (uType) {
            case 'century':
                return `${Math.floor(this._date.year() / 100) + 1}世纪`;
            case 'decade':
                const decade = this._date.year() % 100 - this._date.year() % 10;
                if (decade === 0) {
                    return '世纪初';
                }
                else {
                    return `${decade}年代`;
                }
            case 'year':
                return `${this._date.year()}年`;
            case 'month':
                return `${this._date.month() + 1}月`;
            case 'date':
                return `${this._date.date()}日`;
            case 'hour':
                return `${this._date.hour()}时`;
            case 'minute':
                return `${this._date.minute()}分`;
            case 'second':
                return `${this._date.second()}秒`;
        }
    }
    toBriefString() {
        const uType = this._unit.toString();
        switch (uType) {
            case 'century':
            case 'year':
                return this.toUnitString();
            case 'decade':
                return `${this.children[0]}代`;
            default:
                return `${this.parent.toUnitString()}${this.toUnitString()}`;
        }
    }
    isBefore(date) {
        if (!this._unit.isSame(date._unit)) {
            return false;
        }
        return this._date.isBefore(date._date);
    }
    isAfter(date) {
        if (!this._unit.isSame(date._unit)) {
            return false;
        }
        return this._date.isAfter(date._date);
    }
    isSame({ _date, _unit }) {
        if (!this._unit.isSame(_unit)) {
            return false;
        }
        const uType = this._unit.toString();
        switch (uType) {
            case 'century':
            case 'decade':
                return this._date.isSame(_date, 'year');
            default:
                return this._date.isSame(_date, uType);
        }
    }
    isBetween({ _date: startDate, _unit: startUnit }, { _date: endDate, _unit: endUnit }, d) {
        if (!this._unit.isSame(startUnit) || !this._unit.isSame(endUnit)) {
            return false;
        }
        if (endDate.isBefore(startDate)) {
            return false;
        }
        const uType = this._unit.toString();
        switch (uType) {
            case 'century':
            case 'decade':
                return this._date.isBetween(startDate, endDate, 'year', d);
            default:
                return this._date.isBetween(startDate, endDate, uType, d);
        }
    }
    isValid() {
        return this._date.isValid();
    }
}
__decorate([
    memoize_1.memoize
], UnitID.prototype, "parent", null);
__decorate([
    memoize_1.memoize
], UnitID.prototype, "children", null);
exports.UnitID = UnitID;
