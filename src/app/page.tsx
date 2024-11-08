import LandingPage from "@/components/landingPage/LandingPage"
import Products from "@/components/products/Products"
import Faqs from "@/components/faqs/Faqs"

const page = () => {
  return (
    <div>
      <LandingPage />
      <Products />
      <Faqs />
    </div>
  )
}

export default page