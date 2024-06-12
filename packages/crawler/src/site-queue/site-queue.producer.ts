import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { SITE_CRAWL_JOB, SITE_QUEUE_NAME } from './site-queue.constant';

@Injectable()
export class SiteQueueProducer {
  constructor(@InjectQueue(SITE_QUEUE_NAME) private siteQueue: Queue) {}

  async addCrawlJob(siteId: string) {
    await this.siteQueue.add(SITE_CRAWL_JOB, siteId, {
      attempts: 3,
      backoff: 10000,
    });
  }

  async batchAddCrawlJobs(siteIds: string[]) {
    await this.siteQueue.addBulk(
      siteIds.map((siteId) => {
        return {
          name: SITE_CRAWL_JOB,
          data: siteId,
          opts: {
            attempts: 3,
            backoff: 10000,
          },
        };
      }),
    );
  }

  async stopCrawlJob(siteId: string) {
    const jobs = await this.siteQueue.getJobs(['active', 'waiting', 'delayed']);
    const siteJobs = jobs.filter((job) => job.data === siteId);
    await Promise.all(siteJobs.map((siteJob) => siteJob.remove()));
  }

  async batchStopCrawlJob(siteIds: string[]) {
    const jobs = await this.siteQueue.getJobs(['active', 'waiting', 'delayed']);
    const siteJobs = jobs.filter((job) => siteIds.includes(job.data));
    return await Promise.allSettled(
      siteJobs.map((siteJob) => siteJob.remove()),
    );
  }
}
