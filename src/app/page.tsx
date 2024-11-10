import LandingPage from "@/components/landingPage/LandingPage"
import Products from "@/components/products/Products"
import Faqs from "@/components/faqs/Faqs"
import Testimonial from "@/components/testimonial/Testimonial"
import AboutUs from "@/components/about-us/AboutUs"


const page = () => {
  return (
    <div>
      <LandingPage />
      <Products />
      <Faqs />
      <Testimonial />
      <AboutUs />
    </div>
  )
}

export default page