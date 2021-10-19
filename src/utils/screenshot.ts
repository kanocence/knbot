import { Logger } from '@nestjs/common'
import * as puppeteer from 'puppeteer'

const logger = new Logger('ScreenShot')

/**
 * 生成B站动态图片
 * @param did dynamic id
 * @returns base64 string
 */
export async function prtScBi(did: string) {
  try {
    const url = `https://t.bilibili.com/${did}`

    let browser = await puppeteer.launch({
      defaultViewport: {
        deviceScaleFactor: 2,
        width: 2120,
        height: 1080
      },
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage"
      ]
    })
    const page = await browser.newPage()
    await page.goto(url)

    // 等待 5s 加载
    await page.waitForTimeout(5000)

    const card = await page.$(`[data-did="${did}"]`)
    const clip = await card.boundingBox()
    const bar = await page.$(".text-bar")
    const bar_bound = await bar.boundingBox()
    clip['height'] = bar_bound['y'] - clip['y']

    const result = await page.screenshot({
      clip: clip,
      encoding: "base64",
    })
    const base64 = "base64://" + result
    await page.close()
    return base64
  } catch (err) {
    logger.error(`screenshot ${did} err: `, err)
    return null
  }
}