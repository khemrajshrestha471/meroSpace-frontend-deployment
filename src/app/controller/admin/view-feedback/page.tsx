"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { decodeToken } from "@/components/utils/decodeToken.js";
import Navbar from "@/admin-components/Navbar/Navbar";
import SentimentPieChart from "./SentimentPieChart";

interface DecodedToken {
  username: string;
  role: string;
  userId: string;
}

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type UploadedFeedback = {
  _id: string;
  sentiment: string;
  title: string;
  feedback: string;
};

const Page = () => {
  // const pathname = usePathname();
  const [expiryTime, setExpiryTime] = useState(0);
  const [isUserId, setIsUserId] = useState("");
  const [data, setData] = useState<UploadedFeedback[]>([]);
  // const [isUserIdJwt, setIsUserIdJwt] = useState("");
  const [isDecodedToken, setIsDecodedToken] = useState<DecodedToken | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  // const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    const isFirstRender = localStorage.getItem("firstRender");
    if (isFirstRender) {
      // Refresh the page
      window.location.reload();

      // Remove the flag to prevent future refreshes
      localStorage.removeItem("firstRender");
    }
    // setCurrentPath(pathname.split("/").slice(-1)[0]);
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
        // setIsUserIdJwt(decodedToken.userId);
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
              `/controller/admin/view-feedback?username=${decodedToken.username}&role=${decodedToken.role}&Id=${decodedToken.userId}`
            );
          }
        }
        const fetchData = async () => {
          if (!isUserId) {
            return;
          }
          try {
            const response = await fetch(
              `https://mero-space-backend-deployment.vercel.app/uploaded-feedback`
            );
            const result = await response.json();
            setData(result);
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };

        fetchData();
      } catch (error) {
        console.error("Error decoding token:", error);
        console.error("Token:", isDecodedToken);
        // In case of an invalid token, redirect to login
        router.push("/");
      }
    }
  }, [router, isUserId]);

  // Check if the token has expired
  useEffect(() => {
    if (expiryTime > 0) {
      const currentTime = Date.now() / 1000;

      if (expiryTime < currentTime) {
        // If token is expired, redirect to login
        localStorage.removeItem("token");
        router.push("/");
      }
    }
  }, [expiryTime, router]);

  var satisfiedCount = 0;
  var neutralCount = 0;
  var dissatisfiedCount = 0;

  data.forEach((item) => {
    if (item.sentiment === "Satisfied") {
      satisfiedCount++;
    } else if (item.sentiment === "Neutral") {
      neutralCount++;
    } else if (item.sentiment === "Dissatisfied") {
      dissatisfiedCount++;
    }
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <>
      <Navbar />
      <div>
        <div className="w-full overflow-hidden pr-8 pt-4">
          <ul className="flex flex-wrap justify-center gap-4">
            {currentItems.map((item) => (
              <li
                key={item._id}
                className="flex-shrink-0 w-full sm:w-1/2 md:w-2/5 lg:w-1/4 xl:w-1/5"
              >
                <Card className="flex flex-col overflow-hidden h-[35vh]">
                  <div className="flex-grow"></div>
                  <CardHeader className="flex flex-col p-2">
                    <CardTitle
                      className={`font-semibold text-center pl-1 ${
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
                    <div className="flex justify-center items-center pl-1">
                      <CardDescription className="font-bold text-center text-gray-800">
                        {item.title}
                      </CardDescription>
                    </div>
                    <CardDescription className="text-black pl-1 text-justify">
                      {item.feedback}
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
                      e.preventDefault(); // Prevent the default anchor behavior
                      if (currentPage > 1) {
                        setCurrentPage((prev) => prev - 1);
                      }
                    }}
                    className="no-underline"
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNumber = index + 1;

                  // Show ellipsis only when needed
                  if (
                    (pageNumber > 2 &&
                      currentPage > 2 &&
                      currentPage < totalPages - 1 &&
                      pageNumber === currentPage - 1) ||
                    (pageNumber < totalPages - 1 &&
                      currentPage < totalPages - 1 &&
                      pageNumber === currentPage + 1)
                  ) {
                    return null; // Skip rendering this page number
                  }

                  // Render the first two and last two pages with ellipsis in between
                  if (
                    pageNumber === 1 ||
                    pageNumber === 2 ||
                    pageNumber === totalPages - 1 ||
                    pageNumber === totalPages
                  ) {
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(pageNumber);
                          }}
                          isActive={currentPage === pageNumber}
                          className="no-underline"
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }

                  // Render ellipsis in the middle
                  if (
                    pageNumber === currentPage - 1 ||
                    pageNumber === currentPage + 1
                  ) {
                    return null; // Skip rendering the adjacent pages to avoid duplicates
                  }

                  if (
                    (currentPage > 3 && pageNumber === 3) ||
                    (currentPage < totalPages - 2 &&
                      pageNumber === totalPages - 2)
                  ) {
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationEllipsis className="text-blue-600" />
                      </PaginationItem>
                    );
                  }

                  return null; // Skip rendering other pages
                })}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault(); // Prevent the default anchor behavior
                      if (currentPage < totalPages) {
                        setCurrentPage((prev) => prev + 1);
                      }
                    }}
                    className="no-underline"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
      <div>
        <p className="text-center text-blue-500 text-3xl font-semibold">
          Sentiment Visualization
        </p>
        <SentimentPieChart
          satisfiedCount={satisfiedCount}
          neutralCount={neutralCount}
          dissatisfiedCount={dissatisfiedCount}
        />
      </div>
    </>
  );
};

export default Page;
