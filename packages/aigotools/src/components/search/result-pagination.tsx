"use client";

import { Pagination } from "@nextui-org/react";

import { useRouter } from "@/navigation";

export default function ResultPagination({
  search,
  page,
  total,
}: {
  search: string;
  page: number;
  total: number;
}) {
  const router = useRouter();

  return (
    <div className="mt-10 flex items-center justify-center">
      <Pagination
        showShadow
        page={page}
        size="md"
        total={total}
        onChange={(page) => {
          router.replace(`/search/?s=${encodeURIComponent(search)}&p=${page}`);
        }}
      />
    </div>
  );
}
