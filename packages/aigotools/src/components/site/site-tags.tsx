"use client";
import { useMemo } from "react";
import { useTranslations } from "next-intl";
import clsx from "clsx";

import { Site } from "@/models/site";
import { useRouter } from "@/navigation";

export default function SiteTags({ site }: { site: Site }) {
  const t = useTranslations("site");

  const router = useRouter();

  const groupTags = useMemo(() => {
    const gt = [];

    if (site.categories?.length) {
      gt.push({
        title: t("categories"),
        tags: site.categories,
      });
    }
    if (site.users?.length) {
      gt.push({
        title: t("users"),
        tags: site.users,
      });
    }
    if (site.pricings?.length) {
      gt.push({
        title: t("pricings"),
        tags: site.pricings,
      });
    }
    if (site.relatedSearchs?.length) {
      gt.push({
        title: t("relatedSearchs"),
        tags: site.relatedSearchs,
        onClick: (item: string) => {
          router.push(`/search?s=${encodeURIComponent(item)}`);
        },
      });
    }

    return gt;
  }, [
    router,
    site.categories,
    site.pricings,
    site.relatedSearchs,
    site.users,
    t,
  ]);

  return (
    <>
      {groupTags.map((gt, index) => {
        return (
          <div key={index} className="mt-6">
            <div className="text-medium font-bold text-primary-800">
              {gt.title}
            </div>
            <div className="flex flex-wrap mt-4 gap-2">
              {gt.tags.map((t, ti) => (
                <span
                  key={ti}
                  className={clsx(
                    "text-[12px] font-light py-[2px] px-2 rounded-[3px] bg-primary-700 text-primary-200 inline-block",
                    {
                      "cursor-pointer": !!gt.onClick,
                    },
                  )}
                  onClick={() => gt.onClick?.(t)}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}
