"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { decodeToken } from "@/components/utils/decodeToken.js";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import OldPasswordVerifyAdmin from "@/components/OldPasswordVerifyAdmin";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "@/admin-components/Navbar/Navbar"

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type UploaderData = {
  _id: string;
  username: string;
  email: string;
  p_number: string;
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
  const [isUserIdJwt, setIsUserIdJwt] = useState("");
  const [data, setData] = useState<UploaderData[]>([]);
  const [isdecodedToken, setIsDecodedToken] = useState<DecodedToken | null>(
    null
  );
  // const [currentPath, setCurrentPath] = useState("");

  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [pendingUserData, setPendingUserData] = useState<z.infer<
    typeof FormSchema
  > | null>(null);

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
        setIsUserIdJwt(decodedToken.userId);
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
              `/control/admin-role/profile?username=${decodedToken.username}&role=${decodedToken.role}&Id=${decodedToken.userId}`
            );
          }
        }

        const urlPath = window.location.pathname;
        const roleFromPath = urlPath.split("-")[1].split("/")[0];
        if (roleFromPath !== decodedToken.role) {
          router.push(
            `/control/admin-role/profile?username=${decodedToken.username}&role=${decodedToken.role}&Id=${decodedToken.userId}`
          );
        }
        const fetchData = async () => {
            if (!isUserId) {
              return;
            }
            try {
              const response = await fetch(
                `https://mero-space-backend-deployment.vercel.app/get-admin-profile/${isUserIdJwt}`
              );
              const result = await response.json();
              setData(result);
            } catch (error) {
              console.error("Error fetching profile:", error);
            }
          };
  
          fetchData();
      } catch (error) {
        console.error("Error decoding token:", error);
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

  const FormSchema = z.object({
    username: z
      .string()
      .min(2, {
        message:
          "Username should be modified or must be at least 2 characters.",
      })
      .max(15, {
        message:
          "Username should be modified or must be at most 15 characters.",
      })
      .regex(/^[a-zA-Z0-9]+$/, {
        message:
          "Username should be modified or can only contain letters and numbers.",
      }),

    email: z
      .string()
      .email({ message: "Invalid email address or should be modified." }),

    p_number: z
      .string()
      .regex(/^[0-9]+$/, {
        message:
          "Contact number should be modified or can only contain digits.",
      })
      .length(10, {
        message:
          "Contact number should be modified or must be exactly 10 digits.",
      })
      .refine((val) => val.startsWith("9"), {
        message: "Contact number should be modified or must start with 9.",
      }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      email: "",
      p_number: "",
    },
  });

  const logOut = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const handleSendEmailOTP = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true);
    try {
      const response = await fetch("https://mero-space-backend-deployment.vercel.app/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });

      if (response.ok) {
        setEmail(data.email);
        setPendingUserData(data);
        setIsOTPModalOpen(true);
        setLoading(false);
      } else {
        toast.error("Failed to send OTP. Try again.", {
          draggable: true,
          theme: "colored",
        });
      }
    } catch (error) {
      toast.error(`An error occurred while sending OTP. ${error}`, {
        draggable: true,
        theme: "colored",
      });
    }
  };

  const handleVerifyEmailOTP = async () => {
    // const handleVerifyEmailOTP = async (data: z.infer<typeof FormSchema>) => {
    try {
      const response = await fetch("https://mero-space-backend-deployment.vercel.app/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      if (response.ok) {
        setIsOTPModalOpen(false);
        if (pendingUserData) {
          finalDataSubmit(
            pendingUserData.username,
            pendingUserData.email,
            pendingUserData.p_number
          );
        }
      } else {
        toast.error("OTP did not match.", {
          draggable: true,
          theme: "colored",
        });
      }
    } catch (error) {
      toast.error(`An error occurred while verifying OTP. ${error}`, {
        draggable: true,
        theme: "colored",
      });
    }
  };

  const handleSubmit = form.handleSubmit(async (data) => {
    const { email } = data;

    try {
      const response = await fetch(
        `https://mero-space-backend-deployment.vercel.app/verify-changed-email-admin/${isUserIdJwt}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (response.status === 200) {
        handleSendEmailOTP(data);
      } else if (response.status === 400) {
        toast.error("This email is already registered. Try another!", {
          draggable: true,
          theme: "colored",
        });
        return;
      } else if (response.status === 201) {
        onSubmit(data);
      }
      else {
        onSubmit(data);
      }
    } catch (error) {
      console.error(error);
      return;
    }
  });

  const finalDataSubmit = async (
    username: string,
    email: string,
    p_number: string
  ) => {
    try {
      const response = await fetch(
        `https://mero-space-backend-deployment.vercel.app/admin-profile-modified/${isUserIdJwt}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            email: email,
            p_number: p_number,
          }),
        }
      );

      // Check if the response was successful
      if (response.ok) {
        await response.json();
        window.location.reload();
      } else {
        const error = await response.json();
        throw new Error(
          error?.message || "An unexpected error occurred. Please try again."
        );
      }
    } catch (error) {
      console.error("Error during data submission:", error);
    }
    logOut();
  };

  function onSubmit(data: z.infer<typeof FormSchema>) {
    fetch(`https://mero-space-backend-deployment.vercel.app/admin-profile-modified/${isUserIdJwt}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: data.username,
        email: data.email,
        p_number: data.p_number,
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
    logOut();
  }

  return (
    <>
    <Navbar />
      <div className="grid grid-cols-[8fr_1fr]">
        <div className="flex justify-center items-center">
          {data.map((item) => (
            <Form {...form} key={item._id.toString()}>
              <form onSubmit={handleSubmit} className="w-2/3 space-y-6">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Username Here"
                          {...field}
                          value={item.username}
                          onChange={(e) => {
                            field.onChange(e);
                            item.username = e.target.value;
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Email Here"
                          {...field}
                          value={item.email}
                          onChange={(e) => {
                            field.onChange(e);
                            item.email = e.target.value;
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="p_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter Phone Number Here"
                            {...field}
                            value={item.p_number}
                            onChange={(e) => {
                              field.onChange(e);
                              item.p_number = e.target.value;
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
                  {loading ? (
                    <>
                      <Button type="button" disabled>
                        Sending OTP...
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button type="submit">Update</Button>
                    </>
                  )}

                  <Link
                    href={`/control/admin-role/profile?username=${isdecodedToken?.username}&role=${isdecodedToken?.role}&Id=${isdecodedToken?.userId}`}
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
        {isOTPModalOpen && (
          <Dialog open={isOTPModalOpen} onOpenChange={setIsOTPModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Enter OTP</DialogTitle>
              </DialogHeader>
              <div>
                <Input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Verify OTP sent to your provided email"
                />
                <Button onClick={handleVerifyEmailOTP} className="mt-4">
                  Verify OTP
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
        <div className="flex">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="mx-1 my-3">
                Change Password
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  <OldPasswordVerifyAdmin />
                </AlertDialogTitle>
              </AlertDialogHeader>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </>
  );
};

export default Page;