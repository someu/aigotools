import { Document } from "mongoose";

export type Subtract<T, U> = Pick<T, Exclude<keyof T, keyof U>>;

export type MongoPlain<T extends Document> = Subtract<T, Document> & {
  _id: string;
};
