import Image from "next/image";
import { FaPhoneAlt } from "react-icons/fa";
import { IoMail, IoLogoLinkedin } from "react-icons/io5";
import {
  FaSquareFacebook,
  FaSquareInstagram,
  FaCopyright,
} from "react-icons/fa6";
import { BsDiscord } from "react-icons/bs";
import { TbWorldCode } from "react-icons/tb";

const Footer = () => {
  return (
    <>
      <div className="bg-gray-100 w-full h-auto flex flex-wrap justify-evenly text-center py-3 space-y-5 md:space-y-0 md:flex-nowrap md:h-[40vh]">
        <div className="w-full md:w-auto">
          <p className="font-semibold text-blue-500 text-lg md:text-xl">
            Most Searched Location
          </p>
          <li
            className="text-black font-thin mt-1 list-none"
            style={{ fontFamily: "Arial, sans-serif" }}
          >
            Hattigauda
          </li>
          <li
            className="text-black font-thin mt-1 list-none"
            style={{ fontFamily: "Arial, sans-serif" }}
          >
            Thapathali, Kathmandu
          </li>
          <li
            className="text-black font-thin mt-1 list-none"
            style={{ fontFamily: "Arial, sans-serif" }}
          >
            Kalanki, Kathmandu
          </li>
        </div>

        <div className="w-full md:w-auto">
          <p className="font-semibold text-blue-500 text-lg md:text-xl">
            Quick Links
          </p>
          <li
            className="text-black font-thin mt-1 list-none"
            style={{ fontFamily: "Arial, sans-serif" }}
          >
            Blog
          </li>
        </div>

        <div className="w-full md:w-auto">
          <p className="font-semibold text-blue-500 text-lg md:text-xl">
            Accounts
          </p>
          <li
            className="text-black font-thin mt-1 list-none"
            style={{ fontFamily: "Arial, sans-serif" }}
          >
            Privacy Policy
          </li>
          <li
            className="text-black font-thin mt-1 list-none"
            style={{ fontFamily: "Arial, sans-serif" }}
          >
            Terms and Conditions
          </li>
        </div>

        <div className="flex flex-col items-center space-y-2 w-full md:w-auto">
          <Image
            src="/assets/images/logo.png"
            width={120}
            height={120}
            alt="meroSpace's logo"
            className="-mt-3"
            unoptimized
          />
          <div
            className="text-black font-thin text-center flex items-center space-x-2"
            style={{ fontFamily: "Arial, sans-serif" }}
          >
            <FaPhoneAlt />
            <span>9825988781</span>
          </div>
          <div
            className="text-black font-thin text-center flex items-center space-x-2"
            style={{ fontFamily: "Arial, sans-serif" }}
          >
            <IoMail />
            <span>khemrajshrestha471@gmail.com</span>
          </div>
          <p
            className="text-black font-thin text-center"
            style={{ fontFamily: "Arial, sans-serif" }}
          >
            Reach out to me via
          </p>
          <div className="flex space-x-4 mt-2">
            <IoLogoLinkedin className="text-xl" />
            <FaSquareFacebook className="text-xl" />
            <FaSquareInstagram className="text-xl" />
            <BsDiscord className="text-xl" />
            <TbWorldCode className="text-xl" />
          </div>
        </div>
      </div>

      <div className="w-full px-4 md:px-28 py-2 text-center md:text-center">
        <p className="text-sm md:text-base text-justify">
          <span className="font-bold">meroSpace</span> is a platform designed
          for individuals seeking rental properties such as rooms, flats,
          houses, land, shutters, and commercial spaces, without the burden of
          paying any brokerage fees. Whether you're looking for a place to rent
          or a roommate, short-term or long-term paying guest, or a tenant,
          meroSpace offers a hassle-free experience.
          <br />
          <span className="italic">
            This platform is 100% commission-free, ensuring that both landlords
            and tenants can connect directly, without any service charges.
            meroSpace is committed to providing a seamless and transparent
            process for all your rental needs.
          </span>
        </p>
        <p className="flex items-center justify-center mt-2 text-xs md:text-sm text-center">
          <FaCopyright className="mr-1" /> <a href="https://www.khemrajshrestha.com.np/" className="no-underline text-slate-800 mr-1" target="_blank">KHEM RAJ SHRESTHA</a> 2024 | All rights
          reserved
        </p>
      </div>

    </>
  );
};

export default Footer;
