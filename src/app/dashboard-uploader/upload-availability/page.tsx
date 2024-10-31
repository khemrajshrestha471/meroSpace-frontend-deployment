"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { decodeToken } from "@/components/utils/decodeToken.js";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";

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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";

type UploaderData = {
  id: string;
  unique_id: string;
  headline: string;
  description: string;
  price: number;
  imageUrl: string;
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
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRefMultiple = useRef<HTMLInputElement | null>(null);
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
              `/dashboard-uploader/upload-availability?username=${decodedToken.username}&role=${decodedToken.role}&Id=${decodedToken.userId}`
            );
          }
        }
        const urlPath = window.location.pathname;
        const roleFromPath = urlPath.split("-")[1];
        if (roleFromPath !== decodedToken.role) {
          router.push(
            `/dashboard-uploader/upload-availability?username=${decodedToken.username}&role=${decodedToken.role}&Id=${decodedToken.userId}`
          );
        }

        const fetchData = async () => {
          if (!isUserId) {
            return;
          }
          try {
            const response = await fetch(
              `https://mero-space-backend-deployment.vercel.app/get-all-data/${isUserId}`
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

  const FormSchema = z.object({
    headline: z.string().min(1, "Headline is required"),
    description: z.string().min(1, "Description is required"),
    price: z.string().min(1, "Price is required"),
    image: z.instanceof(File, { message: "Thumbnail Image is required" }),
    images: z
      .array(z.instanceof(File))
      .max(4, "You can upload a maximum of 4 images")
      .optional(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      headline: "",
      description: "",
      price: "",
      image: undefined,
      images: [],
    },
  });

  const handleClear = () => {
    form.reset();
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
    if (imageInputRefMultiple.current) {
      imageInputRefMultiple.current.value = "";
    }
  };

  // Calculate the current items to display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate total pages
  const totalPages = Math.ceil(data.length / itemsPerPage);

  

  function onSubmit(data: z.infer<typeof FormSchema>) {
    let unique_id = Array(24)
      .fill(0)
      .map(() => Math.random().toString(36).charAt(2))
      .join("");

    // Create FormData to handle text and image data
    const formData = new FormData();
    formData.append("id", isUserId);
    formData.append("unique_id", unique_id);
    formData.append("headline", data.headline);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("image", data.image);

    // Append multiple images if any are selected
    if (data.images) {
      for (const file of data.images) {
        formData.append("images", file);
      }
    }

    fetch("https://mero-space-backend-deployment.vercel.app/uploader-data", {
      method: "POST",
      credentials: "include",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          window.location.reload();
          return response.json();
        } else if (response.status === 401) {
          throw new Error("Something Went Wrong.");
        } else {
          throw new Error("An unexpected error occurred. Please try again.");
        }
      })
      .then((data) => {
        if (data.token) {
          // Save the token in localStorage
          localStorage.setItem("token", data.token);
          localStorage.setItem("firstRender", "true");
          const decodedToken = decodeToken(data.token);
          router.push(
            `/dashboard-uploader?username=${decodedToken.username}&role=${decodedToken.role}&Id=${decodedToken.userId}`
          );
        }
      })
      .catch((err) => {
        alert(err.message);
      });
    form.reset();
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
    if (imageInputRefMultiple.current) {
      imageInputRefMultiple.current.value = "";
    }
  }

  return (
    <>
      <div className="flex justify-center items-center">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-2/3 space-y-6"
          >
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thumbnail Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      ref={imageInputRef}
                      onChange={(e) =>
                        field.onChange(e.target.files?.[0] ?? undefined)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="headline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Headline</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Headline Here" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter Description Here"
                      {...field}
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Price Here"
                        {...field}
                        className="pr-10"
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Images (max 4)</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      ref={imageInputRefMultiple}
                      multiple
                      onChange={(e) => {
                        const files = e.target.files;
                        field.onChange(files ? Array.from(files) : []); // Safely handle the FileList
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex space-x-4">
              <Button type="submit">Upload</Button>
              <Button type="button" variant="destructive" onClick={handleClear}>
                Clear
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <div className="p-4 w-full overflow-hidden">
        <ul className="flex flex-wrap justify-start gap-4">
          {currentItems.map((item) => (
            <li
              key={item.unique_id}
              className="flex-shrink-0 w-full sm:w-1/2 md:w-2/5 lg:w-1/4 xl:w-1/5"
            >
              <Card className="flex flex-col min-h-[350px] overflow-hidden">
                <div className="flex-grow">
                  <img
                    src={item.imageUrl}
                    alt={item.headline}
                    className="h-[200px] w-full object-cover"
                    style={{ borderRadius: "0.5rem 0.5rem 0 0" }}
                  />
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
                      Cost: {item.price}
                    </CardDescription>
                    <Link
                      href={`/dashboard-uploader/upload-availability/${item.unique_id}?username=${isdecodedToken?.username}&role=${isdecodedToken?.role}&Id=${isdecodedToken?.userId}&Pid=${item.unique_id}`}
                    >
                      <Button className="ml-2">Edit</Button>
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
    </>
  );
};

export default page;
