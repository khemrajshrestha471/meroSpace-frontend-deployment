"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

// Dynamically import components
const DynamicNavbar = dynamic(() => import('@/components/Navbar'), {
  ssr: false, // This prevents server-side rendering for this component
});
const Footer = dynamic(() => import('@/components/footer/Footer'), {
  ssr: false, // This prevents server-side rendering for this component
});

export default function ClientWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // Check if the current route is for admin
  const isAdminPage = pathname.startsWith("/controller/admin");

  return (
    <>
      {!isAdminPage && <DynamicNavbar />}
      {children}
      {!isAdminPage && <Footer />}
    </>
  );
}
