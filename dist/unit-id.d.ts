import Date, { ConfigType, Dayjs } from 'dayjs';
import { IUnit, Unit } from './unit';
import { UnitIDRange } from './unit-range';
export declare class UnitID {
    readonly _date: Dayjs;
    readonly _unit: Unit;
    readonly _uid: string;
    constructor(_date: Dayjs, _unit: Unit);
    static fromDayjs(dateConfig: ConfigType, unit: IUnit | Unit): UnitID;
    static lowerBound(): UnitID;
    static upperBound(): UnitID;
    static deserialize(str: string): UnitID;
    serialize(): string;
    as(unit: IUnit | Unit): UnitID;
    add(value: number): UnitID;
    sub(value: number): UnitID;
    get date(): Date.Dayjs;
    get unit(): Unit;
    get next(): UnitID;
    get prev(): UnitID;
    diff(date: UnitID, milliSecond?: boolean): number;
    /**
     * 获取当前时间单位下的最小时间，即：当前时间单位以下的时间全部设置为最小值
     */
    get start(): UnitID;
    get isStart(): boolean;
    /**
     * 获取当前时间单位下的最大时间，即：当前时间单位以下的时间全部设置为最大值
     */
    get end(): UnitID;
    get isEnd(): boolean;
    get uid(): string;
    get parent(): UnitID;
    get childrenRange(): UnitIDRange;
    get children(): UnitID[];
    get firstChild(): UnitID;
    get lastChild(): UnitID;
    toString(): string;
    toUnitString(): string;
    toBriefString(): string;
    toJSON(): {
        unit: number;
        date: Date;
    };
    toDate(): Date;
    isBefore(date: UnitID): boolean;
    isAfter(date: UnitID): boolean;
    isSame({ _date, _unit }: UnitID): boolean;
    isBetween({ _date: startDate, _unit: startUnit }: UnitID, { _date: endDate, _unit: endUnit }: UnitID, d?: '()' | '[]' | '[)' | '(]'): boolean;
    isValid(): boolean;
}
