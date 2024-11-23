import LandingPage from "@/components/landingPage/LandingPage";
import Products from "@/components/products/Products";
import Faqs from "@/components/faqs/Faqs";
import Testimonial from "@/components/testimonial/Testimonial";
import AboutUs from "@/components/about-us/AboutUs";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

const page = () => {
  return (
    <div>
      <LandingPage />
      <Products />
      <div className="flex justify-end max-w-7xl">
        <Link
          href="/view-more-products"
          className="text-blue-500 no-underline font-semibold flex items-center gap-1"
        >
          View More <FaArrowRight />
        </Link>
      </div>
      <Faqs />
      <Testimonial />
      <AboutUs />
    </div>
  );
};

export default page;
