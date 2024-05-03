import { Link } from "react-router-dom";
import NavBar from "../features/navbar/Navbar";
import Footer from "../features/common/Footer";

function AboutUs() {
  return (
    <>
      <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
        <NavBar />

        <main className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              Welcome to <span className="text-primary">Bargain Bay</span>!
            </h1>

            <p className="text-lg text-gray-700 mb-8">
              At Bargain Bay, we believe in more than just providing products;
              we're here to offer you an experience. Our story is one of
              passion, quality, and a commitment to making your shopping journey
              extraordinary.
            </p>
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Our Mission
              </h2>
              <p className="text-base text-gray-700">
                At the core of Bargain Bay is a mission to help you save smart
                while shopping. We strive to offer top-notch products at
                unbeatable prices, ensuring that you get the best value for your
                money.
              </p>
            </div>
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                The Bargain Bay Difference
              </h2>
              <p className="text-base text-gray-700">
                What sets us apart? It's the Bargain Bay promise of quality,
                affordability, and convenience. We take pride in offering a vast
                selection of products, excellent customer service, and exclusive
                deals you won't find anywhere else.
              </p>
            </div>
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Our Story
              </h2>
              <p className="text-base text-gray-700">
                Bargain Bay started with a vision to revolutionize online
                shopping, providing customers with access to a wide range of
                products at discounted prices. Despite facing challenges along
                the way, our dedication to our customers has driven us to
                overcome obstacles and achieve milestones. From humble
                beginnings to becoming a trusted name in e-commerce, every step
                of our journey has been guided by our commitment to excellence.
              </p>
            </div>
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Our Commitment to Quality
              </h2>
              <p className="text-base text-gray-700">
                Every product at Bargain Bay undergoes rigorous quality control
                processes to ensure that you receive only the best. We source
                our materials responsibly, prioritizing ethical and sustainable
                practices to minimize our environmental footprint. Your
                satisfaction is our priority, and we stand by the quality of
                every item we offer.
              </p>
            </div>
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Connect with Us
              </h2>
              <p className="text-base text-gray-700">
                We love hearing from you! Whether you have questions, feedback,
                or just want to say hello, feel free to reach out to our
                customer support team. Follow us on social media to stay updated
                on the latest Bargain Bay news and promotions.
              </p>
            </div>
            <p className="text-lg text-gray-700">
              Thank you for being a part of the Bargain Bay family. Happy
              shopping!
            </p>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}

export default AboutUs;
