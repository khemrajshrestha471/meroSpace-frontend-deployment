"use client";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form"; // Import Controller
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FormSchema = z.object({
  location: z.string().optional(),
  budget: z.string().min(1, {
    message: "Budget is required",
  }),
  property: z.string().optional(),
});

const LandingPage = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      location: "",
      budget: "",
      property: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    form.reset();
  }

  return (
    <div className="relative w-full h-[50vh] sm:h-[20vh] md:h-[30vh] lg:h-[60vh] flex flex-col items-center justify-center">
      <div className="absolute z-10 flex justify-center items-start w-full mt-8 px-4 sm:px-6 md:px-8">
        <Form {...form}>
          <div className="bg-white p-3 rounded-3xl sm:rounded-full px-5">
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-2 w-full"
            >
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        placeholder="Location..."
                        {...field}
                        className="border-2 border-gray-300 p-2 rounded-md w-full"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Controller
                        control={form.control}
                        name="budget"
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={(value) => field.onChange(value)}
                          >
                            <SelectTrigger className="w-full p-2 border-2 border-gray-300 rounded-md">
                              <SelectValue placeholder="Budget..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem
                                  value="< 10000"
                                  className="cursor-pointer"
                                >
                                  &lt; 10000
                                </SelectItem>
                                <SelectItem
                                  value="10000 - 30000"
                                  className="cursor-pointer"
                                >
                                  10000 - 30000
                                </SelectItem>
                                <SelectItem
                                  value="30000 - 50000"
                                  className="cursor-pointer"
                                >
                                  30000 - 50000
                                </SelectItem>
                                <SelectItem
                                  value="50000 - 100000"
                                  className="cursor-pointer"
                                >
                                  50000 - 100000
                                </SelectItem>
                                <SelectItem
                                  value="> 100000"
                                  className="cursor-pointer"
                                >
                                  &gt; 100000
                                </SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="property"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Controller
                        control={form.control}
                        name="property"
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={(value) => field.onChange(value)}
                          >
                            <SelectTrigger className="w-full p-2 border-2 border-gray-300 rounded-md">
                              <SelectValue placeholder="Property Type..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem
                                  value="1 BHK"
                                  className="cursor-pointer"
                                >
                                  1 BHK
                                </SelectItem>
                                <SelectItem
                                  value="2 BHK"
                                  className="cursor-pointer"
                                >
                                  2 BHK
                                </SelectItem>
                                <SelectItem
                                  value="Single Room"
                                  className="cursor-pointer"
                                >
                                  Single Room
                                </SelectItem>
                                <SelectItem
                                  value="Double Room"
                                  className="cursor-pointer"
                                >
                                  Double Room
                                </SelectItem>
                                <SelectItem
                                  value="Flat"
                                  className="cursor-pointer"
                                >
                                  Flat
                                </SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" variant="default">
                {" "}
                Search{" "}
              </Button>
            </form>
          </div>
        </Form>
      </div>

      <Image
        src="/assets/images/landing-page.jpg"
        alt="Landing Page"
        layout="fill"
        objectFit="cover"
        className="w-full h-full"
      />
      <div className="absolute inset-0 bg-black opacity-50"></div>
    </div>
  );
};

export default LandingPage;
