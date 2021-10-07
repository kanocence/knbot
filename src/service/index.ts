import { BotService } from "./bot.service";
import { MessageService } from "./message.service";
import { MetaEventService } from "./meta-event.service";
import { NoticeService } from "./notice.service";
import { RequestService } from "./request.service";

/**
 * 导出的所有service
 */
export const Services = [BotService, MessageService, MetaEventService, NoticeService, RequestService]