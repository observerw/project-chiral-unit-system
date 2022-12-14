import { ConfigType } from "dayjs"
import { UnitIDException } from "./exception"
import { memoize } from "./memoize"
import { IUnit, Unit } from "./unit"
import { UnitID } from "./unit-id"

export class UnitIDRange {
    readonly _unit: Unit

    constructor(
        readonly _start: UnitID,
        readonly _end: UnitID
    ) {
        if (!_start.unit.isSame(_end.unit)) {
            throw new UnitIDException('UnitIDRange', 'unit not match')
        }

        this._unit = _start.unit
        while (this._unit.upper !== undefined) {
            const upper = this._unit.upper.toString()

            let diff
            switch (upper) {
                case 'century':
                    diff = Math.floor((this._end._date.year() - this._start._date.year()) / 100)
                    break
                case 'decade':
                    diff = Math.floor((this._end._date.year() - this._start._date.year()) / 10)
                    break
                default:
                    diff = this._end._date.diff(this._start._date, upper)
                    break
            }

            if (diff === 0) { break }
            this._unit = this._unit.upper
        }

        this._start = this._start.start
        this._end = this._end.end
    }

    static fromUnitID(start: UnitID, end: UnitID): UnitIDRange {
        if (start.isBefore(end)) {
            return new UnitIDRange(start, end)
        } else {
            return new UnitIDRange(end, start)
        }
    }

    static fromDayjs(start: ConfigType, end: ConfigType, unit: IUnit | Unit): UnitIDRange {
        return new UnitIDRange(UnitID.fromDayjs(start, unit), UnitID.fromDayjs(end, unit))
    }

    static fromJSON({ unit, start, end }: {
        unit: number,
        start: Date,
        end: Date
    }): UnitIDRange {
        return UnitIDRange.fromDayjs(start, end, Unit.fromOrder(unit))
    }

    toJSON() {
        return {
            unit: this._unit._order,
            start: this._start._date.toDate(),
            end: this._end._date.toDate()
        }
    }

    toDate() {
        return [this._start.toDate(), this._end.toDate()]
    }

    static deserialize(str: string): UnitIDRange {
        const [unit, start, end] = str.split('_')
        return UnitIDRange.fromDayjs(start, end, Unit.fromOrder(parseInt(unit)))
    }

    serialize() {
        return `${this._unit.order}_${this._start._date.format()}_${this._end._date.format()}`
    }

    get start(): UnitID { return this._start }

    get end(): UnitID { return this._end }

    get unit(): Unit { return this._unit }

    @memoize
    get ids(): UnitID[] {
        return Array(this._end.diff(this._start) + 1)
            .fill(0)
            .map((_, i) => this._start.add(i))
    }

    @memoize
    get length() {
        return this._end.diff(this._start) + 1
    }

    add(count: number): UnitIDRange {
        return new UnitIDRange(this._start.add(count), this._end.add(count))
    }

    sub(count: number): UnitIDRange {
        return new UnitIDRange(this._start.sub(count), this._end.sub(count))
    }

    as(unit: IUnit | Unit): UnitIDRange {
        return new UnitIDRange(this._start.as(unit), this._end.as(unit))
    }

    isIntersect(range: UnitIDRange) {
        return this._start.isBefore(range._end) && this._end.isAfter(range._start) ||
            range._start.isBefore(this._end) && range._end.isAfter(this._start)
    }
}