"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { decodeToken } from "@/components/utils/decodeToken.js";
import ChangePasswordAdmin from "@/components/ChangePasswordAdmin";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
const FormSchema = z.object({
  previous_password: z.string(),
});

const OldPasswordVerifyAdmin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPasswordField, setShowNewPasswordField] = useState(false);
  const [isUserIdJwt, setIsUserIdJwt] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decodedToken = decodeToken(token);
    setIsUserIdJwt(decodedToken.userId);
  }, [isUserIdJwt]);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState: boolean) => !prevState);
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      previous_password: "",
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

  const PreviousPasswordNotMatch = () => {
    toast.error("Previous Password did not match.", {
      draggable: true,
      theme: "colored",
      position: "top-center",
      bodyClassName: 'text-sm',
    });
    form.reset();
  }

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const previous_password = data.previous_password;

    if (
      previous_password.length < 8 ||
      !/[a-z]/.test(previous_password) ||
      !/[A-Z]/.test(previous_password) ||
      !/[0-9]/.test(previous_password) ||
      !/[\W_]/.test(previous_password)
    ) {
      PreviousPasswordNotMatch();
      return;
    }

    fetch(`https://mero-space-backend-deployment.vercel.app/verify-admin-old-password/${isUserIdJwt}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        previous_password,
      }),
    })
      .then((response) => {
        if (response.status === 200) {
          setShowNewPasswordField(true);
        } else {
          PreviousPasswordNotMatch();
          return;
        }
      })
      .catch((error) => {
        console.error("Error: ", error)
      });

    form.reset();
  }

  return (
    <div>
      {!showNewPasswordField ? (
        <div className="flex justify-center items-center">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-2/3 space-y-6"
            >
              <FormField
                control={form.control}
                name="previous_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Previous Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Your Previous Password"
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
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <Button type="submit" variant="destructive">
                    Continue
                  </Button>
                  <ToastContainer />
                </AlertDialogFooter>
              </div>
            </form>
          </Form>
        </div>
      ) : (
        <ChangePasswordAdmin />
      )}
    </div>
  );
};

export default OldPasswordVerifyAdmin;
