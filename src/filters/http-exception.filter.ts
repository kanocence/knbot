import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { Request, Response } from 'express'

const logger = new Logger('HttpExceptionFilter')

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    const message = exception.message
    logger.error(message)
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

    // 设置返回的状态码、请求头、发送错误信息
    response
      .status(status)
      .json({
        data: {
          error: message,
        }, // 获取全部的错误信息
        message: 'error',
        code: status, // 自定义code
        url: request.originalUrl, // 错误的url地址
      })
  }
}
