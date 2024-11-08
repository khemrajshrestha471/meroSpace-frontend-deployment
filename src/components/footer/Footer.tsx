"use client";

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
import { decodeToken } from "@/components/utils/decodeToken.js";
import { useEffect, useState } from "react";

const Footer = () => {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [id, setId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = decodeToken(token);
      if (decodedToken) {
        setUsername(decodedToken.username);
        setRole(decodedToken.role);
        setId(decodedToken.userId);
      }
    } else {
      return;
    }
  }, []);

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
            <a href="/privacy-policy" className="no-underline text-black">Privacy Policy</a>
          </li>
          <li
            className="text-black font-thin mt-1 list-none"
            style={{ fontFamily: "Arial, sans-serif" }}
          >
            <a href="/terms-and-conditions" className="no-underline text-black">Terms and Conditions</a>
          </li>
        </div>

        <div className="flex flex-col items-center space-y-2 w-full md:w-auto">
          {role === "uploader" ? (
            <a
              className="navbar-brand flex items-center"
              href={`/dashboard-uploader?username=${username}&role=${role}&Id=${id}`}
            >
              <Image
                src="/assets/images/logo.png"
                width={120}
                height={120}
                alt="meroSpace's logo"
                className="-mt-3"
                unoptimized
              />
            </a>
          ) : role === "seeker" ? (
            <a
              className="navbar-brand flex items-center"
              href={`/dashboard-seeker?username=${username}&role=${role}&Id=${id}`}
            >
              <Image
                src="/assets/images/logo.png"
                width={120}
                height={120}
                alt="meroSpace's logo"
                className="-mt-3"
                unoptimized
              />
            </a>
          ) : (
            <a className="navbar-brand flex items-center" href="/">
              <Image
                src="/assets/images/logo.png"
                width={120}
                height={120}
                alt="meroSpace's logo"
                className="-mt-3"
                unoptimized
              />
            </a>
          )}
          <div
            className="text-black font-thin text-center flex items-center space-x-2"
            style={{ fontFamily: "Arial, sans-serif" }}
          >
            <FaPhoneAlt />
            <a
              href="https://wa.me/9825988781"
              className="text-black no-underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              9825988781
            </a>
          </div>
          <div
            className="text-black font-thin text-center flex items-center space-x-2"
            style={{ fontFamily: "Arial, sans-serif" }}
          >
            <IoMail />
            <a
              href="mailto:khemrajshrestha471@gmail.com"
              className="text-black no-underline"
            >
              khemrajshrestha471@gmail.com
            </a>
          </div>
          <div className="flex space-x-4 mt-2">
            <a
              href="https://www.linkedin.com/in/khemrajshrestha471/"
              target="_blank"
            >
              <IoLogoLinkedin className="text-xl text-blue-700" />
            </a>
            <a
              href="https://www.facebook.com/khemrajshrestha471"
              target="_blank"
            >
              <FaSquareFacebook className="text-xl text-blue-600" />
            </a>
            <a
              href="https://www.instagram.com/khemrajshrestha471/"
              target="_blank"
            >
              <FaSquareInstagram className="text-xl text-pink-500" />
            </a>
            <a href="https://discord.gg/6NVW4MjZ" target="_blank">
              <BsDiscord className="text-xl text-indigo-600" />
            </a>
            <a href="https://www.khemrajshrestha.com.np/" target="_blank">
              <TbWorldCode className="text-xl text-gray-600" />
            </a>
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
          <FaCopyright className="mr-1" />
          <a
            href="https://www.khemrajshrestha.com.np/"
            className="no-underline text-slate-800 mr-1"
            target="_blank"
          >
            KHEM RAJ SHRESTHA
          </a>
          2024 | All rights reserved
        </p>
      </div>
    </>
  );
};

export default Footer;
