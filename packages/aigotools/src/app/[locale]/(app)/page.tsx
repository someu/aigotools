import { getTranslations } from "next-intl/server";

import Container from "@/components/common/container";
import Hero from "@/components/index/hero";
import Search from "@/components/index/search";
import SiteGroup from "@/components/common/sites-group";
import { getFeaturedSites, getLatestSites } from "@/lib/actions";

export default async function Page() {
  const t = await getTranslations("index");
  const [featuredSites, latestSites] = await Promise.all([
    getFeaturedSites(),
    getLatestSites(),
  ]);

  return (
    <>
      <Container>
        <Hero />
        <Search />
        <SiteGroup id="featured" sites={featuredSites} title={t("featured")} />
        <SiteGroup id="latest" sites={latestSites} title={t("latest")} />
      </Container>
    </>
  );
}
