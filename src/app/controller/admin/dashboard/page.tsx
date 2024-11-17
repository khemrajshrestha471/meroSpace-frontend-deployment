"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { decodeToken } from "@/components/utils/decodeToken.js";
import Navbar from "@/admin-components/Navbar/Navbar"

interface DecodedToken {
  username: string;
  role: string;
  userId: string;
}

const Page = () => {
  const [expiryTime, setExpiryTime] = useState(0);
  const [isUserId, setIsUserId] = useState("");
  const [isDecodedToken, setIsDecodedToken] = useState<DecodedToken | null>(
    null
  );

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
      router.push("/");
    } else {
      try {
        const decodedToken = decodeToken(token);
        setIsDecodedToken(decodedToken);
        if (decodedToken && decodedToken.exp) {
          setExpiryTime(decodedToken.exp);
        }
        if (decodedToken && decodedToken.username && decodedToken.userId) {
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
              `/controller/admin/dashboard?username=${decodedToken.username}&role=${decodedToken.role}&Id=${decodedToken.userId}`
            );
          }
        }

        const urlPath = window.location.pathname;
        const roleFromPath = urlPath.split("-")[1];
        if (roleFromPath !== decodedToken.role) {
          router.push(
            `/controller/admin/dashboard?username=${decodedToken.username}&role=${decodedToken.role}&Id=${decodedToken.userId}`
          );
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        console.error("Token:", isDecodedToken);

        // In case of an invalid token, redirect to login
        router.push("/");
      }
    }
    // Token expiry check
    if (expiryTime > 0) {
      const currentTime = Date.now() / 1000;
      if (expiryTime < currentTime) {
        localStorage.removeItem("token");
        router.push("/");
      }
    }
  }, [router, isUserId]);

  return (
    <>
    <Navbar />
    <h1>Admin Dashboard</h1>
    <p>Make proper dashboard so that admin can see total uploader and seeker till the date with something graph</p>
    </>
  );
};

export default Page;