import { ConfigType } from "dayjs";
import { IUnit, Unit } from "./unit";
import { UnitID } from "./unit-id";
export declare class UnitIDRange {
    readonly _start: UnitID;
    readonly _end: UnitID;
    readonly _unit: Unit;
    constructor(_start: UnitID, _end: UnitID);
    static fromUnitID(start: UnitID, end: UnitID): UnitIDRange;
    static fromDayjs(start: ConfigType, end: ConfigType, unit: IUnit | Unit): UnitIDRange;
    static unbounded(): UnitIDRange;
    static deserialize(str: string): UnitIDRange;
    serialize(): string;
    get start(): UnitID;
    get end(): UnitID;
    get unit(): Unit;
    get ids(): UnitID[];
    get length(): number;
    add(count: number): UnitIDRange;
    sub(count: number): UnitIDRange;
    as(unit: IUnit | Unit): UnitIDRange;
    isIntersect(range: UnitIDRange): boolean;
    toJSON(): {
        unit: number;
        start: Date;
        end: Date;
    };
}
