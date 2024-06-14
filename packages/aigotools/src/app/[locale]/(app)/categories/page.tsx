import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";

import CategoriesList from "@/components/categories/categories-list";
import Container from "@/components/common/container";
import NavBar from "@/components/common/nav-bar";

export async function generateMetadata({
  params,
}: {
  params: { site: string; locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: "categories",
  });

  return {
    title: t("metadata.title"),
  };
}

export default function Page() {
  const t = useTranslations("categories");

  return (
    <Container>
      <NavBar name={t("metadata.title")} />
      <CategoriesList />
    </Container>
  );
}
