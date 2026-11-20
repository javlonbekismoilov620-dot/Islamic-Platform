import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource/amiri-quran";
import "@fontsource-variable/noto-naskh-arabic";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { BottomTabs, TopNav } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { Providers, themeBootstrap } from "@/components/layout/providers";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: `${siteConfig.name} — ${siteConfig.tagline}`, template: `%s — ${siteConfig.name}` },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: ["Qurʼon", "namoz", "duolar", "zikr", "hadis", "Hanafiy", "islom", "oʻzbek", "tahorat", "namoz vaqtlari"],
  openGraph: { type: "website", locale: siteConfig.locale, siteName: siteConfig.name, title: siteConfig.name, description: siteConfig.description },
  twitter: { card: "summary_large_image", title: siteConfig.name, description: siteConfig.description },
  appleWebApp: { capable: true, title: siteConfig.name, statusBarStyle: "default" },
  formatDetection: { telephone: false },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f6f3ec",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body>
        <a href="#asosiy" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:bg-primary focus:px-4 focus:py-2 focus:text-on-primary">
          Asosiy mazmunga oʻtish
        </a>
        <Providers>
          <TopNav />
          <main id="asosiy" className="main-pad mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6 sm:pt-10">
            {children}
          </main>
          <Footer />
          <BottomTabs />
        </Providers>
      </body>
    </html>
  );
}
