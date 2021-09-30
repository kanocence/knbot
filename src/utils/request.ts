import { Logger } from "@nestjs/common"
import axios, { AxiosResponse, AxiosRequestConfig } from "axios"

const service = axios.create({
  timeout: 30000
})

const logger = new Logger('request')

/**
 * 添加请求拦截器
 * 记录日志
 */
service.interceptors.request.use((config: AxiosRequestConfig) => {
  // logger.debug('send request:', config)
  return config
}, (error) => {
  logger.error('request err:', error)
  return Promise.reject(error)
})

/**
 * 添加响应拦截器
 * 记录日志
 */
service.interceptors.response.use((response: AxiosResponse) => {
  // logger.debug('request response:', response)
  return response.data
}, (error) => {
  logger.error('response err:', error)
  return Promise.reject(error)
})

/**
 * 通过axios发送xhr请求
 * @param config AxiosRequestConfig
 * @returns Promise<AxiosResponse<any>>
 */
export async function request(config: AxiosRequestConfig): Promise<any> {
  return service(config)
}