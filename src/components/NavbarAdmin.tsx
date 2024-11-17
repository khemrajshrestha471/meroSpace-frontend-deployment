"use client";
import Image from "next/image";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { decodeToken } from "@/components/utils/decodeToken.js";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
interface DecodedToken {
  username: string;
  role: string;
  userId: string;
}

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [id, setId] = useState("");
  const [isDecodedToken, setIsDecodedToken] = useState<DecodedToken | null>(
    null
  );
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

  return (
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
        <ul className="navbar-nav me-auto">
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
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
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
  );
};

export default Navbar;