import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  ShoppingCartIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectItems } from "../cart/cartSlice";
import { selectLoggedInUser } from "../auth/authSlice";
import { selectUserInfo } from "../user/userSlice";
import PersonIcon from "@mui/icons-material/Person";

const navigation = [{ name: "Products", link: "/", user: true }];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function NavBarUnLogged({ children }) {
  const items = useSelector(selectItems);
  const userInfo = useSelector(selectUserInfo);

  return (
    <>
      {!userInfo && (
        <div className="min-h-full">
          <Disclosure
            as="nav"
            style={{
              position: "fixed",
              width: "100%",
              zIndex: "3",
            }}
            className="bg-gray-900"
          >
            {({ open }) => (
              <>
                <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
                  <div className="flex h-24 items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Link to="/">
                          <img
                            className="h-8 w-8"
                            src="/logo.png"
                            alt="Your Company"
                          />
                        </Link>
                      </div>
                      <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                          {navigation.map((item) => (
                            <Link
                              key={item.name}
                              to={item.link}
                              className={classNames(
                                item.current
                                  ? "bg-indigo-800 text-white"
                                  : "text-gray-300 hover:bg-indigo-800 hover:text-white",
                                "rounded-md px-3 py-2 font-medium"
                              )}
                              aria-current={item.current ? "page" : undefined}
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="hidden md:block">
                      <div className="ml-4 flex items-center md:ml-6">
                        <Link to={"/login"} className="text-white">
                          Login
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </Disclosure>

          <header className="bg-white shadow">
            <div className="mx-auto max-w-8xl px-4 py-6 sm:px-6 lg:px-8 "></div>
          </header>
        </div>
      )}
    </>
  );
}

export default NavBarUnLogged;
