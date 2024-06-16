"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Button, Spinner } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { TicketPlus } from "lucide-react";
import { useEffect } from "react";

import EmptyImage from "./empty-image";

import Search from "@/components/index/search";
import { searchSites } from "@/lib/actions";
import SiteGroup from "@/components/common/sites-group";
import { Site } from "@/models/site";

export default function InfiniteSearch() {
  const searchParams = useSearchParams();
  const search = decodeURIComponent(searchParams.get("s") || "");
  const category = decodeURIComponent(searchParams.get("c") || "");
  const t = useTranslations("search");

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["search-sites"],
    queryFn: async ({ pageParam }) => {
      return await searchSites({ search, page: pageParam, category });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.hasNext) {
        return lastPage.page + 1;
      }
    },
    throwOnError(error) {
      console.log(error);
      toast.error("loadFailed");

      return false;
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    refetch({});
  }, [search, refetch, category]);

  const sites =
    data?.pages.reduce((t, c) => t.concat(c.sites), [] as Site[]) || [];

  return (
    <>
      <Search category={category} className="sm:mt-12" defaultSearch={search} />
      <SiteGroup sites={sites} title={t("result")} />
      <div className="flex justify-center mt-8">
        {isFetching || isFetchingNextPage ? (
          <Spinner className="my-24" />
        ) : hasNextPage ? (
          <Button
            className="font-semibold"
            color="primary"
            size="sm"
            startContent={<TicketPlus size={16} />}
            onClick={() => fetchNextPage()}
          >
            {t("loadMore")}
          </Button>
        ) : sites.length <= 0 ? (
          <div className="text-center my-16">
            <EmptyImage className="dark:invert" />
            <div className="mt-6 font-medium">{t("empty")}</div>
          </div>
        ) : null}
      </div>
    </>
  );
}
