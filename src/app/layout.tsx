import "./globals.css";
import type { Metadata } from "next";
import { Layout, FixedPlugin } from "@/components";
import { AppProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "NextJS Tailwind Campaign Page",
  description:
    "Introducing Tailwind Campaign Page, an all-inclusive and visually captivating campaign landing page template built on the foundation of Tailwind CSS and Material Tailwind.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          defer
          data-site="YOUR_DOMAIN_HERE"
          src="https://api.nepcha.com/js/nepcha-analytics.js"
        ></script>
        <link rel="shortcut icon" href="/favicon.png" type="image/png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans">
        <Layout>
          <AppProvider>
            {children}
            <FixedPlugin />
          </AppProvider>
        </Layout>
      </body>
    </html>
  );
}
