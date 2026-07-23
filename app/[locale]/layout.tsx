import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import PublicShell from "../PublicShell";
import SetHtmlLang from "./SetHtmlLang";
import { routing } from "@/i18n/routing";
import { getWebsiteDisplayEnabled } from "@/lib/site-settings";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  const title = t("title");
  const description = t("description");
  const path = locale === routing.defaultLocale ? "" : `/${locale}`;

  return {
    title,
    description,
    keywords: t("keywords"),
    authors: [{ name: "TJ Renovatie" }],
    alternates: {
      canonical: `https://tj-renovatie.nl${path}`,
      languages: {
        nl: "https://tj-renovatie.nl",
        en: "https://tj-renovatie.nl/en",
      },
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://tj-renovatie.nl${path}`,
      siteName: "TJ Renovatie",
      locale: locale === "en" ? "en_US" : "nl_NL",
      images: [
        {
          url: "https://tj-renovatie.nl/favicon.ico",
          width: 512,
          height: 512,
          alt: "TJ Renovatie Logo",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: "@tjrenovatie",
      creator: "@tjrenovatie",
      images: ["https://tj-renovatie.nl/logo.svg"],
    },
  };
}

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const isWebsiteEnabled = await getWebsiteDisplayEnabled();

  return (
    <NextIntlClientProvider>
      <SetHtmlLang locale={locale} />
      <PublicShell isWebsiteEnabled={isWebsiteEnabled}>
        {children}
      </PublicShell>
    </NextIntlClientProvider>
  );
}
