"use client";
import { useEffect, useState, useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";

type TestimonialData = {
  id: string;
  role: string;
  name: string;
  testimonial: string;
  imageUrl: string;
  location: string;
};

export default function Testimonial() {
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));
  const [data, setData] = useState<TestimonialData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://mero-space-backend-deployment.vercel.app/get-all-testimonial"
        );
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <p className="text-center text-2xl font-semibold text-blue-500">
        Testimonial
      </p>
      <div className="flex justify-center items-center m-4">
        <Carousel
          plugins={[plugin.current]}
          onMouseEnter={() => plugin.current.stop()}
          onMouseLeave={() => plugin.current.play()}
          className="w-full max-w-6xl"
        >
          <CarouselContent>
            {data.map((item) => (
              <CarouselItem key={item.id} className="md:basis-1/3 lg:basis-1/4">
                <div>
                  <Card className="flex flex-col items-center p-4 overflow-hidden relative h-[53vh]">
                    <CardHeader className="text-justify p-0 flex-grow">
                      <CardDescription className="text-black text-justify overflow-hidden text-ellipsis">
                        {item.testimonial}
                      </CardDescription>
                    </CardHeader>
                    <div className="flex justify-center">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-20 w-20 object-cover rounded-full border-4 border-blue-400"
                      />
                      <div className="absolute top-0 right-0 bg-blue-500 text-white font-semibold text-xs px-4 py-1 rounded-tr-lg rounded-bl-lg">
                        {item.role}
                      </div>
                    </div>
                    <CardHeader className="text-center p-1">
                      <CardDescription className="font-bold text-black text-lg mb-0">
                        {item.name}
                      </CardDescription>
                      <CardDescription className="text-gray-600 text-sm">
                        {item.location}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </>
  );
}
