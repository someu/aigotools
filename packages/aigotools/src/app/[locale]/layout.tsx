import { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider } from "next-themes";
import { ClerkProvider } from "@clerk/nextjs";

import ThemeToastContainer from "@/components/common/theme-toast-container";
import { AppConfig } from "@/lib/config";
import UseQueryProvider from "@/components/common/use-query-provider";

export async function generateMetadata({
  params: { locale },
}: any): Promise<Metadata> {
  const t = await getTranslations({ locale });

  return {
    title: {
      template: `%s | ${t("metadata.title")}`,
      default: t("metadata.title"),
    },
    description: t("metadata.description"),
    keywords: t("metadata.keywords"),
    generator: AppConfig.appGenerator,
    applicationName: AppConfig.siteName,
    authors: [{ name: AppConfig.appGenerator, url: AppConfig.appGeneratorUrl }],
    creator: AppConfig.appGenerator,
    publisher: AppConfig.appGenerator,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <ClerkProvider>
      <html lang={locale}>
        <body>
          <main className="text-primary">
            <NextIntlClientProvider messages={messages}>
              <NextUIProvider aria-disabled>
                <ThemeProvider attribute="class">
                  <UseQueryProvider> {children}</UseQueryProvider>
                  <ThemeToastContainer />
                </ThemeProvider>
              </NextUIProvider>
            </NextIntlClientProvider>
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
