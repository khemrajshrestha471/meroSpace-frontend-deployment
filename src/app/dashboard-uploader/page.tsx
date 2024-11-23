"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { decodeToken } from "@/components/utils/decodeToken.js";
import { FaArrowRight } from "react-icons/fa";
import Link from "next/link";

interface DecodedToken {
  username: string;
  role: string;
  userId: string;
}
import LandingPage from "@/components/landingPage/LandingPage";
import Products from "@/components/products/Products";
import Faqs from "@/components/faqs/Faqs";
import Testimonial from "@/components/testimonial/Testimonial";
import AboutUs from "@/components/about-us/AboutUs";

const Page = () => {
  const [expiryTime, setExpiryTime] = useState(0);
  const [isUserId, setIsUserId] = useState("");
  const [isDecodedToken, setIsDecodedToken] = useState<DecodedToken | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isFirstRender = localStorage.getItem("firstRender");
    if (isFirstRender) {
      // Refresh the page
      window.location.reload();

      // Remove the flag to prevent future refreshes
      localStorage.removeItem("firstRender");
    }
  }, []);
  const router = useRouter();

  // Check if the user is authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login-as-uploader");
    } else {
      try {
        const decodedToken = decodeToken(token);
        setIsDecodedToken(decodedToken);
        if (decodedToken && decodedToken.exp) {
          setExpiryTime(decodedToken.exp);
        }
        if (decodedToken && decodedToken.username && decodedToken.userId) {
          // Redirect to the URL format with query params if not already there
          const queryParams = new URLSearchParams(window.location.search);
          const u_id = queryParams.get("Id") || "";
          setIsUserId(u_id);
          // Check if the query parameters already exist in the URL
          const urlUsername = queryParams.get("username") || "";
          const urlRole = queryParams.get("role") || "";
          const urlId = queryParams.get("Id") || "";
          if (
            !queryParams.has("username") ||
            !queryParams.has("role") ||
            !queryParams.has("Id") ||
            urlUsername !== decodedToken.username ||
            urlRole !== decodedToken.role ||
            urlId !== decodedToken.userId
          ) {
            router.push(
              `/dashboard-uploader?username=${decodedToken.username}&role=${decodedToken.role}&Id=${decodedToken.userId}`
            );
          }
        }
        const urlPath = window.location.pathname;
        const roleFromPath = urlPath.split("-")[1];
        if (roleFromPath !== decodedToken.role) {
          router.push(
            `/dashboard-seeker?username=${decodedToken.username}&role=${decodedToken.role}&Id=${decodedToken.userId}`
          );
        }
        const fetchData = async () => {
          if (!isUserId) {
            return;
          }
          try {
            const response = await fetch(
              "https://mero-space-backend-deployment.vercel.app/get-all-data"
            );
            await response.json();
            setLoading(false);
          } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
          }
        };

        fetchData();
      } catch (error) {
        console.error("Error decoding token:", error);
        console.error("Token:", isDecodedToken);
        // In case of an invalid token, redirect to login
        router.push("/login-as-uploader");
      }
    }
    // Token expiry check
    if (expiryTime > 0) {
      const currentTime = Date.now() / 1000;
      if (expiryTime < currentTime) {
        localStorage.removeItem("token");
        router.push("/login-as-uploader");
      }
    }
  }, [router, isUserId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <LandingPage />
      <Products />
      <div className="flex justify-end max-w-7xl">
        <Link
          href="/view-more-products"
          className="text-blue-500 no-underline font-semibold flex items-center gap-1"
        >
          View More <FaArrowRight />
        </Link>
      </div>
      <Faqs />
      <Testimonial />
      <AboutUs />
    </>
  );
};

export default Page;
