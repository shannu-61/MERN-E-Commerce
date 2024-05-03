import { Link } from "react-router-dom";
import NavBar from "../features/navbar/Navbar";
import Footer from "../features/common/Footer";

function LandingPage() {
  return (
    <>
      <div
        className="parent bg-gray-900 lg:pl-40 p-5"
        style={{
          width: "100vw",
          minHeight: "89vh",
          color: "black",
        }}
      >
        <div>
          <img
            src="/logo.png"
            alt="logo"
            style={{ width: "10rem", paddingTop: "1rem" }}
          />
        </div>
        <div
          className="lg:flex lg:gap-60"
          //   style={{ display: "flex", gap: "14rem" }}
        >
          <div
            className="lg:w-90rem sm:w-40rem"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "2rem",
              marginTop: "8rem",
            }}
          >
            <h1
              className=" text-blue-200"
              style={{
                fontWeight: "700",
                fontSize: "4.5rem",
              }}
            >
              Save <span className=" text-blue-500">Smart</span>,
              <br />
              <span className=" text-blue-500">Shop</span> Bargain Bay!
            </h1>
            <h3
              className="text-white"
              style={{
                fontWeight: "700",
                fontSize: "1.5rem",
              }}
            >
              Your Ultimate Online Retail Destination!
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <p className="text-gray-300" style={{ fontWeight: "400" }}>
                Discover endless possibilities at our online marketplace. From
                trending fashion to cutting-edge gadgets, we bring the world to
                your doorstep. Shop with ease, explore with excitement, and
                redefine your online shopping journey.
              </p>
            </div>
            <div style={{ marginTop: "2rem", display: "flex", gap: "2rem" }}>
              <Link to="/login">
                <button
                  className=" bg-blue-500 text-white py-2 rounded-3xl"
                  style={{ width: "8rem" }}
                >
                  Login
                </button>
              </Link>
              <Link to="/signup">
                <button
                  className=" bg-gray-900 border-2 border-blue-500 text-blue-500 py-2 rounded-3xl"
                  style={{
                    width: "8rem",
                  }}
                >
                  Sign Up
                </button>
              </Link>
            </div>
            <p
              style={{
                marginTop: "2rem",
                fontSize: "1rem",
                textAlign: "center",
                color: "#C4C4C4",
              }}
            >
              Click on Login to access your account or Sign Up to create a new
              account.
            </p>
            <p
              style={{
                marginTop: "1rem",
                fontSize: "0.8rem",
                textAlign: "center",
                color: "#C4C4C4",
              }}
            >
              Developed by Shanmuga Kothapalli as a final project for an MS at
              St Mary's University.
            </p>
          </div>
          <div className="lg:block hidden pt-20">
            <img
              src="/landingPageImg.png"
              alt="medLife"
              style={{ width: "80%" }}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default LandingPage;
