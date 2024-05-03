import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchLoggedInUserOrderAsync,
  selectUserInfo,
  selectUserInfoStatus,
  selectUserOrders,
  updateOrderStatusLocally,
} from "../userSlice";
import { Grid } from "react-loader-spinner";
import { updateOrder } from "../../order/orderAPI";

export default function UserOrders() {
  const dispatch = useDispatch();
  const orders = useSelector(selectUserOrders);
  const status = useSelector(selectUserInfoStatus);
  const [alertMessage, setAlertMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchLoggedInUserOrderAsync());
  }, [dispatch]);

  const handleOrderCancel = (order) => {
    const updatedOrder = { ...order, status: "cancelled by buyer" };

    // Update order status locally
    dispatch(updateOrderStatusLocally(updatedOrder));

    // Send API request to update order status on the server
    updateOrder(updatedOrder)
      .then((res) => {
        console.log(res.data);
        setAlertMessage("Order has been cancelled.");
      })
      .catch((err) => {
        setAlertMessage("Error cancelling order.");
        console.log(err);
      });

    // Clear the alert message after 5 seconds
    setTimeout(() => {
      setAlertMessage("");
    }, 5000); // Adjust this value as needed
  };

  const handleReturn = (order) => {
    // Logic for handling return goes here
  };

  // Filter orders based on search query
  const filteredOrders = orders
    ? orders.filter((order) =>
        order.items.some((item) =>
          item.product.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : [];

  // Sort orders by creation date in descending order
  filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div>
      <div className="flex justify-center my-5">
        <input
          type="text"
          placeholder="Search by product title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded-md py-2 px-4 w-96 focus:outline-none focus:border-blue-500 text-black"
          style={{
            backgroundColor: "white",
            color: "black",
            border: "1px solid black",
          }}
        />
      </div>
      {alertMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            left: "20px",
            backgroundColor: "#f44336",
            color: "white",
            padding: "15px",
            borderRadius: "5px",
          }}
        >
          {alertMessage}
        </div>
      )}
      {filteredOrders.length === 0 ? (
        <div>No orders found.</div>
      ) : (
        filteredOrders.map((order) => (
          <div key={order.id}>
            <div style={{ display: "flex" }}>
              <div className="mx-auto mt-12 bg-gray-900 rounded-lg max-w-7xl px-4 py-4 lg:px-8 inline-block">
                <h1 className="text-4xl my-5 font-bold tracking-tight text-white">
                  Order # {order.id}
                </h1>
                <h2 className="text-lg my-3 font-semibold text-white">
                  Order Date: {new Date(order.createdAt).toLocaleString()}
                </h2>

                <div className="lg:flex justify-center">
                  <div className="px-4 py-6 sm:px-6" style={{ width: "23rem" }}>
                    <h3 className="text-xl my-5 font-bold tracking-tight text-red-500">
                      Order Status : {order.status}
                    </h3>
                    <div className="flow-root">
                      <ul className="">
                        {order.items.map((item) => (
                          <li key={item.id} className="flex py-6">
                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                              <img
                                src={item.product.thumbnail}
                                alt={item.product.title}
                                className="h-full w-full object-cover object-center"
                              />
                            </div>

                            <div className="ml-4 flex flex-1 flex-col">
                              <div>
                                <div className="flex justify-between text-base font-medium text-white">
                                  <h3>
                                    <a href={item.product.id}>
                                      {item.product.title}
                                    </a>
                                  </h3>
                                  <p className="ml-4">
                                    $
                                    {item.product.price -
                                      Math.round(
                                        (item.product.price *
                                          item.product.discountPercentage) /
                                          100
                                      )}
                                  </p>
                                </div>
                                <p className="mt-1 text-sm text-gray-400">
                                  {item.product.brand}
                                </p>
                              </div>
                              <div className="flex flex-1 items-end justify-between text-sm">
                                <div className="text-gray-400">
                                  <label
                                    htmlFor="quantity"
                                    className="inline mr-5 text-sm font-medium leading-6 text-white"
                                  >
                                    Qty :{item.quantity}
                                  </label>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="px-4 py-6 sm:px-6 lg:border-l lg:border-gray-200">
                    <div className="flex justify-between my-2 text-base font-medium text-white">
                      <p>Subtotal</p>
                      <p>$ {order.totalAmount}</p>
                    </div>
                    <div className="flex justify-between my-2 text-base font-medium text-white">
                      <p>Total Items in Cart</p>
                      <p>{order.totalItems} items</p>
                    </div>
                    <p className="my-3 text-sm text-gray-400">
                      Shipping Address :
                    </p>
                    <div className="flex justify-between gap-x-6 px-5 py-5 border-solid border-2 rounded-md border-gray-200">
                      <div className="flex gap-x-4">
                        <div className="min-w-0 flex-auto">
                          <p className="text-sm font-semibold leading-6 text-white">
                            {order.selectedAddress.name}
                          </p>
                          <p className="mt-1 truncate text-xs leading-5 text-gray-400">
                            {order.selectedAddress.street}
                          </p>
                          <p className="mt-1 truncate text-xs leading-5 text-gray-400">
                            {order.selectedAddress.pinCode}
                          </p>
                        </div>
                      </div>
                      <div className="hidden sm:flex sm:flex-col sm:items-end">
                        <p className="text-sm leading-6 text-white">
                          Phone: {order.selectedAddress.phone}
                        </p>
                        <p className="text-sm leading-6 text-gray-400">
                          {order.selectedAddress.city}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {order.status !== "cancelled by seller" &&
                  order.status !== "cancelled by buyer" &&
                  order.status !== "dispatched" &&
                  (order.status === "delivered" ? (
                    <div style={{ float: "right" }}>
                      <button
                        onClick={() => {
                          handleReturn(order);
                        }}
                        className="bg-blue-500 px-8 py-2 text-white"
                      >
                        Return
                      </button>
                    </div>
                  ) : (
                    <div style={{ float: "right" }}>
                      <button
                        onClick={() => {
                          handleOrderCancel(order);
                        }}
                        className="bg-red-500 px-8 py-2 text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ))
      )}
      {status === "loading" ? (
        <div style={{ margin: "5rem" }}>
          <Grid
            height="80"
            width="80"
            color="rgb(79, 70, 229) "
            ariaLabel="grid-loading"
            radius="12.5"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      ) : null}
    </div>
  );
}
