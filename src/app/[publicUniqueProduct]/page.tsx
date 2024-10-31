"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Autoplay from "embla-carousel-autoplay";

import { CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { decodeToken } from "@/components/utils/decodeToken";
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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type UploaderData = {
  id: string;
  unique_id: string;
  headline: string;
  description: string;
  price: string;
  imageUrl: string;
  imageUrls: string[];
};

const Page = () => {
  const [data, setData] = useState<UploaderData[]>([]);
  const [contactNumber, setContactNumber] = useState("");
  const searchParams = useSearchParams();
  const Pid = searchParams.get("Pid");
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));
  const [role, setRole] = useState("");

  const UnexpectedError = (error:string) => {
    toast.error(`An unexpected error occurred. ${error}`, {
      draggable: true,
      theme: "colored",
    });
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = decodeToken(token);
      const decoderRole = decodedToken.role;
      setRole(decoderRole);
    }
    const fetchData = async () => {
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
  }, [Pid]);

  const getContactDetailsOfOwner = async () => {
    if (role === "uploader") {
      toast.error("Error! Uploader role cannot book the room.", {
        draggable: true,
        theme: "colored",
      });
      return;
    } else if (role === "seeker") {
      try {
        const response = await fetch(
          `https://mero-space-backend-deployment.vercel.app/get-owner-phone-number/${Pid}`
        );
        const result = await response.json();
        setContactNumber(result.p_number);
      } catch (error) {
        UnexpectedError(error as string);
      }
    } else {
      toast.error(
        "Error! You need to log in to book the room.",
        {
          draggable: true,
          theme: "colored",
        }
      );
      return;
    }
  };

  return (
    <div>
      {data.map((item) => {
        const combinedImageUrls = [item.imageUrl, ...item.imageUrls];
        return (
          <div key={item.id} className="p-3 clearfix">
            <Carousel
              key={item.unique_id}
              plugins={[plugin.current]}
              onMouseEnter={() => plugin.current.stop()}
              onMouseLeave={() => plugin.current.play()}
            >
              <CarouselContent>
                {combinedImageUrls.map((imageUrl, index) => (
                  <CarouselItem key={index}>
                    <div className="w-full h-[70vh] overflow-hidden flex items-center justify-center">
                      <div className="w-full h-full">
                        <CardContent className="h-full flex items-center justify-center">
                          <img
                            src={imageUrl}
                            alt={`Image ${index + 1}`}
                            className="w-full h-full object-contain"
                          />
                        </CardContent>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            <h2 className="text-center">{item.headline}</h2>
            <p className="text-center">{item.description}</p>
            <p className="text-center font-bold">Cost: {item.price}</p>
            <div>
              {role === "seeker" ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      className="bg-green-600 float-right"
                      onClick={getContactDetailsOfOwner}
                    >
                      Book Now
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Details of this product owner!
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Contact Number of owner:- {contactNumber}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Okay</AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <>
                <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    className="bg-green-600 float-right"
                    onClick={getContactDetailsOfOwner}
                  >
                    Book Now
                  </Button>
                </AlertDialogTrigger>
                </AlertDialog>
                <ToastContainer />
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Page;
