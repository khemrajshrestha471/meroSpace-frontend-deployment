"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { decodeToken } from "@/components/utils/decodeToken.js";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  price: string;
  imageUrl: string;
  imageUrls: [string];
};

interface DecodedToken {
  username: string;
  role: string;
  userId: string;
}

const Page = () => {
  // const pathname = usePathname();
  const [expiryTime, setExpiryTime] = useState(0);
  const [isUserId, setIsUserId] = useState("");
  const [data, setData] = useState<UploaderData[]>([]);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRefMultiple = useRef<HTMLInputElement | null>(null);
  const [isdecodedToken, setIsDecodedToken] = useState<DecodedToken | null>(
    null
  );
  // const [currentPath, setCurrentPath] = useState("");
  const searchParams = useSearchParams();
  const [changeThumbnailImage, setChangeThumbnailImage] = useState(false);
  const [changeAdditionalImages, setChangeAdditionalImages] = useState(false);

  const Pid = searchParams.get("Pid");

  // const currentPath1 = pathname.split("/").slice(-1)[0];

  useEffect(() => {
    const isFirstRender = localStorage.getItem("firstRender");
    if (isFirstRender) {
      // Refresh the page
      window.location.reload();

      // Remove the flag to prevent future refreshes
      localStorage.removeItem("firstRender");
    }
    // setCurrentPath(pathname.split("/").slice(-1)[0])
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

        const fetchData = async () => {
          if (!isUserId) {
            return;
          }
          try {
            const response = await fetch(
              `https://mero-space-backend-deployment.vercel.app/get-unique-product/${Pid}`
            );
            const result = await response.json();
            setData(result);
          } catch (error) {
            UnexpectedError(error as string);
          }
        };

        fetchData();
      } catch (error) {
        UnexpectedError(error as string);
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
    headline: z.string().min(1, "Headline is required or should be modified"),
    description: z
      .string()
      .min(1, "Description is required or should be modified"),
    price: z.string().min(1, "Price is required or should be modified"),
    image: z
      .instanceof(File, { message: "Thumbnail Image is required" })
      .optional(),
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

  const LimitExceed = (limit:number) => {
    toast.error(`You can upload maximum of ${limit} image(s).`, {
      draggable: true,
      theme: "colored",
    });
  }

  const UnexpectedError = (error:string) => {
    toast.error(`An unexpected error occurred. ${error}`, {
      draggable: true,
      theme: "colored",
    });
  }
  const UnexpectedErrorNoParameter = () => {
    toast.error("An unexpected error occurred. Please try again.", {
      draggable: true,
      theme: "colored",
    });
  }

  const FailedDeleteImage = () => {
    toast.error("Failed to delete image. Please try again.", {
      draggable: true,
      theme: "colored",
    });
  }

  const FailedDeleteProduct = () => {
    toast.error("Failed to delete product. Please try again.", {
      draggable: true,
      theme: "colored",
    });
  }

  function onSubmit(data: z.infer<typeof FormSchema>, item: UploaderData) {
    const limit = 4 - item.imageUrls.length;
    // Create FormData to handle text and image data
    const formData = new FormData();
    formData.append("headline", data.headline);
    formData.append("description", data.description);
    formData.append("price", data.price);
    // Append single image if it exists
    if (data.image) {
      formData.append("image", data.image);
    }

    // Append multiple images if any are selected
    if (data.images) {
      for (const file of data.images) {
        formData.append("images", file);
      }
    }

    fetch(`https://mero-space-backend-deployment.vercel.app/uploader-data-modified/${Pid}/${limit}`, {
      method: "PATCH",
      credentials: "include",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          window.location.reload();
          return response.json();
        } else if (response.status === 400) {
          LimitExceed(limit);
        } else {
          UnexpectedErrorNoParameter();
        }
      })
      .catch((error) => {
        UnexpectedError(error as string);
      });
    form.reset();
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
    if (imageInputRefMultiple.current) {
      imageInputRefMultiple.current.value = "";
    }
  }

  const updateThumbnailImage = () => {
    setChangeThumbnailImage(!changeThumbnailImage);
  };

  const updateAdditionalImages = () => {
    setChangeAdditionalImages(!changeAdditionalImages);
  };

  const deleteThisImage = async (imageNumber: number) => {
    try {
      const response = await fetch(
        `https://mero-space-backend-deployment.vercel.app/delete-particular-image/${Pid}/${imageNumber}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        await response.json();
        window.location.reload();
      } else {
        await response.json();
        FailedDeleteImage();
      }
    } catch (error) {
      UnexpectedError(error as string);
    }
  };

  const deleteThisProduct = async () => {
    try {
      const response = await fetch(
        `https://mero-space-backend-deployment.vercel.app/delete-unique-product/${Pid}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        const token = localStorage.getItem("token");
        const decodedToken = decodeToken(token);
        router.push(
          `/dashboard-uploader?username=${decodedToken.username}&role=${decodedToken.role}&Id=${decodedToken.userId}`
        );
        await response.json();
      } else {
        await response.json();
        FailedDeleteProduct();
      }
    } catch (error) {
      UnexpectedError(error as string);
    }
  };

  return (
    <>
      <div className="grid grid-cols-[8fr_1fr]">
      <div className="flex justify-center items-center">
        {data.map((item) => (
          <Form {...form} key={item.unique_id}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit((data) => onSubmit(data, item))(e);
              }}
              className="w-2/3 space-y-6"
            >
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thumbnail Image</FormLabel>
                    {changeThumbnailImage && (
                      <>
                        <FormControl>
                          <Input
                            type="file"
                            ref={imageInputRef}
                            onChange={(e) =>
                              field.onChange(e.target.files?.[0] ?? undefined)
                            }
                          />
                        </FormControl>
                        <div>
                          <button
                            className="border-0"
                            onClick={updateThumbnailImage}
                          >
                            Back
                          </button>
                        </div>
                      </>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!changeThumbnailImage && item.imageUrl && (
                <>
                  <div className="flex items-center space-x-5 gap-6">
                    <img
                      src={item.imageUrl}
                      alt="Thumbnail Image"
                      className="w-24 h-auto mb-2"
                    />
                    <button className="border-0" onClick={updateThumbnailImage}>
                      Change Thumbnail Image
                    </button>
                  </div>
                </>
              )}

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
                          value={item.price}
                          onChange={(e) => {
                            field.onChange(e);
                            item.price = e.target.value;
                          }}
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
                    {changeAdditionalImages && (
                      <>
                        <FormControl>
                          <Input
                            type="file"
                            ref={imageInputRefMultiple}
                            multiple
                            onChange={(e) => {
                              const files = e.target.files;
                              field.onChange(files ? Array.from(files) : []);
                            }}
                          />
                        </FormControl>
                        <div>
                          <button
                            className="border-0"
                            onClick={updateAdditionalImages}
                          >
                            Back
                          </button>
                        </div>
                      </>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {item.imageUrls && item.imageUrls.length > 0 && (
                <>
                  <div className="flex space-x-2">
                    {item.imageUrls.map((url, index) => (
                      <div key={index} className="relative w-25 h-25 group">
                        <img
                          src={url}
                          className="w-full h-full object-cover"
                          alt={`Additional Image ${index + 1}`}
                        />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-7 h-7 items-center justify-center cursor-pointer hidden group-hover:block transition duration-200">
                              &times;
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Really want to delete this image?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undo. This will
                                permanently delete the image from your account.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <Button
                                variant="destructive"
                                onClick={() => deleteThisImage(index)}
                              >
                                Delete
                              </Button>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {item.imageUrls.length < 4 && !changeAdditionalImages && (
                <button className="border-0" onClick={updateAdditionalImages}>
                  Upload Additional Images
                </button>
              )}

              <div className="flex space-x-4 mb-4">
                <Button type="submit">Submit</Button>
                <Link
                  href={`/dashboard-uploader?username=${isdecodedToken?.username}&role=${isdecodedToken?.role}&Id=${isdecodedToken?.userId}`}
                  className="text-white no-underline"
                >
                  <Button type="button" variant="destructive">
                    Cancel
                  </Button>
                </Link>
                  <ToastContainer />
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
                Really want to delete this product?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undo. This will permanently delete the
                product from your account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button variant="destructive" onClick={deleteThisProduct}>
                Continue
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
    
    </>
  );
};

export default Page;