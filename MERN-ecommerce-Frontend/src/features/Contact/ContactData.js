import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import FacebookIcon from "@mui/icons-material/Facebook";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import TwitterIcon from "@mui/icons-material/Twitter";

const ContactFeildData = [
  {
    icon: <MailOutlineIcon className="iconBorder" />,
    headerTxt: "Chat to us",
    messageTxt: "our Friendly team is here to help",
    footerTxt: "info@BargainBay.com",
  },
  {
    icon: <LocationOnIcon className="iconBorder" />,
    headerTxt: "Visit us",
    messageTxt: "Come say hello at our office HQ.",
    footerTxt: "San Antonio Texas, USA",
  },
  {
    icon: <PhoneIcon className="iconBorder" />,
    headerTxt: "Call us",
    messageTxt: "Mon-Fri from 8am to 5pm.",
    footerTxt: "+1 903 990 7270",
  },
];

const SocialMediaData = [
  { icon: <FacebookIcon className="iconBorder" />, link: "" },
  { icon: <WhatsAppIcon className="iconBorder" />, link: "" },
  { icon: <TwitterIcon className="iconBorder" />, link: "" },
];

export { SocialMediaData, ContactFeildData };
