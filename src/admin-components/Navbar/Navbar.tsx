"use client";

import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { decodeToken } from "@/components/utils/decodeToken.js";
import Image from "next/image";

interface DecodedToken {
  username: string;
  role: string;
  userId: string;
}

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [id, setId] = useState("");
  const [isDecodedToken, setIsDecodedToken] = useState<DecodedToken | null>(
    null
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    } else {
      return;
    }
  }, []);

  const handleLogOut = async () => {
    try {
      const response = await fetch("https://mero-space-backend-deployment.vercel.app/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        localStorage.removeItem("token");
        router.push("/");
        window.location.reload();
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
      console.error("Token:", isDecodedToken);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
        <div className="container-fluid">
        <a className="navbar-brand flex items-center" href="/">
          <Image
            src="/assets/images/logo.png"
            width={30}
            height={30}
            alt="meroSpace's logo"
            unoptimized
          />
          meroSpace
        </a>

          <button className="navbar-toggler" type="button" onClick={toggleMenu}>
            {isMenuOpen ? <FaTimes /> : <FaBars />}
            {/* Toggle between hamburger and close icon */}
          </button>
          <div
            className={`navbar-collapse ${
              isMenuOpen ? "block" : "hidden"
            } lg:flex`}
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {role === "admin" ? (
            <>
              <li className="nav-item">
                <a
                  // className="nav-link active"
                  className={`nav-link ${
                    pathname.startsWith(
                      `/controller/admin/dashboard`
                    )
                      ? "active"
                      : ""
                  }`}
                  href={`/controller/admin/dashboard?username=${username}&role=${role}&Id=${id}`}
                >
                  Dashboard
                </a>
              </li>
              <li className="nav-item">
                <a
                  // className="nav-link active"
                  className={`nav-link ${
                    pathname.startsWith(
                      `/controller/admin/view-feedback`
                    )
                      ? "active"
                      : ""
                  }`}
                  href={`/controller/admin/view-feedback?username=${username}&role=${role}&Id=${id}`}
                >
                  View Feedback
                </a>
              </li>
              <li className="nav-item">
                <a
                  // className="nav-link active"
                  className={`nav-link ${
                    pathname.startsWith(
                      `/controller/admin/upload-testimonial`
                    )
                      ? "active"
                      : ""
                  }`}
                  href={`/controller/admin/upload-testimonial?username=${username}&role=${role}&Id=${id}`}
                >
                  Upload Testimonial
                </a>
              </li>
            </>
          ) : (
            <></>
          )}
            </ul>

            <div className="ml-auto flex space-x-4 items-center">
            {role === "admin" ? (
              <>
                <Link
                  href={`/controller/admin/profile?username=${username}&role=${role}&Id=${id}`}
                  className="text-white no-underline"
                >
                  {username || "Loading..."}
                </Link>
                <Button variant="outline" onClick={handleLogOut}>
                  Logout
                </Button>
              </>
            ) : (
              <></>
            )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
