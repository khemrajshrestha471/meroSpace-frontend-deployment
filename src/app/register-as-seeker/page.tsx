"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import { decodeToken } from "@/components/utils/decodeToken.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
const FormSchema = z
  .object({
    username: z
      .string()
      .min(2, { message: "Username must be at least 2 characters." })
      .max(15, { message: "Username must be at most 15 characters." })
      .regex(/^[a-zA-Z0-9]+$/, {
        message: "Username can only contain letters and numbers.",
      }),

    email: z.string().email({ message: "Invalid email address." }),

    p_number: z
      .string()
      .regex(/^[0-9]+$/, { message: "Contact number can only contain digits." })
      .length(10, { message: "Contact number must be exactly 10 digits." })
      .refine((val) => val.startsWith("9"), {
        message: "Contact number must start with 9.",
      }),

    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter.",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter.",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number." })
      .regex(/[\W_]/, {
        message: "Password must contain at least one special character.",
      }),
    c_password: z.string(),
  })
  .refine((data) => data.password === data.c_password, {
    message: "Password and Confirm Password did not match.",
    path: ["c_password"],
  });

const Page = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [pendingUserData, setPendingUserData] = useState<z.infer<
    typeof FormSchema
  > | null>(null);

  const RepeatEmailPhone = () => {
    toast.error(
      "Email or Phone Number already registered! Please use different credentials.",
      {
        draggable: true,
        theme: "colored",
      }
    );
    form.reset();
  };

  const UnexpectedError = (error: string) => {
    toast.error(`An unexpected error occurred. ${error}`, {
      draggable: true,
      theme: "colored",
    });
    form.reset();
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = decodeToken(token);
      router.push(
        `/dashboard-uploader?username=${decodedToken.username}&role=${decodedToken.role}&Id=${decodedToken.userId}`
      );
    }
  }, [router]);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState: boolean) => !prevState);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevState: boolean) => !prevState);
  };
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      email: "",
      p_number: "",
      password: "",
      c_password: "",
    },
  });

  const handleSendEmailOTP = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://mero-space-backend-deployment.vercel.app/send-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data.email }),
        }
      );

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
      toast.error("An error occurred while sending OTP.", {
        draggable: true,
        theme: "colored",
      });
    }
  };

  const handleVerifyEmailOTP = async () => {
    try {
      const response = await fetch(
        "https://mero-space-backend-deployment.vercel.app/verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        }
      );

      if (response.ok) {
        setIsOTPModalOpen(false);
        if (pendingUserData) {
          await onSubmit(pendingUserData);
        }
      } else {
        toast.error("OTP did not match.", {
          draggable: true,
          theme: "colored",
        });
      }
    } catch (error) {
      toast.error("An error occurred while verifying OTP.", {
        draggable: true,
        theme: "colored",
      });
    }
  };

  const handleSubmit = form.handleSubmit(async (data) => {
    const { email, p_number } = data;

    try {
      const response = await fetch(
        "https://mero-space-backend-deployment.vercel.app/verify-repeat-credentials-seeker",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, p_number }),
        }
      );

      if (response.status === 200) {
        handleSendEmailOTP(data);
      }

      if (response.status === 400) {
        RepeatEmailPhone();
        return;
      }
    } catch (error) {
      UnexpectedError(error as string);
      return;
    }
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const { username, email, p_number, password } = data;

    try {
      const response = await fetch(
        "https://mero-space-backend-deployment.vercel.app/register-as-seeker",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            p_number,
            password,
          }),
        }
      );

      // Process the response data
      await response.json();
      // Redirect after successful registration
      router.push("/login-as-seeker");
    } catch (error) {
      UnexpectedError(error as string);
    } finally {
      form.reset();
    }
  }

  const handleClear = () => {
    form.reset();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex justify-center items-center">
        <Image
          src="/assets/gifs/register.gif"
          width={650}
          height={650}
          alt="Nepal's Flag"
          unoptimized
        />
      </div>
      <div className="flex justify-center items-center">
        <Form {...form}>
          <form onSubmit={handleSubmit} className="w-2/3 space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Username" {...field} />
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
                    <Input placeholder="Your Working Email" {...field} />
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
                      <div className="flex items-center border rounded-md overflow-hidden">
                        <div className="flex-shrink-0 p-2">
                          <Image
                            src="/assets/images/flag.png"
                            width={15}
                            height={15}
                            alt="Nepal's Flag"
                            unoptimized
                          />
                        </div>
                        <Input
                          placeholder="Your Personal Phone Number"
                          {...field}
                          className="flex-1 border-none focus:ring-0 focus:outline-none"
                        />
                      </div>
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter Strong Password"
                        {...field}
                        className="pr-10"
                      />
                    </FormControl>
                    <div
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <IoMdEyeOff /> : <IoMdEye />}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="c_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Repeat Above Password"
                        {...field}
                        className="pr-10"
                      />
                    </FormControl>
                    <div
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                      onClick={toggleConfirmPasswordVisibility}
                    >
                      {showConfirmPassword ? <IoMdEyeOff /> : <IoMdEye />}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex space-x-4">
              {loading ? (
                <>
                  <Button type="button" disabled>
                    Sending OTP...
                  </Button>
                </>
              ) : (
                <>
                  <Button type="submit">Register</Button>
                </>
              )}

              <ToastContainer />
              <Button type="button" variant="destructive" onClick={handleClear}>
                Clear
              </Button>
            </div>
          </form>
        </Form>
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
      </div>
    </div>
  );
};

export default Page;
