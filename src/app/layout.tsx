import type { Metadata } from "next";
import { AuthProvider } from "@/components/AuthProvider";
import { BRAND, themeCss } from "@/lib/brand";
import "./globals.css";

export const metadata: Metadata = {
  title: `${BRAND.name} | ${BRAND.tagline}`,
  description: BRAND.description,
  ...(BRAND.icon ? { icons: { icon: BRAND.icon } } : {}),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><head><style>{themeCss(BRAND.colors)}</style></head><body><AuthProvider>{children}</AuthProvider></body></html>;
}
