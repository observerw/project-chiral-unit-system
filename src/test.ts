import { UnitID } from "./unit-id";
import './dayjs.config'
import { UnitIDRange } from "./unit-range";

const id = UnitID.fromDayjs('2020-01-01', 'month')

console.log(`${id.lastChild}`);
