import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0B1911",
};

export const metadata: Metadata = {
  title: "KisanLens — Smart Farming, Zero Text",
  description:
    "Zero-Text, Voice-and-Vision Smart Agricultural System for Indian Farmers. AI-powered crop disease detection, pesticide dosage calculator, soil advisor, and APMC mandi price intelligence.",
  keywords: ["agriculture", "farming", "AI", "crop disease", "India", "Karnataka", "KisanLens"],
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-forest-bg text-gray-200 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
