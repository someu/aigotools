"use client";
import { useQuery } from "@tanstack/react-query";

import CategoryTag from "@/components/index/cateogry-tag";
import Loading from "@/components/common/loading";
import { getAllCategories } from "@/lib/actions";
import { useRouter } from "@/navigation";

export default function CategoriesList() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["get-all-categories"],
    queryFn: async () => {
      return await getAllCategories();
    },
    initialData: [],
  });

  const router = useRouter();

  return (
    <div className="relative min-h-96 mt-8">
      <div>
        {categories.map((category) => {
          return (
            <div key={category._id} className="mb-6">
              <h3 className="font-medium text-xl">
                {[category.icon, category.name].filter(Boolean).join(" ")}
              </h3>
              <div className="mt-4 grid grid-cols-6 gap-4">
                {category.children.map((item) => {
                  return (
                    <CategoryTag
                      key={item._id}
                      onClick={() => {
                        const url = `/search?c=${encodeURIComponent(
                          item.name
                        )}`;

                        router.push(url);
                      }}
                    >
                      {[item.icon, item.name].filter(Boolean).join(" ")}
                    </CategoryTag>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <Loading isLoading={isLoading} />
    </div>
  );
}
