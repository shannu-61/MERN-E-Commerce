import { Link } from "react-router-dom";

function Footer() {
  return (
    <>
      <div className=" bg-gray-900">
        <div className="mx-auto text-white py-10">
          <div className="text-center">
            {/* <h3 className="text-3xl mb-3"> Download our Ecommerce App </h3>
            <p> Buy what you want. </p>
            <div className="flex justify-center mt-10">
              <div className="flex items-center border w-auto rounded-lg px-4 py-2 w-52 mx-2">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/888/888857.png"
                  className="w-7 md:w-8"
                />
                <div className="text-left ml-3">
                  <p className="text-xs text-gray-200">Download on </p>
                  <p className="text-sm md:text-base"> Google Play Store </p>
                </div>
              </div>
              <div className="flex items-center border w-auto rounded-lg px-4 py-2 w-44 mx-2">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/888/888841.png"
                  className="w-7 md:w-8"
                />
                <div className="text-left ml-3">
                  <p className="text-xs text-gray-200">Download on </p>
                  <p className="text-sm md:text-base"> Apple Store </p>
                </div>
              </div>
            </div> */}
          </div>
          <div className="ml-10 mr-10 flex flex-col md:flex-row md:justify-between items-center text-sm text-gray-400">
            <p className="order-2 md:order-1 mt-8 md:mt-0">
              © 2024 Bargain Bay. All rights reserved.
            </p>
            <div className="order-1 md:order-2">
              <Link to="/about">
                <span className="px-2 hover:text-white">About us</span>
              </Link>
              <Link to="/contact">
                <span className="px-2 border-l hover:text-white">
                  Contact us
                </span>
              </Link>
              <Link to="/privacy-policy">
                <span className="px-2 border-l hover:text-white">
                  Privacy Policy
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Footer;
