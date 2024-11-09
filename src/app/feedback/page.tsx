"use client";
import Image from "next/image";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/button";
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

const Page = () => {
  const FormSchema = z.object({
    sentiment: z.string().min(1, "Sentiment is required"),
    title: z.string().min(1, "Title is required"),
    feedback: z.string().min(1, "Feedback is required"),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      sentiment: "",
      title: "",
      feedback: "",
    },
  });

  const handleClear = () => {
    form.reset();
  };

  const SendSuccess = () => {
    toast.success("Thank you for your feedback!", {
      draggable: true,
      theme: "colored",
    });
    form.reset();
  };

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const sentiment = data.sentiment;
    const title = data.title;
    const feedback = data.feedback;

    try {
      const response = await fetch("https://mero-space-backend-deployment.vercel.app/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sentiment,
          title,
          feedback,
        }),
      });

      await response.json();
      SendSuccess();
    } catch (error) {
      console.error("Error sending feedback:", error);
    } finally {
      form.reset();
    }
  }
  return (
    <>
      <div className="relative w-full h-[50vh]">
        <Image
          src="/assets/images/feedback.jpg"
          alt="Search Results"
          layout="fill"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black opacity-30"></div>

        <div className="absolute inset-0 flex items-end justify-left p-8 px-16">
          <p
            className="text-white text-4xl font-bold font-sans"
            style={{ fontFamily: "Arial, Arial, sans-serif" }}
          >
            Your feedback matters!
          </p>
        </div>
      </div>

      <div className="flex justify-center items-center mt-2">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-2/3 space-y-6"
          >
            <FormField
              control={form.control}
              name="sentiment"
              render={() => (
                <FormItem className="w-full">
                  <FormLabel>Sentiment</FormLabel>
                  <FormControl>
                    <Controller
                      control={form.control}
                      name="sentiment"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(value) => field.onChange(value)}
                        >
                          <SelectTrigger className="w-full p-2 border-2 border-gray-300 rounded-md">
                            <SelectValue placeholder="Your Sentiment" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem
                                value="Satisfied"
                                className="cursor-pointer"
                              >
                                Satisfied
                              </SelectItem>
                              <SelectItem
                                value="Neutral"
                                className="cursor-pointer"
                              >
                                Neutral
                              </SelectItem>
                              <SelectItem
                                value="Dissatisfied"
                                className="cursor-pointer"
                              >
                                Dissatisfied
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
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Feedback Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="feedback"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Feedback</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Your Feedback"
                      {...field}
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex space-x-4">
              <Button type="submit">Send</Button>
              <Button type="button" variant="destructive" onClick={handleClear}>
                Clear
              </Button>
            </div>
            <ToastContainer />
          </form>
        </Form>
      </div>
    </>
  );
};

export default Page;
