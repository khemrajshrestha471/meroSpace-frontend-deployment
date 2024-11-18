"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { decodeToken } from "@/components/utils/decodeToken.js";
import Navbar from "@/admin-components/Navbar/Navbar";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DecodedToken {
  username: string;
  role: string;
  userId: string;
}

type UploadedTestimonial = {
  _id: string;
  testimonial: string;
  name: string;
  role: string;
  imageUrl: string;
  location: string;
};

const Page = () => {
  // const pathname = usePathname();
  const [expiryTime, setExpiryTime] = useState(0);
  const [isUserId, setIsUserId] = useState("");
  // const [isUserIdJwt, setIsUserIdJwt] = useState("");
  const [isDecodedToken, setIsDecodedToken] = useState<DecodedToken | null>(
    null
  );

  const [data, setData] = useState<UploadedTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
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
              `/controller/admin/upload-testimonial?username=${decodedToken.username}&role=${decodedToken.role}&Id=${decodedToken.userId}`
            );
          }
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        console.error("Token:", isDecodedToken)
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://mero-space-backend-deployment.vercel.app/get-all-testimonial"
        );
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  // Calculate the current items to display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate total pages
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const FailedDeleteTestimonial= () => {
    toast.error("Failed to delete testimonial. Please try again.", {
      draggable: true,
      theme: "colored",
    });
  };


  const deleteThisTestimonial = async (_id: string) => {
    try {
      const response = await fetch(
        `https://mero-space-backend-deployment.vercel.app/delete-unique-testimonial/${_id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        window.location.reload();
      } else {
        await response.json();
        FailedDeleteTestimonial();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />
      <p>Create form to upload testimonial</p>

      <div className="w-full overflow-hidden pr-8 pt-4">
        <ul className="flex flex-wrap justify-center gap-4">
          {currentItems.map((item) => (
            <li
              key={item._id}
              className="flex-shrink-0 w-full sm:w-1/2 md:w-2/5 lg:w-1/4 xl:w-1/5"
            >
              <Card className="flex flex-col items-center p-4 h-81 max-h-81 overflow-hidden relative">
                <CardHeader className="text-center p-0 flex-grow">
                  <CardDescription
                    className="text-black mb-2 text-center h-40 overflow-hidden text-ellipsis"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {item.testimonial}
                  </CardDescription>
                </CardHeader>
                <div className="flex justify-center mb-2">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-20 w-20 object-cover rounded-full border-4 border-blue-400"
                  />
                  <div className="absolute top-0 right-0 bg-blue-500 text-white font-semibold text-xs px-4 py-1 rounded-tr-lg rounded-bl-lg">
                    {item.role}
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger
                      asChild
                      className="absolute bottom-0 left-0 bg-red-500 text-white font-semibold text-xs px-4 py-1 rounded-tr-lg rounded-bl-lg"
                    >
                      <div className="cursor-pointer absolute bottom-0 left-0 bg-red-500 text-white font-semibold text-xs px-4 py-1 rounded-tr-lg rounded-bl-lg">
                        Delete
                      </div>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Really want to delete this testimonial?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undo and will permanently
                          delete this testimonial from our database.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button
                          variant="destructive"
                          onClick={() => deleteThisTestimonial(item._id)}
                        >
                          Continue
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <CardHeader className="text-center p-1">
                  <CardDescription className="font-bold text-black text-lg mb-0">
                    {item.name}
                  </CardDescription>
                  <CardDescription className="text-gray-600 text-sm">
                    {item.location}
                  </CardDescription>
                </CardHeader>
              </Card>
            </li>
          ))}
          <ToastContainer />
        </ul>
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

                {/* Render pagination numbers */}
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
    </>
  );
};

export default Page;