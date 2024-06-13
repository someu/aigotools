import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as genericPool from 'generic-pool';
import { Factory } from 'generic-pool';
import { Browser, Page, chromium } from 'playwright';
import * as cheerio from 'cheerio';

@Injectable()
export class BrowserService {
  constructor(private readonly configService: ConfigService) {
    this.browserPool = genericPool.createPool<Browser>(this.factory, {
      max: parseInt(configService.get('BROWSER_POOL_MAX'), 10) || 10,
      min: parseInt(configService.get('BROWSER_POOL_MIN'), 10) || 2,
      maxWaitingClients:
        parseInt(configService.get('BROWSER_POOL_MAX_WAITING'), 10) || 100,
      idleTimeoutMillis:
        parseInt(configService.get('BROWSER_POOL_IDLE_TIMEOUT'), 10) || 15000,
    });

    process.on('SIGINT', async () => {
      Logger.log('Borser drain [START]');
      await this.browserPool.drain();
      Logger.log('Borser drain [DONE]');
    });
  }

  private browserPool: genericPool.Pool<Browser>;

  private factory: Factory<Browser> = {
    create: async (): Promise<Browser> => {
      try {
        const browser = await chromium.launch({
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--ignore-certificate-errors',
          ],
        });
        this.attachEventHandlers(browser);
        return browser;
      } catch (e: unknown) {
        if (e instanceof Error) {
          if (e.message.includes('exec playwright install')) {
            Logger.fatal(e.message);
            process.exit(1);
          } else {
            Logger.error(e.message);
          }
        }
        throw e;
      }
    },
    destroy: async (browser: Browser) => {
      await browser.close();
    },
  };

  private attachEventHandlers(browser: Browser) {
    browser.on('disconnected', () => {
      Logger.error('Browser disconnected. Removing from pool.');
      this.browserPool
        .destroy(browser)
        .catch((e) => Logger.error('Error destroying browser:', e));
    });
  }

  public async screenshot(url: string, width = 1920, height = 1080) {
    const browser = await this.browserPool.acquire();

    let page: Page;
    let destoryFlag = false;
    try {
      page = await browser
        .newPage({
          viewport: {
            width,
            height,
          },
        })
        .catch((error) => {
          destoryFlag = true;
          throw error;
        });

      await page.goto(url, {
        waitUntil: 'load',
        timeout:
          parseInt(this.configService.get('BROWSER_LOAD_TIMEOUT'), 10) || 30000,
      });

      const [content, screenshot] = await Promise.all([
        page.content(),
        page.screenshot(),
      ]);
      const $ = cheerio.load(content);
      const keywords =
        $('meta[name="keywords"]').attr('content')?.split(',') || [];
      const desceription = $('meta[name="description"]').attr('content') || '';
      return { keywords, desceription, screenshot };
    } catch (error) {
      throw error;
    } finally {
      if (page) {
        await page
          .close()
          .catch((error) => Logger.error(`Close browser page error: ${error}`));
      }
      if (destoryFlag) {
        Logger.error(`Destory browser`);
        await this.browserPool.destroy(browser);
      } else {
        await this.browserPool.release(browser);
      }
    }
  }

  async drain() {
    await this.browserPool.drain();
    await this.browserPool.clear();
  }
}
