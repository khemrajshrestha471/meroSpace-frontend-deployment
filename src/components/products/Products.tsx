"use client";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { decodeToken } from "@/components/utils/decodeToken.js";
import { useRouter } from "next/navigation";

interface DecodedToken {
  username: string;
  role: string;
  userId: string;
}

type UploaderData = {
  id: string;
  unique_id: string;
  headline: string;
  description: string;
  location: string;
  price: number;
  imageUrl: string;
  listing_status: string;
};

export default function Products() {
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));
  const [data, setData] = useState<UploaderData[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [id, setId] = useState("");
  const [isDecodedToken, setIsDecodedToken] = useState<DecodedToken | null>(
    null
  );

  useEffect(() => {
    const isFirstRenderLanding = localStorage.getItem("firstRenderLanding");

    if (!isFirstRenderLanding) {
      localStorage.setItem("firstRenderLanding", "true");
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = decodeToken(token);
      setIsDecodedToken(decodedToken);
      if (decodedToken) {
        setUsername(decodedToken.username);
        setRole(decodedToken.role);
        setId(decodedToken.userId);
      }
      if (role === "uploader") {
        router.push(
          `/dashboard-uploader?username=${decodedToken.username}&role=${decodedToken.role}&Id=${decodedToken.userId}`
        );
      } else if (role === "seeker") {
        router.push(
          `/dashboard-seeker?username=${decodedToken.username}&role=${decodedToken.role}&Id=${decodedToken.userId}`
        );
      }
    }
  }, [username, role, id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://mero-space-backend-deployment.vercel.app/get-all-data");
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        console.log("Token:- ", isDecodedToken)
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex justify-center items-center p-3">
      <Carousel
        plugins={[plugin.current]}
        onMouseEnter={() => plugin.current.stop()}
        onMouseLeave={() => plugin.current.play()}
        className="w-full max-w-6xl"
      >
        <CarouselContent>
          {data.map((item) => (
            <CarouselItem
              key={item.unique_id}
              className="md:basis-1/3 lg:basis-1/4"
            >
              <div className="p-1">
                <Card className="flex flex-col min-h-[350px] overflow-hidden relative">
                  <div className="flex-grow">
                    <img
                      src={item.imageUrl}
                      alt={item.headline}
                      className="h-[200px] w-full object-cover"
                      style={{ borderRadius: "0.5rem 0.5rem 0 0" }}
                    />
                    {item.listing_status !== "None" && (
                      <div className="absolute top-0 right-0 bg-red-500 text-white font-semibold text-xs px-4 py-1 rounded-tr-lg rounded-bl-lg">
                        {item.listing_status}
                      </div>
                    )}
                  </div>
                  <CardHeader className="flex flex-col p-2">
                    <CardTitle className="truncate font-semibold pl-1">
                      {item.headline}
                    </CardTitle>
                    <CardDescription className="truncate text-gray-600 pl-1">
                      {item.description}
                    </CardDescription>
                    <div className="flex justify-between items-center pl-1">
                      <CardDescription className="truncate font-bold">
                        Location: {item.location}
                      </CardDescription>
                      <Link href={`/Unique-Product?Pid=${item.unique_id}`}>
                        <Button className="ml-2">Explore</Button>
                      </Link>
                    </div>
                  </CardHeader>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}