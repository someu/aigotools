import { Category } from "@/models/category";

export const createTemplateCategory = (category: Partial<Category> = {}) => {
  return {
    name: "",
    icon: "",
    ...category,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  } as Category;
};
