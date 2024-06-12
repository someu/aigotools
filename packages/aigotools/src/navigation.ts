import { createSharedPathnamesNavigation } from "next-intl/navigation";

import { AvailableLocales } from "@/lib/locales";

export const locales = AvailableLocales;
export const localePrefix = "always"; // Default

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales, localePrefix });
