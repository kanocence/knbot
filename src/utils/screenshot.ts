import { chromium } from 'playwright'

/**
 * 生成B站动态图片
 * @param did dynamic id
 * @returns base64 string
 */
export async function prtScBi(did: string) {
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
  return 'base64://' + image.toString('base64')
}