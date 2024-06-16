import mongoose from "mongoose";

export enum UpvoteType {
  site = "site",
}

export interface Upvote extends mongoose.Document {
  userId: string;
  targetId: string;
  upvoteType: UpvoteType;
  createdAt: number;
  updatedAt: number;
}

const UpvoteSchema = new mongoose.Schema<Upvote>({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  targetId: {
    type: String,
    required: true,
    index: true,
  },
  upvoteType: {
    type: String,
    required: true,
    enum: Object.values(UpvoteType),
    index: true,
  },
  createdAt: {
    type: Number,
    default: () => Date.now(),
  },
  updatedAt: {
    type: Number,
    default: () => Date.now(),
  },
});

export const UpvoteModel =
  mongoose.models.Upvote ||
  mongoose.model<Upvote>("Upvote", UpvoteSchema, "upvotes");
