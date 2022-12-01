"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(require("dayjs"));
const arraySupport_1 = __importDefault(require("dayjs/plugin/arraySupport"));
const relativeTime_1 = __importDefault(require("dayjs/plugin/relativeTime"));
const toArray_1 = __importDefault(require("dayjs/plugin/toArray"));
const advancedFormat_1 = __importDefault(require("dayjs/plugin/advancedFormat"));
const duration_1 = __importDefault(require("dayjs/plugin/duration"));
const isBetween_1 = __importDefault(require("dayjs/plugin/isBetween"));
// dayjs.locale('zh-cn')
dayjs_1.default.extend(arraySupport_1.default);
dayjs_1.default.extend(relativeTime_1.default);
dayjs_1.default.extend(toArray_1.default);
dayjs_1.default.extend(advancedFormat_1.default);
dayjs_1.default.extend(duration_1.default);
dayjs_1.default.extend(isBetween_1.default);
