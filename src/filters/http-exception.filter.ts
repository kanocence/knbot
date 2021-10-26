import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'

const logger = new Logger('HttpExceptionFilter')

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()

    const message = exception.message
    logger.error(message)
    const errorResponse = {
      data: {
        error: message,
      }, // 获取全部的错误信息
      message: 'error',
      code: -1, // 自定义code
      url: request.originalUrl, // 错误的url地址
    }
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR
    // 设置返回的状态码、请求头、发送错误信息
    response.status(status)
    response.header('Content-Type', 'application/json charset=utf-8')
    response.send(errorResponse)
  }
}
