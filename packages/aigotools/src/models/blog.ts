import mongoose from "mongoose";

export interface Blog extends mongoose.Document {
  userId: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

const BlogSchema = new mongoose.Schema<Blog>({
  userId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
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

export const BlogModel =
  mongoose.models.Blog || mongoose.model<Blog>("Blog", BlogSchema, "Blogs");
