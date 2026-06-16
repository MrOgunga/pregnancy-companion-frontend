import type { Metadata, Viewport } from "next";
import "./globals.css";
import RegisterSW from "./_components/RegisterSW";

export const metadata: Metadata = {
  title: "Bumply — Your AI Pregnancy Companion",
  description:
    "Personalised weekly pregnancy updates, fetal development, meal plans and emotional support — delivered by your AI companion, Bumply.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Bumply", statusBarStyle: "default" },
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#F4A7B9",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=DM+Sans:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <RegisterSW />
      </body>
    </html>
  );
}
