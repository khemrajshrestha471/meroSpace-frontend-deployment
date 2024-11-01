import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import dynamic from "next/dynamic";
// import Navbar from "@/components/Navbar";
const DynamicNavbar = dynamic(() => import('@/components/Navbar'), {
  ssr: false, // This prevents server-side rendering for this component
});
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "meroSpace - Search, Compare & Rent Rooms Instantly",
  description: "meroSpace is your go-to platform for finding and renting rooms effortlessly. Compare listings, explore amenities, and discover your ideal space quickly—all in one place. Experience hassle-free room hunting with meroSpace!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <DynamicNavbar />
        {children}
      </body>
    </html>
  );
}
