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
const memoize_1 = require("./memoize");
const unit_1 = require("./unit");
class UnitID {
    constructor(_date, _unit) {
        this._date = _date;
        this._unit = _unit;
        if (_date === undefined || !_date.isValid()) {
            throw new Error('UnitID fromDayjs: invalid date');
        }
        const uType = this._unit.toString();
        switch (uType) {
            case 'century':
                this._uid = (0, object_hash_1.default)([this._date.year() / 100]);
                break;
            case 'decade':
                this._uid = (0, object_hash_1.default)([this._date.year() / 10]);
                break;
            default:
                this._uid = (0, object_hash_1.default)(this.toArray());
                break;
        }
    }
    static fromDayjs(dateConfig, unit) {
        return new UnitID((0, dayjs_1.default)(dateConfig), unit_1.Unit.fromUnit(unit));
    }
    static fromArray(date) {
        if (date.length === 0) {
            return new UnitID((0, dayjs_1.default)(), unit_1.Unit.fromUnit('day'));
        }
        else {
            const unit = unit_1.Unit.fromOrder(date.length - 1);
            const [century, decade, year, ...rest] = date;
            const realYear = (century - 1) * 100 + (decade !== null && decade !== void 0 ? decade : 0) * 10 + (year !== null && year !== void 0 ? year : 0);
            return new UnitID((0, dayjs_1.default)([realYear, ...rest]), unit);
        }
    }
    static deserialize(id) {
        try {
            const [unitAndYear, padded] = id.split('_');
            const unit = unit_1.Unit.fromOrder(parseInt(unitAndYear[0]));
            const year = parseInt(unitAndYear.slice(1));
            const parsed = Array(padded.length / 2).fill(0).map((_, i) => padded.slice(i * 2, i * 2 + 2)).map(v => parseInt(v));
            const uType = unit.toString();
            switch (uType) {
                case 'century':
                    return new UnitID((0, dayjs_1.default)([year * 100, 0, 1, 0, 0, 0, 0]), unit);
                case 'decade':
                    return new UnitID((0, dayjs_1.default)([year * 10, 0, 1, 0, 0, 0, 0]), unit);
                case 'year':
                    return new UnitID((0, dayjs_1.default)([year, 0, 1, 0, 0, 0, 0]), unit);
                case 'month':
                    // date 从 1 开始
                    return new UnitID((0, dayjs_1.default)([year, parsed[0], 1, 0, 0, 0, 0]), unit);
                default:
                    const filled = [...parsed, ...Array(6 - parsed.length).fill(0)];
                    return new UnitID((0, dayjs_1.default)([year, ...filled]), unit);
            }
        }
        catch (e) {
            throw new Error(`UnitID fromDayjs: ${e}`);
        }
    }
    serialize() {
        const [year, ...rest] = this.toArray();
        const unitOrder = `${this._unit.order}`;
        const padded = rest.map(v => `${v}`.padStart(2, '0')).join('');
        const uType = this._unit.toString();
        switch (uType) {
            case 'century':
                return `${unitOrder}${year / 100}`;
            case 'decade':
                return `${unitOrder}${year / 10}`;
            case 'year':
                return `${unitOrder}${year}`;
            default:
                return `${unitOrder}${year}_${padded}`;
        }
    }
    as(unit) { return new UnitID(this._date.clone(), unit_1.Unit.fromUnit(unit)); }
    clone() { return new UnitID(this._date.clone(), this._unit); }
    add(value) {
        const uType = this._unit.toString();
        if (uType === 'century') {
            return new UnitID(this._date.add(value * 100, 'year'), this._unit);
        }
        else if (uType === 'decade') {
            return new UnitID(this._date.add(value * 10, 'year'), this._unit);
        }
        else {
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
            throw new Error('UnitID diff: unit not match');
        }
        if (milliSecond) {
            return this._date.diff(date._date, 'millisecond');
        }
        const uType = this._unit.toString();
        const start = date._date;
        const end = this._date;
        if (uType === 'century') {
            return Math.floor(end.diff(start, 'year') / 100);
        }
        else if (uType === 'decade') {
            return Math.floor(end.diff(start, 'year') / 10);
        }
        else {
            return end.diff(start, uType);
        }
    }
    /// 获取当前单位的开头，同时将当前单位下降一级
    get start() {
        const uType = this._unit.toString();
        const lowerUnit = this._unit.lower;
        if (lowerUnit === undefined) {
            throw new Error("UnitID start: second don't have sub unit");
        }
        if (uType === 'century') {
            const year = this._date.year();
            return new UnitID(this._date.year(Math.floor(year / 100) * 100), lowerUnit);
        }
        else if (uType === 'decade') {
            const year = this._date.year();
            return new UnitID(this._date.year(Math.floor(year / 10) * 10), lowerUnit);
        }
        else {
            return new UnitID(this._date.startOf(uType), lowerUnit);
        }
    }
    /// 获取当前单位同级单位的开头
    get startSibling() {
        const uType = this._unit.toString();
        switch (uType) {
            case 'century':
                throw new Error("UnitID s tartSibling: century is unbouded");
            case 'decade':
                return new UnitID(this._date.year(Math.floor(this._date.year() / 100) * 100), this._unit);
            case 'year':
                return new UnitID(this._date.year(Math.floor(this._date.year() / 10) * 10), this._unit);
            case 'month':
                return new UnitID(this._date.month(0), this._unit);
            case 'day':
                return new UnitID(this._date.date(1), this._unit);
            case 'hour':
                return new UnitID(this._date.hour(0), this._unit);
            case 'minute':
                return new UnitID(this._date.minute(0), this._unit);
            case 'second':
                return new UnitID(this._date.second(0), this._unit);
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
        const lowerUnit = this._unit.lower;
        if (lowerUnit === undefined) {
            throw new Error("UnitID end: second don' t have sub unit");
        }
        if (uType === 'century' || uType === 'decade') {
            return this.start.add(9);
        }
        else {
            return new UnitID(this._date.endOf(uType), lowerUnit);
        }
    }
    get endSibling() {
        const uType = this._unit.toString();
        switch (uType) {
            case 'century':
                throw new Error("UnitID endSibling: century is unbouded");
            case 'decade':
                return new UnitID(this._date.year(Math.floor(this._date.year() / 100) * 100 + 99), this._unit);
            case 'year':
                return new UnitID(this._date.year(Math.floor(this._date.year() / 10) * 10 + 9), this._unit);
            case 'month':
                return new UnitID(this._date.month(11), this._unit);
            case 'day':
                return new UnitID(this._date.endOf('month'), this._unit);
            case 'hour':
                return new UnitID(this._date.hour(23), this._unit);
            case 'minute':
                return new UnitID(this._date.minute(59), this._unit);
            case 'second':
                return new UnitID(this._date.second(59), this._unit);
        }
    }
    get isEnd() {
        const uType = this._unit.toString();
        if (uType === 'century' || uType === 'decade') {
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
            throw new Error('UnitID parent: century has no parent');
        }
        return this.as(upperUnit);
    }
    get children() {
        const start = this.start;
        const end = this.end;
        if (!start || !end) {
            return [];
        }
        return Array(end.diff(start) + 1).fill(0).map((_, i) => start.add(i));
    }
    toString() {
        let startIdx;
        if (this._unit.isLower('decade')) {
            startIdx = 2;
        } // 单位在年以下，只显示年份，不显示世纪
        else {
            startIdx = 0;
        }
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
            case 'day':
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
    toArray() {
        const array = [this._date.year(), this._date.month(), this._date.date(), this._date.hour(), this._date.minute(), this._date.second()];
        const order = this._unit.order;
        if (order <= 2) {
            return [array[0]];
        }
        else {
            return array.slice(0, order - 1);
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
