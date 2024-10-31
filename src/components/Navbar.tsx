"use client";

import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useEffect, useState } from "react";

import { ImUpload } from "react-icons/im";
import { TbMapSearch } from "react-icons/tb";
import { decodeToken } from "@/components/utils/decodeToken.js";

interface DecodedToken {
  username: string;
  role: string;
  userId: string;
}

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoginRegister, setIsLoginRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [id, setId] = useState("");
  const [isDecodedToken, setIsDecodedToken] = useState<DecodedToken | null>(
    null
  );
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoginRegister(true);
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
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
      console.error("Token:", isDecodedToken);
    }
    setIsLoginRegister(false);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
        <div className="container-fluid">
          {role === "uploader" ? (
            <a
              className="navbar-brand"
              href={`/dashboard-uploader?username=${username}&role=${role}&Id=${id}`}
            >
              meroSpace
            </a>
          ) : role === "seeker" ? (
            <a
              className="navbar-brand"
              href={`/dashboard-seeker?username=${username}&role=${role}&Id=${id}`}
            >
              meroSpace
            </a>
          ) : (
            <a className="navbar-brand" href="/">
              meroSpace
            </a>
          )}

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                {role === "uploader" ? (
                  <a
                    className={`nav-link ${
                      pathname.startsWith(
                        `/dashboard-uploader/upload-availability`
                      )
                        ? "active"
                        : ""
                    }`}
                    href={`/dashboard-uploader/upload-availability?username=${username}&role=${role}&Id=${id}`}
                  >
                    Upload Availability
                  </a>
                ) : role === "seeker" ? (
                  <a
                    className={`nav-link ${
                      pathname.startsWith(`/dashboard-seeker/upload-requirement`)
                        ? "active"
                        : ""
                    }`}
                    href={`/dashboard-seeker/upload-requirement?username=${username}&role=${role}&Id=${id}`}
                  >
                    Upload Requirement
                  </a>
                ) : (
                  <></>
                )}
              </li>
              <li className="nav-item">
                {role === "uploader" ? (
                  <a
                    className={`nav-link ${
                      pathname.startsWith(
                        `/dashboard-uploader/view-requirements`
                      )
                        ? "active"
                        : ""
                    }`}
                    href={`/dashboard-uploader/view-requirements?username=${username}&role=${role}&Id=${id}`}
                  >
                    View Requirements
                  </a>
                ) : role === "seeker" ? (
                  <a className="nav-link" href="#">
                    Something new
                  </a>
                ) : (
                  <></>
                )}
              </li>
            </ul>

            {!isLoginRegister ? (
              <div className="flex space-x-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">Login</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-46">
                    <DropdownMenuGroup>
                      <Link
                        href="/login-as-uploader"
                        className="no-underline text-black"
                      >
                        <DropdownMenuItem>
                          <ImUpload className="mr-2 h-4 w-4" />
                          <span className="cursor-pointer">
                            Login as Uploader
                          </span>
                        </DropdownMenuItem>
                      </Link>
                      <Link
                        href="/login-as-seeker"
                        className="no-underline text-black"
                      >
                        <DropdownMenuItem>
                          <TbMapSearch className="mr-2 h-4 w-4" />

                          <span className="cursor-pointer">
                            Login as Seeker
                          </span>
                        </DropdownMenuItem>
                      </Link>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">Register</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-46">
                    <DropdownMenuGroup>
                      <Link
                        href="/register-as-uploader"
                        className="no-underline text-black"
                      >
                        <DropdownMenuItem>
                          <ImUpload className="mr-2 h-4 w-4" />

                          <span className="cursor-pointer">
                            Register as Uploader
                          </span>
                        </DropdownMenuItem>
                      </Link>
                      <Link
                        href="/register-as-seeker"
                        className="no-underline text-black"
                      >
                        <DropdownMenuItem>
                          <TbMapSearch className="mr-2 h-4 w-4" />

                          <span className="cursor-pointer">
                            Register as Seeker
                          </span>
                        </DropdownMenuItem>
                      </Link>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex space-x-4 items-center">
                {role === "uploader" ? (
                  <Link
                    href={`/dashboard-uploader/profile?username=${username}&role=${role}&Id=${id}`}
                    className="text-white no-underline"
                  >
                    {username || "Loading..."}
                  </Link>
                ) : role === "seeker" ? (
                  <Link
                    href={`/dashboard-seeker/profile?username=${username}&role=${role}&Id=${id}`}
                    className="text-white no-underline"
                  >
                    {username || "Loading..."}
                  </Link>
                ) : (
                  <></>
                )}

                <Button variant="outline" onClick={handleLogOut}>
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
