import Image from "next/image";

const page = () => {
  return (
    <>
      <div className="relative w-full h-[50vh]">
        <Image
          src="/assets/images/terms-and-conditions.jpg"
          alt="Search Results"
          layout="fill"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black opacity-20"></div>

        <div className="absolute inset-0 flex items-end justify-left p-8 px-16">
          <p
            className="text-white text-4xl font-bold font-sans"
            style={{ fontFamily: "Arial, Arial, sans-serif" }}
          >
            Terms and Conditions
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 sm:p-8 md:p-12 lg:p-16 leading-relaxed text-black">
      <h1 className="text-xl text-left">
          Last Updated: 2024-11-08
        </h1>

      <h2 className="text-xl font-semibold mt-6">1. Acceptance of Terms</h2>
      <p className="mt-2">
        By accessing or using the <strong>meroSpace</strong> platform, you agree to comply with these Terms and Conditions. If you disagree with any part of these terms, please discontinue use of our services immediately.
      </p>

      <h2 className="text-xl font-semibold mt-6">2. Description of Services</h2>
      <p className="mt-2">
        <strong>meroSpace</strong> provides a platform for users to find rental properties, including rooms, flats, houses, land, shutters, and commercial spaces. Our service is intended to connect renters with property owners without brokerage fees or additional charges.
      </p>

      <h2 className="text-xl font-semibold mt-6">3. User Responsibilities</h2>
      <p className="mt-2">
        By using <strong>meroSpace</strong>, you agree to:
      </p>
      <ul className="list-disc list-inside ml-4 mt-2">
        <li>Provide accurate, current, and complete information during registration and listing of properties.</li>
        <li>Comply with all applicable laws, including real estate and rental regulations in your area.</li>
        <li>Respect the rights and privacy of other users on the platform.</li>
        <li>Refrain from posting misleading, fraudulent, or offensive content.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6">4. Account Registration</h2>
      <p className="mt-2">
        Users may be required to register an account to use certain features of <strong>meroSpace</strong>. You are responsible for safeguarding your account information and agree not to share your login credentials with others. We reserve the right to terminate accounts found to be in violation of these terms.
      </p>

      <h2 className="text-xl font-semibold mt-6">5. Listings and Content</h2>
      <p className="mt-2">
        Users are responsible for the accuracy and legality of the property listings they post on <strong>meroSpace</strong>. All listings should provide truthful descriptions, and any inaccuracies or misrepresentations may result in the removal of your listing or account suspension.
      </p>

      <h2 className="text-xl font-semibold mt-6">6. Payment Terms</h2>
      <p className="mt-2">
        While <strong>meroSpace</strong> is a commission-free platform, any transactions or agreements between renters and property owners are strictly between those parties. <strong>meroSpace</strong> does not facilitate payments, manage transactions, or offer any form of payment protection.
      </p>

      <h2 className="text-xl font-semibold mt-6">7. Prohibited Activities</h2>
      <p className="mt-2">
        Users agree not to engage in any prohibited activities, including but not limited to:
      </p>
      <ul className="list-disc list-inside ml-4 mt-2">
        <li>Using the platform for illegal or unauthorized purposes.</li>
        <li>Posting spam, unsolicited ads, or misleading information.</li>
        <li>Attempting to disrupt or harm the platform or its users.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6">8. Limitation of Liability</h2>
      <p className="mt-2">
        <strong>meroSpace</strong> is not responsible for any damages, losses, or disputes that may arise from interactions between users on the platform. All users assume full responsibility for their actions, and <strong>meroSpace</strong> provides no guarantees or warranties regarding property listings or user interactions.
      </p>

      <h2 className="text-xl font-semibold mt-6">9. Intellectual Property</h2>
      <p className="mt-2">
        All content on the <strong>meroSpace</strong> website, including text, graphics, and logos, is the property of <strong>meroSpace</strong> and protected by copyright laws. Users are prohibited from reproducing, distributing, or otherwise using any content without prior permission.
      </p>

      <h2 className="text-xl font-semibold mt-6">10. Changes to Terms and Conditions</h2>
      <p className="mt-2">
        We may update these Terms and Conditions periodically. Continued use of the <strong>meroSpace</strong> platform after any changes indicates your acceptance of the revised terms. Please review this page regularly to stay informed of updates.
      </p>

      <h2 className="text-xl font-semibold mt-6">11. Governing Law</h2>
      <p className="mt-2">
        These Terms and Conditions are governed by the laws of [Insert Jurisdiction]. Any disputes arising from the use of <strong>meroSpace</strong> shall be resolved in the courts located in [Insert Location].
      </p>

      <h2 className="text-xl font-semibold mt-6">12. Contact Us</h2>
      <p className="mt-2">
        If you have any questions or concerns regarding these Terms and Conditions, please contact us at:
      </p>
      <p className="mt-2">
          <strong>Email</strong>:             <a
              href="mailto:khemrajshrestha471@gmail.com"
              className="text-black no-underline"
            >khemrajshrestha@gmail.com</a>
          <br />
          <strong>Address</strong>: Kathmandu, Nepal
        </p>
    </div>
    </>
  );
};

export default page;
