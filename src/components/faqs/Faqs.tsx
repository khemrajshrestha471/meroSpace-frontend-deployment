import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion";
  
  const Faqs = () => {
    return (
      <div className="m-6">
        <p className="text-center text-2xl font-semibold">FAQ</p>
        <Accordion
          type="single"
          collapsible
          className="w-full max-w-6xl mx-auto border rounded-lg shadow-lg"
        >
          <AccordionItem value="item-1">
            <AccordionTrigger className="flex items-center justify-between w-full px-4 py-3 text-left text-lg hover:no-underline bg-gray-100 hover:bg-gray-200 rounded-t-lg">
            How do I search for properties on meroSpace?
            </AccordionTrigger>
            <AccordionContent className="px-4 py-3 text-sm text-black bg-white border-t">
            To search for properties, simply enter your location and select the type of property you are looking for. You can then filter results based on your preferences, such as price range, property size, and amenities.
            </AccordionContent>
          </AccordionItem>
  
          <AccordionItem value="item-2">
            <AccordionTrigger className="flex items-center justify-between w-full px-4 py-3 text-left text-lg hover:no-underline bg-gray-100 hover:bg-gray-200">
            Is meroSpace really commission-free?
            </AccordionTrigger>
            <AccordionContent className="px-4 py-3 text-sm text-black bg-white border-t">
            Yes! meroSpace is 100% commission-free. We do not charge any brokerage or service fees, ensuring that landlords and tenants can connect directly without added costs.
            </AccordionContent>
          </AccordionItem>
  
          <AccordionItem value="item-3">
            <AccordionTrigger className="flex items-center justify-between w-full px-4 py-3 text-left text-lg hover:no-underline bg-gray-100 hover:bg-gray-200 rounded-b-lg">
            How do I list my property on meroSpace?
            </AccordionTrigger>
            <AccordionContent className="px-4 py-3 text-sm text-black bg-white border-t">
            To list your property, create an account on meroSpace and go to the "Post a Property" section. Enter the details of your property, upload images, and submit your listing. Once approved, it will be visible to other users.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger className="flex items-center justify-between w-full px-4 py-3 text-left text-lg hover:no-underline bg-gray-100 hover:bg-gray-200 rounded-b-lg">
            What types of properties can I find on meroSpace?
            </AccordionTrigger>
            <AccordionContent className="px-4 py-3 text-sm text-black bg-white border-t">
            You can find a variety of rental properties on meroSpace, including rooms, flats, houses, land, shutters, and commercial spaces. We also support listings for both short-term and long-term rental needs.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger className="flex items-center justify-between w-full px-4 py-3 text-left text-lg hover:no-underline bg-gray-100 hover:bg-gray-200 rounded-b-lg">
            Do I need an account to use meroSpace?
            </AccordionTrigger>
            <AccordionContent className="px-4 py-3 text-sm text-black bg-white border-t">
            You can browse properties without an account, but to save favorites, contact landlords, or list your own property, you will need to create an account on meroSpace.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-6">
            <AccordionTrigger className="flex items-center justify-between w-full px-4 py-3 text-left text-lg hover:no-underline bg-gray-100 hover:bg-gray-200 rounded-b-lg">
            How do I contact a property owner?
            </AccordionTrigger>
            <AccordionContent className="px-4 py-3 text-sm text-black bg-white border-t">
            Once you find a property you're interested in, you can contact the property owner directly through the contact details provided in the listing or by using the contact button if available.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-7">
            <AccordionTrigger className="flex items-center justify-between w-full px-4 py-3 text-left text-lg hover:no-underline bg-gray-100 hover:bg-gray-200 rounded-b-lg">
            Is there a limit to the number of listings I can post?
            </AccordionTrigger>
            <AccordionContent className="px-4 py-3 text-sm text-black bg-white border-t">
            Currently, meroSpace does not impose a strict limit on the number of listings you can post, though we encourage accurate and active listings. Please ensure your listings comply with our guidelines and are up-to-date.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-8">
            <AccordionTrigger className="flex items-center justify-between w-full px-4 py-3 text-left text-lg hover:no-underline bg-gray-100 hover:bg-gray-200 rounded-b-lg">
            What should I do if I encounter an issue on the platform?
            </AccordionTrigger>
            <AccordionContent className="px-4 py-3 text-sm text-black bg-white border-t">
            If you experience any issues or have questions about using meroSpace, please reach out to our support team at via our socials. We are here to help and ensure your experience on meroSpace is as smooth as possible.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  };
  
  export default Faqs;
  