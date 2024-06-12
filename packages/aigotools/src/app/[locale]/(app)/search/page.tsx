import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import Container from "@/components/common/container";
import NavBar from "@/components/common/nav-bar";
import InfiniteSearch from "@/components/search/infinite-search";

export async function generateMetadata({
  params,
}: {
  params: { site: string; locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: "search",
  });

  return {
    title: t("metadata.title"),
  };
}

export default function Page({
  searchParams,
}: {
  searchParams: {
    s: string;
    p: string;
  };
}) {
  const rawSearch = searchParams["s"] || "";
  const search = decodeURIComponent(rawSearch.toString());

  return (
    <Container>
      <NavBar name={search} />
      <InfiniteSearch />

      {/* {count ? (
        <>
          <SiteGroup sites={sites} title={t("result")} />
          <ResultPagination page={page} search={search} total={totalPage} />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center my-28">
          <EmptyImage className="dark:invert" />
          <div className="mt-6 font-medium">{t("empty")}</div>
        </div>
      )} */}
    </Container>
  );
}
