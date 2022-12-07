import { UnitID } from "./unit-id";
import './dayjs.config'

// console.log(UnitID.fromDayjs('2022-09-01', 'date').children.map(v => `${v}`));

console.log(UnitID.deserialize('5_2022'));
