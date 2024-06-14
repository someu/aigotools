import { Category } from "@/models/category";

export const createTemplateCategory = (category: Partial<Category> = {}) => {
  const newCategory: Omit<Category, "_id"> = {
    name: "",
    icon: "",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    featured: false,
    weight: 0,
  };

  return {
    ...newCategory,
    ...category,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  } as Category;
};
