import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AnalyticsProvider } from "@/components/providers/AnalyticsProvider";
import { AnalyticsHub } from "@/components/analytics/AnalyticsHub";
import { getThemeScript } from "@/lib/theme-persistence";
import { Header } from "@/components/layouts/Header";
import { Footer } from "@/components/layouts/Footer";
import { PageTransition } from "@/components/animations/PageTransition";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { LoadingProvider } from "@/components/providers/LoadingProvider";
import { SkipLinks } from "@/components/accessibility/SkipLinks";
import { AriaLiveRegions } from "@/components/accessibility/AriaLiveRegions";
import { AccessibilityValidator } from "@/components/accessibility/AccessibilityValidator";
import { KeyboardNavigationProvider } from "@/components/accessibility/KeyboardNavigationProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// SEO Metadata
export const metadata: Metadata = {
  title: {
    default:
      "Elite Developer Portfolio | Full-Stack Developer & UI/UX Designer",
    template: "%s | Elite Developer Portfolio",
  },
  description:
    "Professional portfolio showcasing cutting-edge web development projects, advanced technical skills, and innovative solutions. Specializing in React, Next.js, TypeScript, and modern web technologies.",
  keywords: [
    "Full-Stack Developer",
    "React Developer",
    "Next.js Expert",
    "TypeScript",
    "Frontend Development",
    "Backend Development",
    "UI/UX Design",
    "Web Development",
    "JavaScript",
    "Portfolio",
    "Software Engineer",
  ],
  authors: [{ name: "Elite Developer" }],
  creator: "Elite Developer",
  publisher: "Elite Developer Portfolio",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://elite-dev-portfolio.vercel.app"
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Elite Developer Portfolio | Full-Stack Developer & UI/UX Designer",
    description:
      "Professional portfolio showcasing cutting-edge web development projects and advanced technical skills.",
    siteName: "Elite Developer Portfolio",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Elite Developer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Elite Developer Portfolio | Full-Stack Developer & UI/UX Designer",
    description:
      "Professional portfolio showcasing cutting-edge web development projects and advanced technical skills.",
    images: ["/og-image.jpg"],
    creator: "@elitedev",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

// Structured Data
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Elite Developer",
  jobTitle: "Full-Stack Developer & UI/UX Designer",
  description:
    "Professional full-stack developer specializing in modern web technologies and innovative digital solutions.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://elite-dev-portfolio.vercel.app",
  sameAs: [
    "https://github.com/elitedev",
    "https://linkedin.com/in/elitedev",
    "https://twitter.com/elitedev",
  ],
  knowsAbout: [
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Python",
    "Web Development",
    "UI/UX Design",
    "Software Engineering",
  ],
  alumniOf: {
    "@type": "Organization",
    name: "Tech University",
  },
  worksFor: {
    "@type": "Organization",
    name: "Freelance",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: getThemeScript(),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <ErrorBoundary>
          <ThemeProvider
            defaultTheme="light"
            enableSystem={true}
            storageKey="portfolio-theme"
          >
            <AnalyticsProvider>
              <LoadingProvider>
                <KeyboardNavigationProvider>
                  {/* Skip links for keyboard navigation */}
                  <SkipLinks />

                  {/* ARIA live regions for dynamic announcements */}
                  <AriaLiveRegions />

                  {/* Main page structure with semantic HTML and ARIA landmarks */}
                  <div className="flex flex-col min-h-screen">
                    <Header />
                    <main
                      id="main-content"
                      role="main"
                      aria-label="Main content"
                      className="flex-1 pt-16 lg:pt-20"
                    >
                      <PageTransition>{children}</PageTransition>
                    </main>
                    <Footer />
                  </div>
                  <AnalyticsHub />

                  {/* Development-only accessibility validator */}
                  <AccessibilityValidator />
                </KeyboardNavigationProvider>
              </LoadingProvider>
            </AnalyticsProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
