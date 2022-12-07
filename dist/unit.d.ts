export declare const UNITS: readonly ["century", "decade", "year", "month", "date", "hour", "minute", "second"];
export declare type IUnit = typeof UNITS[number];
export declare class Unit {
    readonly _order: number;
    constructor(_order?: number);
    static fromOrder(order: number): Unit;
    static fromUnit(unit: IUnit | Unit): Unit;
    get upper(): Unit | undefined;
    get lower(): Unit | undefined;
    get order(): number;
    isSame(unit: IUnit | Unit): boolean;
    isUpper(unit: IUnit | Unit): boolean;
    isLower(unit: IUnit | Unit): boolean;
    toString(): "hour" | "minute" | "month" | "second" | "year" | "date" | "century" | "decade";
}
