import React from "react";
import ContactItem from "../features/Contact/ContactItem";
import {
  ContactFeildData,
  SocialMediaData,
} from "../features/Contact/ContactData";
import NavBar from "../features/navbar/Navbar";
import "../features/Contact/contact.css";
import Footer from "../features/common/Footer";

const Contact = () => {
  return (
    <>
      <NavBar />
      <div className="contactStructureParent">
        <div className="contactStructure">
          <div className="contactStructureDataItems">
            {ContactFeildData.map((currData) => {
              return (
                <>
                  <ContactItem
                    icon={currData.icon}
                    headerTxt={currData.headerTxt}
                    messageTxt={currData.messageTxt}
                    footerTxt={currData.footerTxt}
                  />
                </>
              );
            })}
          </div>

          <div className="socialMediaLinkStructure">
            {SocialMediaData.map((currItm) => {
              return (
                <>
                  <a
                    className="ContactSocialLink"
                    href={currItm.link}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {currItm.icon}
                  </a>
                </>
              );
            })}
          </div>
        </div>

        <div className="contactFormStructureParent bg-gray-900">
          <h1 className="formHeading">Having Any Query? Drop a Message!</h1>
          <form
            className="contactForm"
            action="https://formspree.io/f/mqkodypk"
            method="POST"
          >
            <label>Name</label>
            <input
              className="bg-gray-900"
              type="text"
              name="userName"
              autoComplete="off"
              style={{ textTransform: "capitalize" }}
              required
            />
            <label>Email ID</label>
            <input
              className="bg-gray-900"
              type="text"
              name="email"
              autoComplete="off"
              required
            />
            <label>Your Query</label>
            <textarea
              className="contactTextareaField bg-gray-900 border-b-2 border-white"
              name="query"
              cols="60"
              rows="2"
              autoComplete="off"
              required
            />
            <input className=" hover:bg-gray-900" type="submit" value="Send" />
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
