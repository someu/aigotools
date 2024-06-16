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
    c: string;
  };
}) {
  const rawCategory = searchParams["c"] || "";
  const rawSearch = searchParams["s"] || "";
  const category = decodeURIComponent(rawCategory.toString());
  const search = decodeURIComponent(rawSearch.toString());

  return (
    <Container>
      <NavBar name={[category, search].filter(Boolean)} />
      <InfiniteSearch />
    </Container>
  );
}
