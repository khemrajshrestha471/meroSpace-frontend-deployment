"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { decodeToken } from "@/components/utils/decodeToken.js";
import Navbar from "@/admin-components/Navbar/Navbar";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  // PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface DecodedToken {
  username: string;
  role: string;
  userId: string;
}

type UploadedFeedback = {
  _id: string;
  sentiment: string;
  title: string;
  feedback: string;
};

const Page = () => {
  const [expiryTime, setExpiryTime] = useState<number | null>(null);
  const [isUserId, setIsUserId] = useState<string>("");
  const [data, setData] = useState<UploadedFeedback[]>([]);
  const [isDecodedToken, setIsDecodedToken] = useState<DecodedToken | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const router = useRouter();

  // Check for token and initialize states
  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    try {
      const decodedToken = decodeToken(token);
      setIsDecodedToken(decodedToken);

      if (decodedToken?.exp) setExpiryTime(decodedToken.exp);

      if (decodedToken?.userId) {
        const queryParams = new URLSearchParams(window.location.search);
        const urlUserId = queryParams.get("Id") || "";

        if (urlUserId !== decodedToken.userId) {
          router.push(
            `/control/admin-role/view-feedback?username=${decodedToken.username}&role=${decodedToken.role}&Id=${decodedToken.userId}`
          );
        } else {
          setIsUserId(decodedToken.userId);
        }
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      console.error("Token:", isDecodedToken);
      localStorage.removeItem("token");
      router.push("/");
    }
  }, [router]);

  // Fetch feedback data
  useEffect(() => {
    if (!isUserId) return;

    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://mero-space-backend-deployment.vercel.app/uploaded-feedback`
        );
        if (!response.ok) throw new Error("Failed to fetch feedback data");

        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [isUserId]);

  // Check token expiry
  useEffect(() => {
    if (expiryTime) {
      const interval = setInterval(() => {
        if (Date.now() / 1000 > expiryTime) {
          localStorage.removeItem("token");
          router.push("/");
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [expiryTime, router]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <>
      <Navbar />
      <div className="p-4 w-full overflow-hidden">
        <ul className="flex flex-wrap justify-center gap-4">
          {currentItems.map((item) => (
            <li
              key={item._id}
              className="flex-shrink-0 w-full sm:w-1/2 md:w-2/5 lg:w-1/4 xl:w-1/5"
            >
              <Card className="flex flex-col overflow-hidden">
                <div className="flex-grow"></div>
                <CardHeader className="flex flex-col p-2">
                  <CardTitle
                    className={`font-semibold pl-1 ${
                      item.sentiment === "Satisfied"
                        ? "text-green-500"
                        : item.sentiment === "Neutral"
                        ? "text-yellow-500"
                        : item.sentiment === "Dissatisfied"
                        ? "text-red-500"
                        : ""
                    }`}
                  >
                    {item.sentiment}
                  </CardTitle>
                  <div className="flex justify-between items-center pl-1">
                    <CardDescription className="font-bold">
                      {item.title}
                    </CardDescription>
                  </div>
                  <CardDescription className="text-gray-600 pl-1">
                    Feedback: {item.feedback}
                  </CardDescription>
                </CardHeader>
              </Card>
            </li>
          ))}
        </ul>
      </div>
      {data.length > 0 && (
        <div className="flex justify-center mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
                  }}
                  className="no-underline"
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(index + 1);
                    }}
                    isActive={currentPage === index + 1}
                    className="no-underline"
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages)
                      setCurrentPage((prev) => prev + 1);
                  }}
                  className="no-underline"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
};

export default Page;
