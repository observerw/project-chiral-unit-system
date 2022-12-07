"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const unit_id_1 = require("./unit-id");
require("./dayjs.config");
// console.log(UnitID.fromDayjs('2022-09-01', 'date').children.map(v => `${v}`));
console.log(unit_id_1.UnitID.deserialize('5_2022'));
