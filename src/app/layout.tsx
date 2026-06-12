import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});


export const metadata: Metadata = {
  metadataBase: new URL("https://capedoimpex.co.uk"),

  title: "Capedo Impex | Fresh Fruits, Vegetables & Export Products",

  description:
    "Capedo Impex supplies premium fruits, vegetables, herbs, leafy greens, flowers and agricultural products for wholesale and export markets.",

  icons: {
    icon: "https://ngxvldjiebyuuamxcpwi.supabase.co/storage/v1/object/public/items/capedo-logo.png",
  },

  openGraph: {
    title: "Capedo Impex",
    description:
      "Premium fruits, vegetables, herbs, flowers and agricultural products for export and wholesale distribution.",
    url: "https://capedoimpex.co.uk",
    siteName: "Capedo Impex",
    images: [
      {
        url: "https://ngxvldjiebyuuamxcpwi.supabase.co/storage/v1/object/public/items/capedo-logo.png",
        width: 1200,
        height: 630,
        alt: "Capedo Impex",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Capedo Impex",
    description:
      "Premium fruits, vegetables, herbs, flowers and agricultural products for export and wholesale distribution.",
    images: [
      "https://ngxvldjiebyuuamxcpwi.supabase.co/storage/v1/object/public/items/capedo-logo.png",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} font-sans bg-background text-on-surface font-body-md`}>
        {children}
      </body>
    </html>
  );
}
