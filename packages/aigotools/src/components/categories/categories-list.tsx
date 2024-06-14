"use client";
import { useQuery } from "@tanstack/react-query";

import Loading from "@/components/common/loading";
import { getAllCategories } from "@/lib/actions";

export default function CategoriesList() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["get-all-categories"],
    queryFn: async () => {
      return await getAllCategories();
    },
    initialData: [],
  });

  return (
    <div className="relative min-h-96 mt-6">
      <div className="grid grid-cols-4 gap-4">
        {categories.map((category) => {
          return (
            <div
              key={category._id}
              className="px-3 py-2 bg-primary-600 transition-all hover:bg-primary-800 text-primary-100 rounded-md cursor-pointer"
            >
              {category.icon}
              {category.name}
            </div>
          );
        })}
      </div>
      <Loading isLoading={isLoading} />
    </div>
  );
}
