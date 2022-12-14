"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const unit_id_1 = require("./unit-id");
require("./dayjs.config");
const id = unit_id_1.UnitID.fromDayjs('2020-01-01', 'month');
console.log(`${id.lastChild}`);
