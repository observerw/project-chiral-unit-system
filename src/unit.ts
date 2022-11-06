export const UNITS = ['century', 'decade', 'year', 'month', 'day', 'hour', 'minute', 'second'] as const
const LENGTH = 8

export type IUnit = typeof UNITS[number]

export class Unit {
    private constructor(
        private _order: number = 4,
    ) { }

    static fromOrder(order: number) { return new Unit(order) }

    static fromUnit(unit: IUnit | Unit) {
        if (typeof unit === 'string') {
            return new Unit(UNITS.indexOf(unit))
        } else {
            return unit.clone()
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

    clone() { return new Unit(this._order) }
}