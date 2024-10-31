"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { decodeToken } from "@/components/utils/decodeToken";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type UploaderData = {
  id: string;
  unique_id: string;
  headline: string;
  description: string;
  tentative_price: string;
};

interface DecodedToken {
  username: string;
  role: string;
  userId: string;
}

const Page = () => {
  const [data, setData] = useState<UploaderData[]>([]);
  const [contactNumber, setContactNumber] = useState("");
  const searchParams = useSearchParams();
  const Pid = searchParams.get("Pid");
  const [isBookNowButton, setIsBookNowButton] = useState(true);
  const router = useRouter();
  const [expiryTime, setExpiryTime] = useState(0);
  const [isDecodedToken, setIsDecodedToken] = useState<DecodedToken | null>(
    null
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login-as-uploader");
    } else {

      try {
        const decodedToken = decodeToken(token);
        const role = decodedToken.role;
        if(role === 'uploader') {
          setIsBookNowButton(false);
        }
        setIsDecodedToken(decodedToken);
        if (decodedToken && decodedToken.exp) {
          setExpiryTime(decodedToken.exp);
        }
        if (decodedToken && decodedToken.username && decodedToken.userId) {
          const queryParams = new URLSearchParams(window.location.search);


          const urlUsername = queryParams.get("username") || "";
          const urlRole = queryParams.get("role") || "";
          const urlId = queryParams.get("Id") || "";
          if (
            !queryParams.has("username") ||
            !queryParams.has("role") ||
            !queryParams.has("Id") ||
            urlUsername !== decodedToken.username ||
            urlRole !== decodedToken.role ||
            urlId !== decodedToken.userId
          ) {
            router.push(
              `/dashboard-uploader/view-requirements?username=${decodedToken.username}&role=${decodedToken.role}&Id=${decodedToken.userId}`
            );
          }
        }
      

    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://mero-space-backend-deployment.vercel.app/get-unique-requirement/${Pid}`
        );
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  } catch (error) {
    console.error("Error decoding token:", error);
    console.error("Token:", isDecodedToken);
    // In case of an invalid token, redirect to login
    router.push("/login-as-uploader");
  }
}
}, [Pid]);

    // Check if the token has expired
    useEffect(() => {
      if (expiryTime > 0) {
        const currentTime = Date.now() / 1000;
  
        if (expiryTime < currentTime) {
          // If token is expired, redirect to login
          localStorage.removeItem("token");
          router.push("/login-as-uploader");
        }
      }
    }, [expiryTime, router]);

  const getContactDetailsOfSeeker = async () => {
    try {
      const response = await fetch(
        `https://mero-space-backend-deployment.vercel.app/get-requirement-seeker-phone-number/${Pid}`
      );
      const result = await response.json();
      setContactNumber(result.p_number);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  return (
    <div>
      {data.map((item) => {
        return (
          <div key={item.unique_id} className="p-3 clearfix">
            <h2 className="text-center">{item.headline}</h2>
            <p className="text-center">{item.description}</p>
            <p className="text-center font-bold">Tentative Price: {item.tentative_price}</p>
            <div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
          <Button className="bg-green-600 float-right" disabled={isBookNowButton} onClick={getContactDetailsOfSeeker}>Get Details</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Details of this requirement seeker!
              </AlertDialogTitle>
              <AlertDialogDescription>
                Contact Number of this requirement uploader:- {contactNumber}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Okay</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
          </div>
        );
      })}
    </div>
  );
};

export default Page;
