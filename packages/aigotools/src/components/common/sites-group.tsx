import { Istok_Web } from "next/font/google";
import clsx from "clsx";

import { Site } from "@/models/site";
import Container from "@/components/common/container";

import SiteCard from "./site-card";

const istokWeb = Istok_Web({
  subsets: ["latin"],
  weight: "700",
});

export default function SiteGroup({
  title,
  sites,
  id,
}: {
  id?: string;
  title: String;
  sites: Array<Site>;
}) {
  if (!sites.length) {
    return null;
  }

  return (
    <Container className="mt-10 sm:mt-16" id={id}>
      <h2 className={clsx(istokWeb.className, "text-2xl font-bold")}>
        {title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {sites.map((site) => {
          return <SiteCard key={site._id} site={site} />;
        })}
      </div>
    </Container>
  );
}
