"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { decodeToken } from "@/components/utils/decodeToken.js";

import { Button } from "@/components/ui/button";
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
import Link from "next/link";

type UploaderData = {
  id: string;
  unique_id: string;
  headline: string;
  description: string;
  tentative_price: string;
};

interface DecodedToken {
  username: string;
  role: string;
  userId: string;
}

const page = () => {
  const [expiryTime, setExpiryTime] = useState(0);
  const [isUserId, setIsUserId] = useState("");
  const [data, setData] = useState<UploaderData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [isdecodedToken, setIsDecodedToken] = useState<DecodedToken | null>(
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
              `/dashboard-uploader/view-requirements?username=${decodedToken.username}&role=${decodedToken.role}&Id=${decodedToken.userId}`
            );
          }
        }

        const fetchData = async () => {
          if (!isUserId) {
            return;
          }
          try {
            const response = await fetch(
              `https://mero-space-backend-deployment.vercel.app/uploaded-requirement-data`
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
        // In case of an invalid token, redirect to login
        router.push("/login-as-uploader");
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
        router.push("/login-as-uploader");
      }
    }
  }, [expiryTime, router]);

  // Calculate the current items to display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate total pages
  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <>
      <div className="p-4 w-full overflow-hidden">
        <ul className="flex flex-wrap justify-start gap-4">
          {currentItems.map((item) => (
            <li
              key={item.unique_id}
              className="flex-shrink-0 w-full sm:w-1/2 md:w-2/5 lg:w-1/4 xl:w-1/5"
            >
              <Card className="flex flex-col overflow-hidden">
                <div className="flex-grow">
                </div>
                <CardHeader className="flex flex-col p-2">
                  <CardTitle className="truncate font-semibold pl-1">
                    {item.headline}
                  </CardTitle>
                  <CardDescription className="truncate text-gray-600 pl-1">
                    {item.description}
                  </CardDescription>
                  <div className="flex justify-between items-center pl-1">
                    <CardDescription className="truncate font-bold">
                    Tentative Price: {item.tentative_price}
                    </CardDescription>
                    <Link
                      href={`/dashboard-uploader/view-requirements/${item.unique_id}?username=${isdecodedToken?.username}&role=${isdecodedToken?.role}&Id=${isdecodedToken?.userId}&Pid=${item.unique_id}`}
                    >
                      <Button className="ml-2">View</Button>
                    </Link>
                  </div>
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
                (currentPage < totalPages - 2 && pageNumber === totalPages - 2)
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
    </>
  );
};

export default page;
