import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import Container from "@/components/common/container";
import Form from "@/components/submit/form";
import Title from "@/components/submit/title";

export async function generateMetadata({
  params,
}: {
  params: { site: string; locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: "submit",
  });

  return {
    title: t("metadata.title"),
  };
}

export default function Submit() {
  return (
    <Container>
      <Title />
      <Form />
    </Container>
  );
}
