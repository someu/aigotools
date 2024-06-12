import { Injectable } from '@nestjs/common';
import { ProcessStage, Site } from './schemas/site.schema';
import { FilterQuery, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SiteQueueProducer } from './site-queue/site-queue.producer';

export interface BatchParams {
  query?: {
    state?: string;
    processStage?: string;
    search?: string;
  };
  siteIds?: string;
}

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Site.name) private siteModel: Model<Site>,
    private readonly siteQueueProducer: SiteQueueProducer,
  ) {}

  private generateBatchQuery(params: BatchParams) {
    const query: FilterQuery<Site> = { $or: [] };
    if (params.siteIds?.length) {
      query.$or.push({ _id: { $in: params.siteIds } });
    }
    if (params.query) {
      query.$or.push(params.query);
    }
    if (query.$or.length === 0) {
      throw new Error('params wrong');
    }
    return query;
  }

  async batchDispatchSiteCrawl(params: BatchParams) {
    const query = this.generateBatchQuery(params);
    await this.siteModel.updateMany(query, {
      $set: { processStage: ProcessStage.processing },
    });
    const siteIds = (await this.siteModel.distinct('_id', query)).map((id) =>
      id.toString(),
    );
    await this.siteQueueProducer.batchAddCrawlJobs(siteIds);
  }

  async batchStopSiteCrawl(params: BatchParams) {
    const query = this.generateBatchQuery(params);
    await this.siteModel.updateMany(query, {
      $set: { processStage: ProcessStage.pending },
    });
    const siteIds = (await this.siteModel.distinct('_id', query)).map((id) =>
      id.toString(),
    );
    await this.siteQueueProducer.batchStopCrawlJob(siteIds);
  }
}
