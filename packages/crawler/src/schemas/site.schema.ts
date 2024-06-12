import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SiteDocument = HydratedDocument<Site>;

export enum ProcessStage {
  pending = 'pending',
  processing = 'processing',
  success = 'success',
  fail = 'fail',
}

@Schema({
  collection: 'sites',
})
export class Site {
  @Prop({
    required: true,
  })
  userId: string;

  @Prop({
    required: true,
    unique: true,
  })
  siteKey: string;

  @Prop({
    required: true,
  })
  url: string;

  @Prop({
    required: true,
  })
  name: string;

  @Prop()
  featured: string;

  @Prop()
  snapshot: string;

  @Prop()
  desceription: string;

  @Prop()
  pricingType: string;

  @Prop()
  categories: string[];

  @Prop()
  pricings: string[];

  @Prop()
  images: string[];

  @Prop()
  features: string[];

  @Prop()
  usecases: string[];

  @Prop()
  users: string[];

  @Prop()
  relatedSearchs: string[];

  @Prop({
    type: Object,
  })
  links: object;

  @Prop()
  voteCount: string;

  @Prop()
  metaKeywords: string[];

  @Prop()
  metaDescription: string;

  @Prop()
  searchSuggestWords: string[];

  @Prop()
  state: string;

  @Prop({
    enum: Object.values(ProcessStage),
    default: ProcessStage.fail,
  })
  processStage: ProcessStage;

  @Prop({
    type: Number,
    default: () => Date.now(),
  })
  createdAt: number;

  @Prop({
    type: Number,
    default: () => Date.now(),
  })
  updatedAt: number;
}

export const SiteSchema = SchemaFactory.createForClass(Site);
