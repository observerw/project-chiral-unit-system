import { UnitID } from "./unit-id";
import './dayjs.config'

// console.log(dayjs('2022-09-01').endOf('year'));


const d = UnitID.fromDayjs('2022-09-27', 'date')


console.log(d.children.map(c => `${c}`));
