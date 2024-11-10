import Image from "next/image";
import { Button } from "@/components/ui/button";

const AboutUs = () => {
  return (
    <>
      <p className="text-center text-2xl font-semibold text-blue-500">
        About Us
      </p>
      <div className="flex flex-col lg:flex-row justify-center items-center -m-7 w-full max-w-6xl mx-auto p-4 mb-2">
        <div className="relative text-md md:text-md lg:text-md leading-relaxed lg:w-1/2">
          <p>
            Welcome to <span className="font-semibold">meroSpace</span> – the
            ultimate platform connecting people with places. Our mission is to
            make finding and listing rooms easier, faster, and more reliable for
            everyone. At meroSpace, we bring together
            <span className="font-semibold"> room uploaders</span> and
            <span className="font-semibold"> seekers</span> in one convenient
            place, creating a streamlined process for room rentals, sales, and
            requirements.
          </p>
          <a href="/about-us">
            <Button className="absolute bottom-2 right-0 -mb-6 mr-7">
              Read More
            </Button>
          </a>
        </div>
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end mt-4 lg:mt-0">
          <Image
            src="/assets/images/meroSpace.png"
            alt="MeroSpace Thumbnail Image"
            width={550}
            height={500}
            className="rounded-lg max-w-full lg:max-w-6xl"
          />
        </div>
      </div>
    </>
  );
};

export default AboutUs;
