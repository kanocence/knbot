import { Injectable, Logger } from '@nestjs/common'
import * as puppeteer from 'puppeteer'

@Injectable()
export class ScreenShotUtil {

  private logger = new Logger(ScreenShotUtil.name)

  private browser: puppeteer.Browser

  constructor() {
    this.createBrowser().then(browser => {
      this.browser = browser
    }).catch(e => {
      this.logger.error('create browser err', e)
      process.exit()
    })
  }

  async createBrowser() {
    return await puppeteer.launch({
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
  }

  async getScreenShot(did: string) {
    const url = `https://t.bilibili.com/${did}`
    try {
      const page = await this.browser.newPage()

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
      this.logger.error('screen shot err', err)
      return undefined
    }
  }
}