import mongoose, { Model } from "mongoose";

import { MongoPlain } from "@/lib/types";
import { ReviewState } from "@/lib/constants";

export interface ReviewDocument extends mongoose.Document {
  name: string;
  url: string;
  userId: string;
  userEmail: string;
  state: ReviewState;
  createdAt: number;
  updatedAt: number;
}

export type Review = MongoPlain<ReviewDocument>;

const ReviewSchema = new mongoose.Schema<ReviewDocument>({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    enum: Object.values(ReviewState),
    default: ReviewState.pending,
  },
  createdAt: {
    type: Number,
    default: () => Date.now(),
  },
  updatedAt: {
    type: Number,
    default: () => Date.now(),
    index: true,
  },
});

export const ReviewModel =
  (mongoose.models.Review as Model<ReviewDocument>) ||
  mongoose.model<ReviewDocument>("Review", ReviewSchema, "reviews");
