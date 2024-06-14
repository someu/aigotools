import mongoose from "mongoose";

import { MongoPlain } from "@/lib/types";

export interface CategoryDocument extends mongoose.Document {
  icon: string;
  name: string;
  featured: boolean;
  weight: number;
  createdAt: number;
  updatedAt: number;
}

export type Category = MongoPlain<CategoryDocument>;

const CategorySchema = new mongoose.Schema<Category>({
  icon: {
    type: String,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  featured: { type: Boolean, default: false },
  weight: { type: Number, default: 0 },
  createdAt: {
    type: Number,
    default: () => Date.now(),
  },
  updatedAt: {
    type: Number,
    default: () => Date.now(),
  },
});

export const CategoryModel =
  mongoose.models.categories ||
  mongoose.model<Category>("categories", CategorySchema, "categories");
