import { Link } from "react-router-dom";
import NavBar from "../features/navbar/Navbar";
import Footer from "../features/common/Footer";

function PrivacyPolicy() {
  // Get the current date
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <>
      <div style={{ minHeight: "100vh", background: "#f9f9f9" }}>
        <NavBar />
        <main className="grid min-h-full bg-white px-6 py-24 sm:py-32 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              Privacy Policy
            </h1>
            <p className="text-base text-gray-700 mb-8">
              Last updated: {currentDate}
            </p>
            <p className="text-base text-gray-700 mb-8">
              Welcome to Bargain Bay ("we," "our," or "us"). We are committed to
              protecting the privacy and security of your personal information.
              This Privacy Policy explains how we collect, use, disclose, and
              safeguard your information when you visit our website or make a
              purchase from us.
            </p>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Information We Collect
            </h2>
            <p className="text-base text-gray-700 mb-8">
              Personal Information <br />
              When you use our website, we may collect certain personally
              identifiable information ("Personal Information"). This may
              include: <br />
              - Name <br />
              - Email address <br />
              - Phone number <br />
              - Shipping and billing addresses <br />- Payment information
            </p>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              How We Use Your Information
            </h2>
            <p className="text-base text-gray-700 mb-8">
              The information we collect is used to: <br />
              - Process and fulfill your orders <br />
              - Communicate with you about your orders <br />
              - Improve our products and services <br />
            </p>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              How We Protect Your Information
            </h2>
            <p className="text-base text-gray-700 mb-8">
              We implement a variety of security measures to maintain the safety
              of your personal information when you place an order or enter,
              submit, or access your personal information.
            </p>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Your Rights and Choices
            </h2>
            <p className="text-base text-gray-700 mb-8">
              You have the right to: <br />
              - Access, update, or delete your personal information <br />-
              Object to the processing of your personal information
            </p>
            <p className="text-lg text-gray-700">
              For more information about our Privacy Policy or to exercise your
              rights, please contact us at [info@BargainBay.com]. Thank you for
              trusting Bargain Bay with your personal information.
            </p>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}

export default PrivacyPolicy;
