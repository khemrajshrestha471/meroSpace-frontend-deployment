"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { decodeToken } from "@/components/utils/decodeToken.js";
import Navbar from "@/admin-components/Navbar/Navbar";
import UploaderUser from "@/admin-components/UploaderUser";
import SeekerUser from "@/admin-components/SeekerUser";
import { Button } from "@/components/ui/button";
import UploaderSeeker from "./UploaderSeeker";

interface DecodedToken {
  username: string;
  role: string;
  userId: string;
}

type UploadedAllUser = {
  _id: string;
  username: string;
  email: string;
  p_number: string;
  password: string;
  register_date_time: string;
};

const Page = () => {
  const [expiryTime, setExpiryTime] = useState(0);
  const [isUserId, setIsUserId] = useState("");
  const [isDecodedToken, setIsDecodedToken] = useState<DecodedToken | null>(
    null
  );
  const [showUploader, setShowUploader] = useState(true);
  const [showSeeker, setShowSeeker] = useState(false);
  const [dataSeeker, setDataSeeker] = useState<UploadedAllUser[]>([]);
  const [dataUploader, setDataUploader] = useState<UploadedAllUser[]>([]);

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

  useEffect(() => {
    const fetchDataUploader = async () => {
      try {
        const response = await fetch("https://mero-space-backend-deployment.vercel.app/get-all-uploader");
        const result = await response.json();
        setDataUploader(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDataUploader();

    const fetchDataSeeker = async () => {
      try {
        const response = await fetch("https://mero-space-backend-deployment.vercel.app/get-all-seeker");
        const result = await response.json();
        setDataSeeker(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDataSeeker();
  }, []);

  const showSeekerData = () => {
    setShowUploader(false);
    setShowSeeker(true);
  };

  const showUploaderData = () => {
    setShowUploader(true);
    setShowSeeker(false);
  };

  return (
    <>
      <Navbar />
      {showUploader && (
        <>
          <div className="flex justify-end">
            <Button
              onClick={showSeekerData}
              variant="outline"
              className="mx-3 my-2"
            >
              Show Seeker
            </Button>
          </div>

          <UploaderUser />
        </>
      )}
      {showSeeker && (
        <>
          <div className="flex justify-end">
            <Button
              onClick={showUploaderData}
              variant="outline"
              className="mx-3 my-2"
            >
              Show Uploader
            </Button>
          </div>
          <SeekerUser />
        </>
      )}
      <div>
        <p className="text-center text-blue-500 text-3xl font-semibold">
          Uploader Vs Seeker
        </p>
        <UploaderSeeker
          uploaderCount={dataUploader.length}
          seekerCount={dataSeeker.length}
        />
      </div>
    </>
  );
};

export default Page;
