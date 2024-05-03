import { Fragment, useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { Grid } from "react-loader-spinner";
import Modal from "../common/Modal";
import {
  fetchWishlistItemsByUserId,
  deleteItemFromWishlist,
} from "./wishlistAPI";
import { Button } from "antd";

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [openModal, setOpenModal] = useState(null);
  const navigate = useNavigate();
  const handleFetchWishlistItms = () => {
    fetchWishlistItemsByUserId()
      .then((result) => {
        console.log(result.data);
        setWishlistItems(result.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    handleFetchWishlistItms();
  }, []);
  const handleRemove = async (e, id) => {
    await deleteItemFromWishlist(id);
    handleFetchWishlistItms();
  };
  return (
    <>
      <div>
        <div
          className="mx-auto bg-gray-900 px-4 sm:px-6 lg:px-24 py-16"
          style={{ minHeight: "100vh" }}
        >
          <div className="px-4 py-6 sm:px-6 bg-yellow-50 rounded-lg">
            <h1
              style={{ borderBottom: "1px solid #E3E1D9" }}
              className="text-4xl my-5 font-bold tracking-tight text-gray-900"
            >
              Wishlist Items
            </h1>
            {!wishlistItems.length ? (
              <div>No Wishlisted Items</div>
            ) : (
              <ul className="-my-6 divide-y divide-gray-200">
                {wishlistItems?.map((item) => (
                  <li key={item.id} className="flex py-6">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={item.product?.thumbnail}
                        alt={item.product?.title}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3>
                            <a href={item.product?.id}>{item.product?.title}</a>
                          </h3>
                          <p className="ml-4">
                            $
                            {item.product?.price -
                              Math.round(
                                (item.product?.price *
                                  item.product?.discountPercentage) /
                                  100
                              )}
                          </p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          {item.product?.brand}
                        </p>
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <div className="flex">
                          <Modal
                            title={`Delete ${item.product?.title}`}
                            message="Are you sure you want to delete this Wishlist item ?"
                            dangerOption="Delete"
                            cancelOption="Cancel"
                            dangerAction={(e) => handleRemove(e, item.id)}
                            cancelAction={() => setOpenModal(null)}
                            showModal={openModal === item.id}
                          ></Modal>
                          <button
                            onClick={(e) => {
                              setOpenModal(item.id);
                            }}
                            type="button"
                            className="font-medium text-gray-700 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                        <Button
                          onClick={() => {
                            navigate(`/product-detail/${item.product?.id}`);
                          }}
                          className="bg-indigo-600 text-white"
                        >
                          Buy Now
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
