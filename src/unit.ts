export const UNITS = ['century', 'decade', 'year', 'month', 'date', 'hour', 'minute', 'second'] as const
const LENGTH = 8

export type IUnit = typeof UNITS[number]

export class Unit {
    constructor(
        readonly _order: number = 4,
    ) {
        if (_order >= LENGTH) { throw new Error(`expect order < ${LENGTH}, got ${_order}`) }
    }

    static fromOrder(order: number) {
        return new Unit(order)
    }

    static fromUnit(unit: IUnit | Unit) {
        if (typeof unit === 'string') {
            if (!UNITS.includes(unit)) { throw new Error(`expect unit in ${UNITS}, got ${unit}`) }
            return new Unit(UNITS.indexOf(unit))
        } else {
            return unit
        }
    }

    get upper(): Unit | undefined {
        return this._order > 0 ? new Unit(this._order - 1) : undefined
    }

    get lower(): Unit | undefined {
        return this._order < LENGTH - 1 ? new Unit(this._order + 1) : undefined
    }

    get order() { return this._order }

    isSame(unit: IUnit | Unit) {
        if (typeof unit === 'string') { return this.toString() === unit }
        else { return this._order === unit._order }
    }

    isUpper(unit: IUnit | Unit) {
        if (typeof unit === 'string') { return this._order < UNITS.indexOf(unit) }
        else { return this._order < unit._order }
    }

    isLower(unit: IUnit | Unit) {
        if (typeof unit === 'string') { return this._order > UNITS.indexOf(unit) }
        else { return this._order > unit._order }
    }

    toString() { return UNITS[this._order] }
}