import { MessageModules } from "./message";
import { MetaEventModules } from "./meta-event";
import { RegisterModules } from "./modules";
import { NoticeModules } from "./notice";
import { RequestModules } from "./request";

/**
 * 导出的所有module
 */
export const Modules = [RegisterModules, ...MessageModules, ...MetaEventModules, ...NoticeModules, ...RequestModules]