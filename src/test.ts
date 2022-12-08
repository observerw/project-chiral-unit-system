import { UnitID } from "./unit-id";
import './dayjs.config'
import { UnitIDRange } from "./unit-range";

// console.log(UnitID.fromDayjs('2022-09-01', 'date').children.map(v => `${v}`));

console.log(UnitIDRange.fromDayjs('2022', '3022', 'second')._unit.toString());
