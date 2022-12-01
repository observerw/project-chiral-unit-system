import { ConfigType } from "dayjs";
import { IUnit, Unit } from "./unit";
import { UnitID } from "./unit-id";
export declare class UnitIDRange {
    _start: UnitID;
    _end: UnitID;
    constructor(_start: UnitID, _end: UnitID);
    static fromUnitID(start: UnitID, end: UnitID): UnitIDRange;
    static fromDayjs(start: ConfigType, end: ConfigType, unit: IUnit | Unit): UnitIDRange;
    static deserialize([start, end]: [string, string]): UnitIDRange;
    serialize(): [string, string];
    get start(): UnitID;
    get end(): UnitID;
    get ids(): UnitID[];
    length(unit?: IUnit | Unit): number;
    add(count: number): UnitIDRange;
    sub(count: number): UnitIDRange;
    isIntersect(range: UnitIDRange): boolean;
    as(unit: IUnit | Unit): void;
}
