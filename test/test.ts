import { UnitID } from "../src/unit-id";
import '../src/dayjs.config'
import { UnitIDRange } from "../src/unit-range";

const id1 = UnitID.fromDayjs('2020-01-01', 'month')
const id2 = UnitID.fromDayjs('2030-12-01', 'month')

const range = UnitIDRange.fromUnitID(id1, id2)