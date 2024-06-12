import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

import { AvailableLocales } from "@/lib/locales";

export default getRequestConfig(async ({ locale }) => {
  if (!AvailableLocales.includes(locale as any)) notFound();

  return {
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
