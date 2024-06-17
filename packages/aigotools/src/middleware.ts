import createMiddleware from "next-intl/middleware";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

import { localePrefix, locales } from "./navigation";
import { AvailableLocales } from "./lib/locales";
import { AppConfig } from "./lib/config";

const intlMiddleware = createMiddleware({
  locales: locales,
  defaultLocale: AvailableLocales[0],
  localePrefix: localePrefix,
});

const isManageRoute = createRouteMatcher(["/(.*)/dashboard"]);

const isUserRoute = createRouteMatcher(["/(.*)/submit"]);

export default clerkMiddleware(
  (auth, req) => {
    if (isUserRoute(req)) auth().protect();

    if (isManageRoute(req)) {
      const { userId, redirectToSignIn } = auth();

      if (!userId || !AppConfig.manageUsers.includes(userId)) {
        return redirectToSignIn();
      }
    }

    const nextPathname = req.nextUrl.pathname;

    if (/^\/(api|trpc|sitemap)/.test(nextPathname)) {
      return;
    }

    return intlMiddleware(req);
  },
  { debug: AppConfig.debugClerk }
);

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
