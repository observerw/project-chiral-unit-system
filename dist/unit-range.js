"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitIDRange = void 0;
const unit_id_1 = require("./unit-id");
class UnitIDRange {
    constructor(_start, _end) {
        this._start = _start;
        this._end = _end;
    }
    static fromUnitID(start, end) {
        if (!start.unit.isSame(end.unit)) {
            throw new Error('UnitIDRange: start and end must be same unit');
        }
        if (end.isBefore(start)) {
            throw new Error('UnitIDRange: end must be after start');
        }
        return new UnitIDRange(start.clone(), end.clone());
    }
    static fromDayjs(start, end, unit) {
        return new UnitIDRange(unit_id_1.UnitID.fromDayjs(start, unit), unit_id_1.UnitID.fromDayjs(end, unit));
    }
    static deserialize([start, end]) {
        return new UnitIDRange(unit_id_1.UnitID.deserialize(start), unit_id_1.UnitID.deserialize(end));
    }
    serialize() {
        return [this._start.serialize(), this._end.serialize()];
    }
    get start() { return this._start; }
    get end() { return this._end; }
    get ids() {
        const ids = [];
        let id = this._start.clone();
        while (id.isBefore(this._end)) {
            ids.push(id);
            id = id.add(1);
        }
        ids.push(this._end.clone());
        return ids;
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
    isIntersect(range) {
        return this._start.isBefore(range._end) && this._end.isAfter(range._start) ||
            range._start.isBefore(this._end) && range._end.isAfter(this._start);
    }
    as(unit) {
    }
}
exports.UnitIDRange = UnitIDRange;
