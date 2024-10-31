"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import { decodeToken } from "@/components/utils/decodeToken.js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if(token) {
      const decodedToken = decodeToken(token);
      router.push(
        `/dashboard-uploader?username=${decodedToken.username}&role=${decodedToken.role}&Id=${decodedToken.userId}`
      );
    }
  }, [router])

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

  const RepeatEmailPhone = () => {
    toast.error("Email or Phone Number already registered! Please use different credentials.", {
      draggable: true,
      theme: "colored",
    });
    form.reset();
  }

  const UnexpectedError = (error: string) => {
    toast.error(`An unexpected error occurred. ${error}`, {
      draggable: true,
      theme: "colored",
    });
    form.reset();
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const { username, email, p_number, password } = data;
  
    try {
      const response = await fetch("https://mero-space-backend-deployment.vercel.app/register-as-uploader", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, p_number, password }),
      });
  
      if (response.status === 400) {
        RepeatEmailPhone();
        return;
      }
  
      await response.json();
  
      router.push("/login-as-uploader");
    } catch (error) {
      UnexpectedError(error as string);
      return;
    }
    
    form.reset();
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
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-2/3 space-y-6"
          >
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
              <Button type="submit">Register</Button>
              <ToastContainer />
              <Button type="button" variant="destructive" onClick={handleClear}>
                Clear
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Page;