import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "@/lib/providers";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { AuthProvider } from "@/provider/AuthProvider";
import LenisProvider from "@/components/LenisProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ Dynamic Metadata (Fixed for your API response)
export async function generateMetadata(): Promise<Metadata> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/setting`,
      { cache: "no-store" }
    );

    const json = await res.json();

    const site = json?.data?.[0]; 

    return {
      title: site?.siteName || "CartX",
      description: site?.about || "Vendor management website",
      icons: {
        icon: site?.siteLogo || "/logo.png",
      },
    };
  } catch (error) {
    return {
      title: "CartX",
      description: "Vendor management website",
      icons: {
        icon: "/logo.png",
      },
    };
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <Providers>
            <LenisProvider>
              {children}
            </LenisProvider>
            <Toaster position="top-right" />
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}