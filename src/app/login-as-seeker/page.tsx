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
const FormSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),

  password: z
    .string()
});

const Page = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);


  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem("token");
    if (token) {
      localStorage.setItem("firstRender", "true");
      // Redirect to dashboard if token exists
      const decodedToken = decodeToken(token);
      router.push(`/dashboard-seeker?username=${decodedToken.username}&role=${decodedToken.role}&Id=${decodedToken.userId}`);
    }
  }, [router]);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState: boolean) => !prevState);
  };
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const IncorrectCredentials = () => {
    toast.error("Incorrect Email or Password.", {
      draggable: true,
      theme: "colored",
    });
    form.reset();
  }

  const UnexpectedError = () => {
    toast.error("An unexpected error occurred. Please try again.", {
      draggable: true,
      theme: "colored",
    });
    form.reset();
  }
  
  function onSubmit(data: z.infer<typeof FormSchema>) {
    const email = data.email;
    const password = data.password;

    if (password.length < 8 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[\W_]/.test(password)) {
      IncorrectCredentials();
      return;
    }

    fetch("https://mero-space-backend-deployment.vercel.app/login-as-seeker", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 401) {
          IncorrectCredentials();
        } else {
          UnexpectedError();
        }
      })
      .then((data) => {
        if (data.token) {
          // Save the token in localStorage
          localStorage.setItem("token", data.token);
          localStorage.setItem("firstRender", "true");
          const decodedToken = decodeToken(data.token);
          router.push(`/dashboard-seeker?username=${decodedToken.username}&role=${decodedToken.role}&Id=${decodedToken.userId}`);
        } else {
          UnexpectedError();
        }
      })
      .catch((err) => {
        console.log(err);
        return;
      });

    form.reset();
  }

  const handleClear = () => {
    form.reset();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex justify-center items-center">
        <Image
          src="/assets/gifs/login.gif"
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Registered Email" {...field} />
                  </FormControl>
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
                        placeholder="Your Registered Password"
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
                </FormItem>
              )}
            />

            <div className="flex space-x-4">
              <Button type="submit">Login</Button>
              <Button type="button" variant="destructive" onClick={handleClear}>
                Clear
              </Button>
              <ToastContainer />
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Page;