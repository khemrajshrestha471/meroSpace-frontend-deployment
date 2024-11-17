// "use client";
// import Image from "next/image";
// import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min";
// import { decodeToken } from "@/components/utils/decodeToken.js";
// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { useRouter, usePathname } from "next/navigation";
// interface DecodedToken {
//   username: string;
//   role: string;
//   userId: string;
// }

// const Navbar = () => {
//   const pathname = usePathname();
//   const router = useRouter();
//   const [username, setUsername] = useState("");
//   const [role, setRole] = useState("");
//   const [id, setId] = useState("");
//   const [isDecodedToken, setIsDecodedToken] = useState<DecodedToken | null>(
//     null
//   );
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       const decodedToken = decodeToken(token);
//       setIsDecodedToken(decodedToken);
//       if (decodedToken) {
//         setUsername(decodedToken.username);
//         setRole(decodedToken.role);
//         setId(decodedToken.userId);
//       }
//     } else {
//       return;
//     }
//   }, []);

//   const handleLogOut = async () => {
//     try {
//       const response = await fetch("https://mero-space-backend-deployment.vercel.app/logout", {
//         method: "POST",
//         credentials: "include",
//       });

//       if (response.ok) {
//         localStorage.removeItem("token");
//         router.push("/");
//         window.location.reload();
//       } else {
//         console.error("Logout failed");
//       }
//     } catch (error) {
//       console.error("An error occurred during logout:", error);
//       console.error("Token:", isDecodedToken);
//     }
//   };

//   return (
//     <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
//       <div className="container-fluid">
//         <a className="navbar-brand flex items-center" href="/">
//           <Image
//             src="/assets/images/logo.png"
//             width={30}
//             height={30}
//             alt="meroSpace's logo"
//             unoptimized
//           />
//           meroSpace
//         </a>
//         <ul className="navbar-nav me-auto">
//           {role === "admin" ? (
//             <>
//               <li className="nav-item">
//                 <a
//                   // className="nav-link active"
//                   className={`nav-link ${
//                     pathname.startsWith(
//                       `/controller/admin/dashboard`
//                     )
//                       ? "active"
//                       : ""
//                   }`}
//                   href={`/controller/admin/dashboard?username=${username}&role=${role}&Id=${id}`}
//                 >
//                   Dashboard
//                 </a>
//               </li>
//               <li className="nav-item">
//                 <a
//                   // className="nav-link active"
//                   className={`nav-link ${
//                     pathname.startsWith(
//                       `/controller/admin/view-feedback`
//                     )
//                       ? "active"
//                       : ""
//                   }`}
//                   href={`/controller/admin/view-feedback?username=${username}&role=${role}&Id=${id}`}
//                 >
//                   View Feedback
//                 </a>
//               </li>
//               <li className="nav-item">
//                 <a
//                   // className="nav-link active"
//                   className={`nav-link ${
//                     pathname.startsWith(
//                       `/controller/admin/upload-testimonial`
//                     )
//                       ? "active"
//                       : ""
//                   }`}
//                   href={`/controller/admin/upload-testimonial?username=${username}&role=${role}&Id=${id}`}
//                 >
//                   Upload Testimonial
//                 </a>
//               </li>
//             </>
//           ) : (
//             <></>
//           )}
//         </ul>
//         <button
//           className="navbar-toggler"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#navbarSupportedContent"
//           aria-controls="navbarSupportedContent"
//           aria-expanded="false"
//           aria-label="Toggle navigation"
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>
//         <div className="collapse navbar-collapse" id="navbarSupportedContent">
//           <div className="ml-auto flex space-x-4 items-center">
//             {role === "admin" ? (
//               <>
//                 <Link
//                   href={`/controller/admin/profile?username=${username}&role=${role}&Id=${id}`}
//                   className="text-white no-underline"
//                 >
//                   {username || "Loading..."}
//                 </Link>
//                 <Button variant="outline" onClick={handleLogOut}>
//                   Logout
//                 </Button>
//               </>
//             ) : (
//               <></>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;







"use client";

import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
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
import { FaBars, FaTimes } from "react-icons/fa";

import { ImUpload } from "react-icons/im";
import { TbMapSearch } from "react-icons/tb";
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
  const [isLoginRegister, setIsLoginRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [id, setId] = useState("");
  const [isDecodedToken, setIsDecodedToken] = useState<DecodedToken | null>(
    null
  );
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
  const [isRegisterDropdownOpen, setIsRegisterDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
      const response = await fetch("https://mero-space.vercel.app/logout", {
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
    setIsLoginRegister(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
        <div className="container-fluid">
          {role === "uploader" ? (
            <a
              className="navbar-brand flex items-center"
              href={`/dashboard-uploader?username=${username}&role=${role}&Id=${id}`}
            >
              <Image
                src="/assets/images/logo.png"
                width={30}
                height={30}
                alt="meroSpace's logo"
                unoptimized
              />
              meroSpace
            </a>
          ) : role === "seeker" ? (
            <a
              className="navbar-brand flex items-center"
              href={`/dashboard-seeker?username=${username}&role=${role}&Id=${id}`}
            >
              <Image
                src="/assets/images/logo.png"
                width={30}
                height={30}
                alt="meroSpace's logo"
                unoptimized
              />
              meroSpace
            </a>
          ) : (
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
          )}

          <button className="navbar-toggler" type="button" onClick={toggleMenu}>
            {isMenuOpen ? <FaTimes /> : <FaBars />}{" "}
            {/* Toggle between hamburger and close icon */}
          </button>
          <div
            className={`navbar-collapse ${
              isMenuOpen ? "block" : "hidden"
            } lg:flex`}
            id="navbarSupportedContent"
          >
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
                      pathname.startsWith(
                        `/dashboard-seeker/upload-requirement`
                      )
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

            <div className="flex space-x-4 items-center">
              {!isLoginRegister ? (
                <>
                  <DropdownMenu open={isLoginDropdownOpen}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        onMouseEnter={() => setIsLoginDropdownOpen(true)}
                        onMouseLeave={() => setIsLoginDropdownOpen(false)}
                      >
                        Login
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-46"
                      onMouseEnter={() => setIsLoginDropdownOpen(true)}
                      onMouseLeave={() => setIsLoginDropdownOpen(false)}
                    >
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

                  <DropdownMenu open={isRegisterDropdownOpen}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        onMouseEnter={() => setIsRegisterDropdownOpen(true)}
                        onMouseLeave={() => setIsRegisterDropdownOpen(false)}
                      >
                        Register
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-46"
                      onMouseEnter={() => setIsRegisterDropdownOpen(true)}
                      onMouseLeave={() => setIsRegisterDropdownOpen(false)}
                    >
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
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
