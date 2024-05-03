import React from "react";

const ContactItem = ({ icon, headerTxt, messageTxt, footerTxt }) => {
  return (
    <>
      <div className="ContactItemStructure">
        <div className="ContactItemIconStructure">{icon}</div>
        <div className="ContactItemDataFeildStructure">
          <p className="headerText">{headerTxt}</p>
          <p className="messageText">{messageTxt}</p>
          <p className="footerText">{footerTxt}</p>
        </div>
      </div>
    </>
  );
};

export default ContactItem;
