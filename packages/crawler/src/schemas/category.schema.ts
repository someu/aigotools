import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({
  collection: 'categories',
})
export class Category {
  @Prop({ default: '' })
  icon: string;

  @Prop({
    required: true,
    unique: true,
  })
  name: string;

  @Prop()
  parent: mongoose.Types.ObjectId;

  @Prop()
  featured: boolean;

  @Prop()
  weight: number;

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

export const CategorySchema = SchemaFactory.createForClass(Category);
