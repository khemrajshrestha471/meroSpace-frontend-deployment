import LandingPage from "@/components/landingPage/LandingPage"
import Products from "@/components/products/Products"
import Faqs from "@/components/faqs/Faqs"
import Testimonial from "@/components/testimonial/Testimonial"


const page = () => {
  return (
    <div>
      <LandingPage />
      <Products />
      <Faqs />
      <Testimonial />
    </div>
  )
}

export default page