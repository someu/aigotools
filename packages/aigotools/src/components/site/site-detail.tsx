import dayjs from "dayjs";
import { Button, Divider, Image } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { ExternalLink, Navigation } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

import VoteButton from "./vote-button";
import ListItem from "./list-item";
import SiteTags from "./site-tags";

import { Site } from "@/models/site";

export default function SiteDetail({ site }: { site: Site }) {
  const t = useTranslations("site");

  return (
    <div className="py-9">
      <Link
        className="flex items-center justify-center cursor-pointer"
        href={site.url}
        target="_blank"
      >
        <h2
          className={clsx(
            "inline-flex relative gap-2 px-2 items-center justify-center text-center text-3xl leading-0 font-bold text-primary-800",
            "after:content-[' '] after:overflow-hidden after:absolute after:-bottom-[1px] after:left-0 after:h-[2px] after:bg-primary-800 after:w-0 hover:after:w-full after:transition-width"
          )}
        >
          <span>{site.name}</span>
          <ExternalLink size={22} strokeWidth={3} />
        </h2>
      </Link>

      <div className="text-center mt-5 text-primary-500 font-medium text-sm">
        {dayjs(site.updatedAt).format("YYYY-MM-DD HH:mm:ss")}
      </div>
      <div className="mt-9 flex flex-wrap lg:flex-nowrap gap-6">
        <div className="flex-1 basis-full lg:basis-[30%]">
          <Image
            isZoomed
            alt={site.name}
            classNames={{
              wrapper: "w-full !max-w-full cursor-pointer",
              img: "w-full aspect-video object-fill",
            }}
            radius="sm"
            src={site.snapshot}
          />
          <SiteTags site={site} />
        </div>
        <div className="flex-1 basis-full lg:basis-[70%] text-base text-primary-700 font-normal">
          <div>{site.desceription}</div>
          {site.features.length > 0 && (
            <>
              <h3 className="my-6 font-bold text-2xl text-primary-800">
                {t("topFeatures")}
              </h3>
              <ol>
                {site.features.map((item, i) => (
                  <ListItem key={i}>{item}</ListItem>
                ))}
              </ol>
            </>
          )}
          {site.usecases.length > 0 && (
            <>
              <h3 className="my-6 font-bold text-2xl text-primary-800">
                {t("usecases")}
              </h3>
              <ol>
                {site.usecases.map((item, i) => (
                  <ListItem key={i}>{item}</ListItem>
                ))}
              </ol>
            </>
          )}
          {site.links &&
            Object.values(site.links).filter(Boolean).length > 0 && (
              <>
                <h3 className="my-6 font-bold text-2xl text-primary-800">
                  {t("links")}
                </h3>
                <ol>
                  {site.links.login && (
                    <ListItem>
                      <Link
                        className="hover:underline"
                        href={site.links.login}
                        target="_blank"
                      >
                        {t("loginPage")}: {site.links.login}
                      </Link>
                    </ListItem>
                  )}
                  {site.links.register && (
                    <ListItem>
                      <Link
                        className="hover:underline"
                        href={site.links.register}
                        target="_blank"
                      >
                        {t("registerPage")}: {site.links.register}
                      </Link>
                    </ListItem>
                  )}
                  {site.links.documentation && (
                    <ListItem>
                      <Link
                        className="hover:underline"
                        href={site.links.documentation}
                        target="_blank"
                      >
                        {t("docPage")}: {site.links.documentation}
                      </Link>
                    </ListItem>
                  )}
                  {site.links.pricing && (
                    <ListItem>
                      <Link
                        className="hover:underline"
                        href={site.links.pricing}
                        target="_blank"
                      >
                        {t("pricingPage")}: {site.links.pricing}
                      </Link>
                    </ListItem>
                  )}
                </ol>
              </>
            )}
        </div>
      </div>
      <div className="mx-auto max-w-full w-[720px] gap-6">
        <Divider className="mt-12 mb-8 bg-primary-300" />
        <div className="flex gap-6 items-center justify-center">
          <Link href={site.url} target="_blank">
            <Button
              className="w-56 font-semibold"
              color="primary"
              radius="sm"
              variant="bordered"
            >
              <Navigation size={14} strokeWidth={3} />
              {t("visitSite")}
            </Button>
          </Link>
          <VoteButton site={site} />
        </div>
      </div>
    </div>
  );
}
