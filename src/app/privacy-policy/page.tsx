import Image from "next/image";

const page = () => {
  return (
    <>
      <div className="relative w-full h-[50vh]">
        <Image
          src="/assets/images/privacy-policy.png"
          alt="Search Results"
          layout="fill"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black opacity-10"></div>

        <div className="absolute inset-0 flex items-end justify-left p-8 px-16">
          <p
            className="text-white text-4xl font-bold font-sans"
            style={{ fontFamily: "Arial, Arial, sans-serif" }}
          >
            Privacy Policy
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 sm:p-8 md:p-12 lg:p-16 leading-relaxed text-black">
        <h1 className="text-xl text-left">Last Updated: 2024-11-08</h1>

        <h2 className="text-xl font-semibold mt-6">
          1. Information We Collect
        </h2>
        <p className="mt-2">
          We collect information to provide better services to all users of
          <strong>meroSpace</strong>. The types of data we may collect include:
        </p>
        <ul className="list-disc list-inside ml-4 mt-2">
          <li>
            <strong>Personal Information</strong>: When you register or contact
            us, we may collect information such as your name, email address,
            phone number, and any other personal details you choose to provide.
          </li>
          <li>
            <strong>Usage Data</strong>: We automatically collect information
            about your interactions with our website, including your IP address,
            browser type, device details, pages visited, and time spent on
            pages.
          </li>
          <li>
            <strong>Location Data</strong>: To improve our services, we may
            collect information about your approximate location, as permitted by
            your device settings.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-6">
          2. How We Use Your Information
        </h2>
        <p className="mt-2">
          We use the information collected for the following purposes:
        </p>
        <ul className="list-disc list-inside ml-4 mt-2">
          <li>
            <strong>Service Provision</strong>: To facilitate connections
            between property owners and renters and provide a seamless platform
            experience.
          </li>
          <li>
            <strong>Improvement of Services</strong>: To personalize and enhance
            our website features, resolve issues, and conduct data analysis.
          </li>
          <li>
            <strong>Communication</strong>: To contact you with relevant
            information, respond to your inquiries, and notify you of updates or
            changes to our services.
          </li>
          <li>
            <strong>Legal Obligations</strong>: To comply with legal
            requirements, enforce our Terms of Service, and protect our rights
            and the safety of our users.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-6">
          3. Sharing of Information
        </h2>
        <p className="mt-2">
          We do not sell or rent your personal information. However, we may
          share your information in specific circumstances:
        </p>
        <ul className="list-disc list-inside ml-4 mt-2">
          <li>
            <strong>With Service Providers</strong>: We may work with
            third-party service providers to assist us in operating our website
            and services, who are required to safeguard your information.
          </li>
          <li>
            <strong>Legal Compliance</strong>: We may share information if
            required to comply with legal obligations or to protect the rights,
            safety, and property of <strong>meroSpace</strong>, our users, or
            others.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-6">
          4. Cookies and Tracking Technologies
        </h2>
        <p className="mt-2">
          We use cookies and similar tracking technologies to enhance your
          experience on <strong>meroSpace</strong>. Cookies are small data files
          stored on your device to remember your preferences and collect usage
          data. You can manage cookie preferences through your browser settings.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          5. Security of Your Information
        </h2>
        <p className="mt-2">
          We implement reasonable security measures to protect your data from
          unauthorized access, alteration, or disclosure. However, please note
          that no transmission over the internet is entirely secure, and we
          cannot guarantee absolute security.
        </p>

        <h2 className="text-xl font-semibold mt-6">6. Your Privacy Rights</h2>
        <p className="mt-2">
          Depending on your location, you may have certain rights regarding your
          personal data:
        </p>
        <ul className="list-disc list-inside ml-4 mt-2">
          <li>
            <strong>Access and Update</strong>: You can access, update, or
            delete your personal information by logging into your account.
          </li>
          <li>
            <strong>Data Portability</strong>: You may request a copy of your
            information in a portable format.
          </li>
          <li>
            <strong>Consent Withdrawal</strong>: You may withdraw your consent
            to the processing of your data at any time, subject to certain
            limitations.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-6">
          7. Links to Other Websites
        </h2>
        <p className="mt-2">
          Our website may contain links to third-party websites. This Privacy
          Policy does not apply to those websites, and we are not responsible
          for their privacy practices. We encourage you to review the privacy
          policies of any third-party sites you visit.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          8. Changes to This Privacy Policy
        </h2>
        <p className="mt-2">
          We may update our Privacy Policy to reflect changes in our practices,
          technology, or legal requirements. When we make changes, we will post
          the updated policy with a revised &quot;Last Updated&quot; date at the top. Your
          continued use of <strong>meroSpace</strong> after these changes
          signifies your acceptance of the updated policy.
        </p>

        <h2 className="text-xl font-semibold mt-6">9. Contact Us</h2>
        <p className="mt-2">
          If you have any questions or concerns about this Privacy Policy or our
          data practices, please contact us at:
        </p>
        <p className="mt-2">
          <strong>Email</strong>:
          <a
            href="mailto:khemrajshrestha471@gmail.com"
            className="text-black no-underline"
          >
            khemrajshrestha@gmail.com
          </a>
          <br />
          <strong>Address</strong>: Kathmandu, Nepal
        </p>
      </div>
    </>
  );
};

export default page;
