"use client";
import Image from "next/image";

const page = () => {
  return (
    <>
      <div className="relative w-full h-[50vh]">
        <Image
          src="/assets/images/about-us.jpg"
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
            About Us
          </p>
        </div>
      </div>

      <div className="p-8 px-4 md:px-16 lg:px-24 text-black">
        <p className="text-md md:text-md lg:text-md leading-relaxed">
          Welcome to <span className="font-semibold">meroSpace</span> – the
          ultimate platform connecting people with places. Our mission is to
          make finding and listing rooms easier, faster, and more reliable for
          everyone. At meroSpace, we bring together{" "}
          <span className="font-semibold">room uploaders</span> and{" "}
          <span className="font-semibold">seekers</span> in one convenient
          place, creating a streamlined process for room rentals, sales, and
          requirements.
        </p>

        <p className="mt-4 text-md md:text-md lg:text-md leading-relaxed">
          For <span className="font-semibold">uploaders</span>, meroSpace
          provides a quick and simple way to list available rooms. Whether
          you're looking to rent out a spare room or sell a property, our
          platform ensures your listings reach a broad audience of seekers
          actively searching for their next home.
        </p>

        <p className="mt-4 text-md md:text-md lg:text-md leading-relaxed">
          For <span className="font-semibold">seekers</span>, meroSpace
          simplifies the search for your ideal space. Browse a variety of
          listings that suit your needs and budget, or post a detailed room
          requirement, outlining exactly what you're looking for. This unique
          feature allows uploaders to view your requirements and reach out if
          they have a room that matches.
        </p>

        <p className="mt-4 text-md md:text-md lg:text-md leading-relaxed">
          Our platform fosters direct communication between uploaders and
          seekers, enabling efficient and transparent interactions. At
          meroSpace, we’re committed to providing a secure, accessible, and
          user-friendly experience for everyone in the room rental and property
          market.
        </p>

        <p className="mt-4 text-md md:text-md lg:text-md leading-relaxed text-center italic">
          Whether you're posting a room or searching for one, meroSpace is here
          to help you connect, communicate, and find the perfect space.
        </p>
      </div>
    </>
  );
};

export default page;
