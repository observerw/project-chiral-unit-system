"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(require("dayjs"));
// import arraySupport from 'dayjs/plugin/arraySupport'
// import relativeTime from 'dayjs/plugin/relativeTime'
// import toArray from 'dayjs/plugin/toArray'
// import advancedFormat from 'dayjs/plugin/advancedFormat'
// import duration from 'dayjs/plugin/duration'
const isBetween_1 = __importDefault(require("dayjs/plugin/isBetween"));
// dayjs.locale('zh-cn')
// dayjs.extend(arraySupport)
// dayjs.extend(relativeTime)
// dayjs.extend(toArray)
// dayjs.extend(advancedFormat)
// dayjs.extend(duration)
dayjs_1.default.extend(isBetween_1.default);
