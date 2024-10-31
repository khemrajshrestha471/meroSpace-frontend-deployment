"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { decodeToken } from "@/components/utils/decodeToken.js";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
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
  tentative_price: string;
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
  const [isdecodedToken, setIsDecodedToken] = useState<DecodedToken | null>(
    null
  );
  const searchParams = useSearchParams();

  const Pid = searchParams.get("Pid");

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
      router.push("/login-as-seeker");
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
              `/dashboard-seeker/upload-requirement?username=${decodedToken.username}&role=${decodedToken.role}&Id=${decodedToken.userId}`
            );
          }

        }


        const urlPath = window.location.pathname;
        const roleFromPath = urlPath.split("-")[1].split("/")[0]; // seeker
        const roleFromPathWithSubPath = urlPath.split("-")[1]; // seeker/upload
        const roleFromPathWithSubPathFull = urlPath.split("/")[1] + "/" + urlPath.split("/")[2]; //dashboard-seeker/upload-requirement
        if (roleFromPath !== decodedToken.role && roleFromPathWithSubPath === "seeker/upload") {
          router.push(
            `/dashboard-uploader/upload-availability?username=${decodedToken.username}&role=${decodedToken.role}&Id=${decodedToken.userId}`
          );
        }
        if (roleFromPath !== decodedToken.role && roleFromPathWithSubPath === "seeker/view") {
          router.push(
            `/dashboard-uploader/view-requirements?username=${decodedToken.username}&role=${decodedToken.role}&Id=${decodedToken.userId}`
          );
        } 

        if (roleFromPathWithSubPathFull !== "dashboard-seeker/upload-requirement" && !searchParams.get("Pid")) {
          router.push(
            `/dashboard-seeker/upload-requirement?username=${decodedToken.username}&role=${decodedToken.role}&Id=${decodedToken.userId}`
          );
        }

        const fetchData = async () => {
          if (!isUserId) {
            return;
          }
          try {
            const response = await fetch(
              `https://mero-space-backend-deployment.vercel.app/get-unique-requirement/${Pid}`
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
        router.push("/login-as-seeker");
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
        router.push("/login-as-seeker");
      }
    }
  }, [expiryTime, router]);

  const FormSchema = z.object({
    headline: z.string().min(1, "Headline is required or should be modified"),
    description: z
      .string()
      .min(1, "Description is required or should be modified"),
      tentative_price: z.string().min(1, "Tentative Price is required or should be modified"),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      headline: "",
      description: "",
      tentative_price: "",
    },
  });

  // function onSubmit(data: z.infer<typeof FormSchema>, item: UploaderData) {
  function onSubmit(data: z.infer<typeof FormSchema>) {

    fetch(`https://mero-space-backend-deployment.vercel.app/uploader-requirement-modified/${Pid}`, {
      method: "PATCH",
      credentials: "include",
            headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        headline: data.headline,
        description: data.description,
        tentative_price: data.tentative_price,
      }),
    })
      .then((response) => {
        if (response.ok) {
          window.location.reload();
          return response.json();
        } else {
          throw new Error("An unexpected error occurred. Please try again.");
        }
      })
      .catch((err) => {
        alert(err.message);
      });
    form.reset();
  }

  const deleteThisRequirement = async () => {
    try {
      const response = await fetch(
        `https://mero-space-backend-deployment.vercel.app/delete-unique-requirement/${Pid}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        const token = localStorage.getItem("token");
        const decodedToken = decodeToken(token);
        router.push(
          `/dashboard-seeker?username=${decodedToken.username}&role=${decodedToken.role}&Id=${decodedToken.userId}`
        );
        await response.json();
      } else {
        const errorData = await response.json();
        alert(`Failed to delete product: ${errorData.error}`);
      }
    } catch (error) {
      alert(`Error deleting product: ${error}`);
    }
  };

  return (
    <div className="grid grid-cols-[8fr_1fr]">
      <div className="flex justify-center items-center">
        {data.map((item) => (
          <Form {...form} key={item.unique_id}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // form.handleSubmit((data) => onSubmit(data, item))(e);
                form.handleSubmit((data) => onSubmit(data))(e);
              }}
              className="w-2/3 space-y-6"
            >

              <FormField
                control={form.control}
                name="headline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Headline</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Headline Here"
                        {...field}
                        value={item.headline}
                        onChange={(e) => {
                          field.onChange(e);
                          item.headline = e.target.value;
                        }}
                      />
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
                        value={item.description}
                        onChange={(e) => {
                          field.onChange(e);
                          item.description = e.target.value;
                        }}
                        className="resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tentative_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tentative Price</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter Price Here"
                          {...field}
                          value={item.tentative_price}
                          onChange={(e) => {
                            field.onChange(e);
                            item.tentative_price = e.target.value;
                          }}
                          className="pr-10"
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex space-x-4 mb-4">
                <Button type="submit">Submit</Button>
                <Link
                  href={`/dashboard-seeker?username=${isdecodedToken?.username}&role=${isdecodedToken?.role}&Id=${isdecodedToken?.userId}`}
                  className="text-white no-underline"
                >
                  <Button type="button" variant="destructive">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </Form>
        ))}
      </div>
      <div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="m-3">
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Really want to delete this requirement?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undo. This will permanently delete the
                requirement information from your account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button variant="destructive" onClick={deleteThisRequirement}>
                Continue
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Page;
