import { UnitID } from "./unit-id"
import './dayjs.config'

const u1 = UnitID.fromDayjs('2022', 'year')
const u2 = UnitID.fromDayjs('2022', 'decade')

console.log(u1.uid);
console.log(u2.uid);
