import { Logger } from '@nestjs/common'
import { chromium } from 'playwright'

const logger = new Logger('ScreenShot')

/**
 * 生成B站动态图片
 * @param did dynamic id
 * @returns base64 string
 */
export async function prtScBi(did: string) {
  try {
    const browser = await chromium.launch()

    const page = await browser.newPage({
      deviceScaleFactor: 2
    })

    await page.goto(`https://t.bilibili.com/${did}`)

    // 设置分辨率
    page.setViewportSize({
      "width": 2120,
      "height": 1080
    })

    // 等待 5s 加载
    await page.waitForTimeout(5000)

    const card = await page.$(`[data-did="${did}"]`)
    const clip = await card.boundingBox()
    const bar = await page.$(".text-bar")
    const bar_bound = await bar.boundingBox()
    clip['height'] = bar_bound['y'] - clip['y']

    const image = await page.screenshot({
      clip: clip,
      fullPage: true,
    })
    const res = 'base64://' + image.toString('base64')
    logger.verbose(res.slice(0, 20))
    return res
  } catch (err) {
    logger.error(`screenshot ${did} err: `, err)
    return null
  }
}