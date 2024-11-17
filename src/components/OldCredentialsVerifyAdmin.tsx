"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ForgotPasswordAdmin from "@/components/ForgotPasswordAdmin";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

import {
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

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
import { useState } from "react";
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
});

const OldCredentialsVerifyAdmin = () => {
  const [showNewPasswordField, setShowNewPasswordField] = useState(false);
  const [userId, setUserId] = useState("");

  const PreviousCredentialsNotMatch = () => {
    toast.error("Previous Credentials did not match.", {
      draggable: true,
      theme: "colored",
      position: "top-center",
      bodyClassName: 'text-sm',
    });
    form.reset();
  }

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      email: "",
      p_number: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const username = data.username;
    const email = data.email;
    const p_number = data.p_number;

    fetch(`https://mero-space-backend-deployment.vercel.app/verify-admin-old-credentials`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        username,
        email,
        p_number,
      }),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json(); // Parse JSON response here
        } else {
          PreviousCredentialsNotMatch();
          throw new Error("Credentials do not match"); // Stop further processing
        }
      })
      .then((data) => {
        setShowNewPasswordField(true);
        setUserId(data.userId);
      })
      .catch((err) => {
        console.error(err);
      });

    form.reset();
}

  return (
    <div>
      {!showNewPasswordField ? (
        <>
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

              <div className="flex space-x-4">
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <Button type="submit" variant="destructive">
                    Continue
                  </Button>
                </AlertDialogFooter>
              </div>
            </form>
          </Form>
        </div>
          <ToastContainer />
        </>
      ) : (
        <ForgotPasswordAdmin userId={userId} />
      )}
    </div>
  );
};

export default OldCredentialsVerifyAdmin;
