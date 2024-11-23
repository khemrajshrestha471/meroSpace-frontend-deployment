"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { decodeToken } from "@/components/utils/decodeToken.js";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";

import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  property: string;
  location: string;
  price: number;
  imageUrl: string;
  listing_status: string;
};

interface DecodedToken {
  username: string;
  role: string;
  userId: string;
}

const Page = () => {
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
    property: z.string().min(1, "Property Type is required"),
    location: z.string().min(1, "Location is required"),
    price: z.string().min(1, "Price is required"),
    image: z.instanceof(File, { message: "Thumbnail Image is required" }),
    images: z
      .array(z.instanceof(File))
      .max(4, "You can upload a maximum of 4 images")
      .optional(),
    listing_status: z.string().min(1, "Listing Status is required"),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      headline: "",
      description: "",
      property: "",
      location: "",
      price: "",
      image: undefined,
      images: [],
      listing_status: "",
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
    if (isNaN(Number(data.price))) {
      toast.error("Price should be in Number.", {
        draggable: true,
        theme: "colored",
      });
      return;
    }
    const unique_id = Array(24)
      .fill(0)
      .map(() => Math.random().toString(36).charAt(2))
      .join("");

    // Create FormData to handle text and image data
    const formData = new FormData();
    formData.append("id", isUserId);
    formData.append("unique_id", unique_id);
    formData.append("headline", data.headline);
    formData.append("description", data.description);
    formData.append("property", data.property);
    formData.append("location", data.location);
    formData.append("price", data.price);
    formData.append("image", data.image);
    formData.append("listing_status", data.listing_status);

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
              name="property"
              render={() => (
                <FormItem className="w-full">
                  <FormLabel>Property Type</FormLabel>
                  <FormControl>
                    <Controller
                      control={form.control}
                      name="property"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(value) => field.onChange(value)}
                        >
                          <SelectTrigger className="w-full p-2 border-2 border-gray-300 rounded-md">
                            <SelectValue placeholder="Select Your Property Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem
                                value="1 BHK"
                                className="cursor-pointer"
                              >
                                1 BHK
                              </SelectItem>
                              <SelectItem
                                value="2 BHK"
                                className="cursor-pointer"
                              >
                                2 BHK
                              </SelectItem>
                              <SelectItem
                                value="Single Room"
                                className="cursor-pointer"
                              >
                                Single Room
                              </SelectItem>
                              <SelectItem
                                value="Double Room"
                                className="cursor-pointer"
                              >
                                Double Room
                              </SelectItem>
                              <SelectItem
                                value="Flat"
                                className="cursor-pointer"
                              >
                                Flat
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Location Here" {...field} />
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
                  <FormLabel>Price (per month in nepali rupees)</FormLabel>
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

            <FormField
              control={form.control}
              name="listing_status"
              render={() => (
                <FormItem className="w-full">
                  <FormLabel>Listing Status (optional)</FormLabel>
                  <FormControl>
                    <Controller
                      control={form.control}
                      name="listing_status"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(value) => field.onChange(value)}
                        >
                          <SelectTrigger className="w-full p-2 border-2 border-gray-300 rounded-md">
                            <SelectValue placeholder="Select Your Property Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem
                                value="Urgent Sell"
                                className="cursor-pointer"
                              >
                                Urgent Sell
                              </SelectItem>
                              <SelectItem
                                value="Rent"
                                className="cursor-pointer"
                              >
                                Rent
                              </SelectItem>
                              <SelectItem
                                value="10% Off"
                                className="cursor-pointer"
                              >
                                10% Off
                              </SelectItem>
                              <SelectItem
                                value="20% Off"
                                className="cursor-pointer"
                              >
                                20% Off
                              </SelectItem>
                              <SelectItem
                                value="30% Off"
                                className="cursor-pointer"
                              >
                                30% Off
                              </SelectItem>
                              <SelectItem
                                value="Sold Out"
                                className="cursor-pointer"
                              >
                                Sold Out
                              </SelectItem>
                              <SelectItem
                                value="None"
                                className="cursor-pointer"
                              >
                                None
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
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
            <ToastContainer />
          </form>
        </Form>
      </div>
      <div className="p-4 w-full overflow-hidden">
        <ul className="flex flex-wrap justify-center gap-4">
          {currentItems.map((item) => (
            <li
              key={item.unique_id}
              className="flex-shrink-0 w-full sm:w-1/2 md:w-2/5 lg:w-1/4 xl:w-1/5"
            >
              <Card className="flex flex-col min-h-[350px] overflow-hidden relative">
                <div className="flex-grow">
                  <img
                    src={item.imageUrl}
                    alt={item.headline}
                    className="h-[200px] w-full object-cover"
                    style={{ borderRadius: "0.5rem 0.5rem 0 0" }}
                  />
                  {item.listing_status !== "None" && (
                    <div className="absolute top-0 right-0 bg-red-500 text-white font-semibold text-xs px-4 py-1 rounded-tr-lg rounded-bl-lg">
                      {item.listing_status}
                    </div>
                  )}
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
                      Location: {item.location}
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

export default Page;
