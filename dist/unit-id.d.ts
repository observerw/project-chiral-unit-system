import Date, { ConfigType, Dayjs } from 'dayjs';
import { IUnit, Unit } from './unit';
export declare class UnitID {
    _date: Dayjs;
    _unit: Unit;
    _uid: string;
    constructor(_date: Dayjs, _unit: Unit);
    static fromDayjs(dateConfig: ConfigType, unit: IUnit | Unit): UnitID;
    static fromArray(date: number[]): UnitID;
    static deserialize(id: string): UnitID;
    serialize(): string;
    as(unit: IUnit | Unit): UnitID;
    clone(): UnitID;
    add(value: number): UnitID;
    sub(value: number): UnitID;
    get date(): Date.Dayjs;
    get unit(): Unit;
    get next(): UnitID;
    get prev(): UnitID;
    diff(date: UnitID, milliSecond?: boolean): number;
    get start(): UnitID;
    get startSibling(): UnitID;
    get isStart(): boolean;
    get end(): UnitID;
    get endSibling(): UnitID;
    get isEnd(): boolean;
    get uid(): string;
    get parent(): UnitID;
    get children(): UnitID[];
    toString(): string;
    toUnitString(): string;
    toBriefString(): string;
    toArray(): number[];
    isBefore(date: UnitID): boolean;
    isAfter(date: UnitID): boolean;
    isSame({ _date, _unit }: UnitID): boolean;
    isBetween({ _date: startDate, _unit: startUnit }: UnitID, { _date: endDate, _unit: endUnit }: UnitID, d?: '()' | '[]' | '[)' | '(]'): boolean;
    isValid(): boolean;
}