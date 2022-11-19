import './dayjs.config';
import { UnitID } from "./unit-id";

const u1 = UnitID.fromDayjs('2022-09-27', 'second')
const u2 = UnitID.fromDayjs('2022', 'decade')

console.log(`${u1.startSibling}, ${u1.endSibling}`);

