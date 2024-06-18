import { MetadataRoute } from "next";

import dbConnect from "@/lib/db-connect";
import { SiteModel } from "@/models/site";
import { SiteState } from "@/lib/constants";
import { AvailableLocales } from "@/lib/locales";
import { AppConfig } from "@/lib/config";

const perSitemapCount = 2000;

export async function generateSitemaps() {
  await dbConnect();

  const siteCount = await SiteModel.countDocuments({
    state: SiteState.published,
  });

  const siteMapCount = Math.ceil(siteCount / perSitemapCount);

  const siteMapIds = new Array(siteMapCount).fill(0).map((_, id) => {
    return {
      id,
    };
  });

  return [{ id: -1 }, ...siteMapIds];
}

export default async function sitemap({ id }: { id: number }) {
  const sitemapRoutes: MetadataRoute.Sitemap = [];

  if (id === -1) {
    // base page sitemap
    sitemapRoutes.push(
      {
        url: "",
        lastModified: new Date(),
        changeFrequency: "hourly",
        priority: 1,
      },
      {
        url: "categories",
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.5,
      },
      {
        url: "search",
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.5,
      },
      {
        url: "submit",
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.5,
      }
    );
  } else {
    // sites page site map
    await dbConnect();

    const siteKeyObjs = await SiteModel.find(
      {
        state: SiteState.published,
      },

      {
        _id: 0,
        siteKey: 1,
      }
    )
      .skip(id * perSitemapCount)
      .limit(perSitemapCount)
      .lean();

    sitemapRoutes.push(
      ...siteKeyObjs.map(({ siteKey }) => {
        return {
          url: `s/${siteKey}`,
          lastModified: new Date(),
          changeFrequency: "monthly" as const,
          priority: 0.9,
        };
      })
    );
  }

  const sitemapData = sitemapRoutes.flatMap((route) =>
    AvailableLocales.map((locale) => {
      return {
        ...route,
        url: [AppConfig.siteUrl, locale, route.url].filter(Boolean).join("/"),
      };
    })
  );

  return sitemapData;
}
