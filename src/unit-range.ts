import { ConfigType } from "dayjs"
import { IUnit, Unit } from "./unit"
import { UnitID } from "./unit-id"

export class UnitIDRange {
    private constructor(
        private _start: UnitID,
        private _end: UnitID
    ) { }

    static fromUnitID(start: UnitID, end: UnitID): UnitIDRange {
        if (!start.unit.isSame(end.unit)) { throw new Error('UnitIDRange: start and end must be same unit') }
        if (end.isBefore(start)) { throw new Error('UnitIDRange: end must be after start') }
        return new UnitIDRange(start.clone(), end.clone())
    }

    static fromDayjs(start: ConfigType, end: ConfigType, unit: IUnit | Unit): UnitIDRange {
        return new UnitIDRange(UnitID.fromDayjs(start, unit), UnitID.fromDayjs(end, unit))
    }

    static deserialize([start, end]: [string, string]): UnitIDRange {
        return new UnitIDRange(UnitID.deserialize(start), UnitID.deserialize(end))
    }

    serialize(): [string, string] {
        return [this._start.serialize(), this._end.serialize()]
    }

    get start(): UnitID { return this._start }

    get end(): UnitID { return this._end }

    get ids(): UnitID[] {
        const ids: UnitID[] = []
        let id = this._start.clone()
        while (id.isBefore(this._end)) {
            ids.push(id)
            id = id.add(1)
        }
        ids.push(this._end.clone())
        return ids
    }

    length(unit?: IUnit | Unit): number {
        if (unit) {
            const start = this._start.as(unit)
            const end = this._end.as(unit)
            return end.diff(start)
        } else {
            return this._end.diff(this._start) + 1
        }
    }

    add(count: number): UnitIDRange {
        return new UnitIDRange(this._start.add(count), this._end.add(count))
    }

    sub(count: number): UnitIDRange {
        return new UnitIDRange(this._start.sub(count), this._end.sub(count))
    }

    isIntersect(range: UnitIDRange): boolean {
        return this._start.isBefore(range._end) && this._end.isAfter(range._start) ||
            range._start.isBefore(this._end) && range._end.isAfter(this._start)
    }

    as(unit: IUnit | Unit) {

    }
}