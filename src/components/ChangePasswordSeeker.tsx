"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { decodeToken } from "@/components/utils/decodeToken.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

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
const FormSchema = z
  .object({
    new_password: z
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
    confirm_new_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_new_password, {
    message: "New Password and Confirm New Password did not match.",
    path: ["confirm_new_password"],
  });

const ChangePasswordSeeker = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUserIdJwt, setIsUserIdJwt] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decodedToken = decodeToken(token);
    setIsUserIdJwt(decodedToken.userId);
  }, [isUserIdJwt]);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState: boolean) => !prevState);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevState: boolean) => !prevState);
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      new_password: "",
      confirm_new_password: "",
    },
  });

  const UnexpectedError = () => {
    toast.error("An unexpected error occurred. Please try again.", {
      draggable: true,
      theme: "colored",
      position: "top-center",
      bodyClassName: 'text-sm',
    });
    form.reset();
  }

  const PreviousNewPasswordMatch = () => {
    toast.error("Oh! New Password should not be the same as Previous Password.", {
      draggable: true,
      theme: "colored",
      position: "top-center",
      bodyClassName: 'text-sm',
    });
    form.reset();
  }

  function onSubmit(data: z.infer<typeof FormSchema>) {
    fetch(`https://mero-space-backend-deployment.vercel.app/change-seeker-password/${isUserIdJwt}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        new_password: data.new_password,
      }),
    })
      .then((response) => {
        if (response.ok) {
          window.location.reload();
          return response.json();
        } else if(response.status === 400) {
          PreviousNewPasswordMatch();
        } else {
          UnexpectedError();
        }
      })
      .catch((err) => {
        console.error(err);
      });
    form.reset();
  }

  return (
    <div>
      <div className="flex justify-center items-center">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-2/3 space-y-6"
          >
            <FormField
              control={form.control}
              name="new_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter New Password"
                        {...field}
                        className="pr-10"
                      />
                    </FormControl>
                    <FormMessage />
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

            <FormField
              control={form.control}
              name="confirm_new_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Repeat Your New Password"
                        {...field}
                        className="pr-10"
                      />
                    </FormControl>
                    <FormMessage />
                    <div
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                      onClick={toggleConfirmPasswordVisibility}
                    >
                      {showConfirmPassword ? <IoMdEyeOff /> : <IoMdEye />}
                    </div>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex space-x-4">
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button type="submit" variant="destructive">
                  Submit
                </Button>
                <ToastContainer />
              </AlertDialogFooter>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ChangePasswordSeeker;
