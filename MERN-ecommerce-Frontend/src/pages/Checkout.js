import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import axios from "axios";

import {
  deleteItemFromCartAsync,
  selectItems,
  updateCartAsync,
} from "../features/cart/cartSlice";
import { Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { updateUserAsync } from "../features/user/userSlice";
import { useState } from "react";
import {
  createOrderAsync,
  selectCurrentOrder,
  selectStatus,
} from "../features/order/orderSlice";
import { selectUserInfo } from "../features/user/userSlice";
import { Grid } from "react-loader-spinner";
import { Button, Form, Input } from "antd";
import Footer from "../features/common/Footer";

function Checkout() {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [couponForm] = Form.useForm();
  const [couponDiscountAmount, setCouponDiscountAmount] = useState(0);
  const user = useSelector(selectUserInfo);
  const items = useSelector(selectItems);
  const status = useSelector(selectStatus);
  const currentOrder = useSelector(selectCurrentOrder);

  // Function to calculate expected delivery date
  const getExpectedDeliveryDate = () => {
    const currentDate = new Date();
    let expectedDeliveryDate = new Date(currentDate);
    let businessDaysRemaining = 3;
    while (businessDaysRemaining > 0) {
      expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + 1);
      if (
        expectedDeliveryDate.getDay() !== 0 &&
        expectedDeliveryDate.getDay() !== 6
      ) {
        businessDaysRemaining--;
      }
    }
    return expectedDeliveryDate;
  };

  const totalAmount = items?.reduce(
    (amount, item) =>
      (item.product.price -
        Math.round(
          (item.product.price * item.product.discountPercentage) / 100
        )) *
        item.quantity +
      amount,
    0
  );
  const totalItems = items?.reduce((total, item) => item.quantity + total, 0);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);

  const handleQuantity = (e, item) => {
    dispatch(updateCartAsync({ id: item.id, quantity: +e.target.value }));
  };

  const handleRemove = (e, id) => {
    dispatch(deleteItemFromCartAsync(id));
  };

  const handleAddress = (e) => {
    console.log(e.target.value);
    setSelectedAddress(user.addresses[e.target.value]);
  };

  const handlePayment = (e) => {
    console.log(e.target.value);
    setPaymentMethod(e.target.value);
  };

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const displayRazorpay = async (amount, order) => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );
    console.log(res);
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }
    const options = {
      key: "Your API Key",
      amount: amount.toString(),
      currency: "USD",
      name: "Bargain Bay",
      description: "Test Transaction",

      handler: function (response) {
        // alert(response.razorpay_payment_id);
        // alert(response.razorpay_order_id);
        // alert(response.razorpay_signature)
        order.paymentMethod = "card";
        dispatch(createOrderAsync(order));
      },
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };
  const finalAmount =
    totalAmount -
    couponDiscountAmount +
    Math.round((totalAmount * 6.25) / 100) +
    5;
  const handleOrder = async (e) => {
    if (selectedAddress && paymentMethod) {
      const order = {
        items,
        totalAmount: finalAmount,
        totalItems,
        user: user.id,
        paymentMethod,
        selectedAddress,
        status: "pending", // other status can be delivered, received.
      };
      if (paymentMethod === "cash") {
        dispatch(createOrderAsync(order));
      } else await displayRazorpay(finalAmount * 100, order);
    } else {
      alert("Enter Address and Payment method");
    }
  };

  const conponCodes = [
    { code: "SALE10", couponDiscount: 10 },
    { code: "SALE5", couponDiscount: 5 },
    { code: "NEWYEAR", couponDiscount: 24 },
    { code: "ENDOFSEASON", couponDiscount: 30 },
  ];
  const handleCoupon = (value) => {
    for (let i = 0; i < conponCodes.length; i++) {
      if (conponCodes[i].code === value.couponCode) {
        setCouponDiscountAmount(
          Math.round((totalAmount * conponCodes[i].couponDiscount) / 100)
        );
      }
    }
  };

  const qtyOptions = (n) => {
    return Array.from({ length: n }, (_, index) => (
      <option value={index + 1} key={index}>
        {index + 1}
      </option>
    ));
  };

  const expectedDeliveryDate = getExpectedDeliveryDate(); // Get the expected delivery date
  return (
    <>
      {!items.length && <Navigate to="/home" replace={true}></Navigate>}
      {currentOrder && (
        <Navigate
          to={`/order-success/${currentOrder.id}`}
          replace={true}
        ></Navigate>
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
      ) : (
        <div className="mx-auto px-4 sm:px-6 lg:px-8 bg-gray-900">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-5">
            <div className="lg:col-span-3">
              {/* This form is for address */}
              <form
                className="bg-gray-900 px-5 py-12 mt-12"
                noValidate
                onSubmit={handleSubmit((data) => {
                  console.log(data);
                  dispatch(
                    updateUserAsync({
                      ...user,
                      addresses: [...user.addresses, data],
                    })
                  );
                  reset();
                })}
              >
                <div className="space-y-12 bg-gray-900">
                  <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-2xl font-semibold leading-7 text-white">
                      Personal Information
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-gray-400">
                      Share your preferred address for seamless shipping.
                    </p>

                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                      <div className="sm:col-span-4">
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium leading-6 text-white"
                        >
                          Full name
                        </label>
                        <div className="mt-2">
                          <input
                            style={{ color: "black" }}
                            type="text"
                            {...register("name", {
                              required: "name is required",
                            })}
                            id="name"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          {errors.name && (
                            <p className="text-red-500">
                              {errors.name.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="sm:col-span-4">
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium leading-6 text-white"
                        >
                          Email address
                        </label>
                        <div className="mt-2">
                          <input
                            style={{ color: "black" }}
                            id="email"
                            {...register("email", {
                              required: "email is required",
                            })}
                            type="email"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          {errors.email && (
                            <p className="text-red-500">
                              {errors.email.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium leading-6 text-white"
                        >
                          Phone
                        </label>
                        <div className="mt-2">
                          <input
                            style={{ color: "black" }}
                            id="phone"
                            {...register("phone", {
                              required: "phone is required",
                            })}
                            type="tel"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          {errors.phone && (
                            <p className="text-red-500">
                              {errors.phone.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="col-span-full">
                        <label
                          htmlFor="street-address"
                          className="block text-sm font-medium leading-6 text-white"
                        >
                          Street address
                        </label>
                        <div className="mt-2">
                          <input
                            style={{ color: "black" }}
                            type="text"
                            {...register("street", {
                              required: "street is required",
                            })}
                            id="street"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          {errors.street && (
                            <p className="text-red-500">
                              {errors.street.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="sm:col-span-2 sm:col-start-1">
                        <label
                          htmlFor="city"
                          className="block text-sm font-medium leading-6 text-white"
                        >
                          City
                        </label>
                        <div className="mt-2">
                          <input
                            style={{ color: "black" }}
                            type="text"
                            {...register("city", {
                              required: "city is required",
                            })}
                            id="city"
                            autoComplete="address-level2"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          {errors.city && (
                            <p className="text-red-500">
                              {errors.city.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label
                          htmlFor="state"
                          className="block text-sm font-medium leading-6 text-white"
                        >
                          State / Province
                        </label>
                        <div className="mt-2">
                          <input
                            style={{ color: "black" }}
                            type="text"
                            {...register("state", {
                              required: "state is required",
                            })}
                            id="state"
                            autoComplete="address-level1"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          {errors.state && (
                            <p className="text-red-500">
                              {errors.state.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label
                          htmlFor="pinCode"
                          className="block text-sm font-medium leading-6 text-white"
                        >
                          ZIP / Postal code
                        </label>
                        <div className="mt-2">
                          <input
                            style={{ color: "black" }}
                            type="text"
                            {...register("pinCode", {
                              required: "pinCode is required",
                            })}
                            id="pinCode"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          {errors.pinCode && (
                            <p className="text-red-500">
                              {errors.pinCode.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button
                      onClick={(e) => reset()}
                      type="button"
                      className="text-sm font-semibold leading-6 text-white"
                    >
                      Reset
                    </button>
                    <button
                      type="submit"
                      className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-green-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Add Address
                    </button>
                  </div>
                </div>
              </form>
              <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-2xl font-extraboldleading-7 text-white">
                  Addresses
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-400">
                  Choose from Existing addresses
                </p>
                <ul>
                  {user?.addresses?.map((address, index) => (
                    <li
                      key={index}
                      className="flex justify-between mt-5 rounded-md gap-x-6 px-5 py-5 border-solid border-2 border-gray-200"
                    >
                      <div className="flex gap-x-4">
                        <input
                          onChange={handleAddress}
                          name="address"
                          type="radio"
                          value={index}
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                        <div className="min-w-0 flex-auto">
                          <p className="text-sm font-semibold leading-6 text-white">
                            {address.name}
                          </p>
                          <p className="mt-1 truncate text-xs leading-5 text-gray-400">
                            {address.street}
                          </p>
                          <p className="mt-1 truncate text-xs leading-5 text-gray-400">
                            {address.pinCode}
                          </p>
                        </div>
                      </div>
                      <div className="hidden sm:flex sm:flex-col sm:items-end">
                        <p className="text-sm leading-6 text-white">
                          Phone: {address.phone}
                        </p>
                        <p className="text-sm leading-6 text-gray-400">
                          {address.city}
                        </p>
                        <p className="text-sm leading-6 text-gray-400">
                          {address.state}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-10 space-y-10">
                  <fieldset>
                    <legend className="text-2xl font-extrabold leading-6 text-white">
                      Payment Methods
                    </legend>
                    <p className="mt-1 text-sm leading-6 text-gray-400">
                      Choose One
                    </p>
                    <div className="mt-6 space-y-6">
                      <div className="flex items-center gap-x-3">
                        <input
                          id="cash"
                          name="payments"
                          onChange={handlePayment}
                          value="cash"
                          type="radio"
                          checked={paymentMethod === "cash"}
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                        <label
                          htmlFor="cash"
                          className="block text-sm font-medium leading-6 text-white"
                        >
                          Cash
                        </label>
                      </div>
                      <div className="flex items-center gap-x-3">
                        <input
                          id="card"
                          onChange={handlePayment}
                          name="payments"
                          checked={paymentMethod === "card"}
                          value="card"
                          type="radio"
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                        <label
                          htmlFor="card"
                          className="block text-sm font-medium leading-6 text-white"
                        >
                          Card Payment
                        </label>
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="mx-auto rounded-lg mt-12 bg-yellow-50 max-w-7xl px-2 sm:px-2 lg:px-4">
                <div className="border-t border-gray-200 px-0 py-6 sm:px-0">
                  <h1 className="text-4xl my-5 font-bold tracking-tight text-gray-900">
                    Cart
                  </h1>
                  <div className="flow-root">
                    <ul role="list" className="-my-6 divide-y divide-gray-200">
                      {items.map((item) => (
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
                              <div className="flex justify-between text-base font-medium text-gray-900">
                                <h3>
                                  <a
                                    href={"/product-detail/" + item.product.id}
                                  >
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
                              <p className="mt-1 text-sm text-gray-500">
                                {item.product.brand}
                              </p>
                            </div>
                            <div className="flex flex-1 items-end justify-between text-sm">
                              <div className="text-gray-500">
                                <label
                                  htmlFor="quantity"
                                  className="inline mr-5 text-sm font-medium leading-6 text-gray-900"
                                >
                                  Qty
                                </label>
                                <select
                                  onChange={(e) => handleQuantity(e, item)}
                                  value={item.quantity}
                                  className="bg-yellow-50 rounded-md"
                                >
                                  {qtyOptions(item.product.stock)}
                                </select>
                              </div>

                              <div className="flex">
                                <button
                                  onClick={(e) => handleRemove(e, item.id)}
                                  type="button"
                                  className="font-medium text-gray-600 hover:text-red-500"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="border-t border-gray-200 px-2 py-6 sm:px-2">
                  {couponDiscountAmount !== 0 ? (
                    <div className="flex justify-between my-2 text-base font-medium text-gray-900">
                      <p>Coupon Discount</p>
                      <p className="text-red-400">- ${couponDiscountAmount}</p>
                    </div>
                  ) : null}

                  <div className="flex justify-between my-2 text-base font-medium text-gray-900">
                    <p>Shipping Charge</p>
                    <p>+ $5</p>
                  </div>
                  <div className="flex justify-between my-2 text-base font-medium text-gray-900">
                    <p>Tax (6.25%)</p>
                    <p>+ ${Math.round((totalAmount * 6.25) / 100)}</p>
                  </div>

                  <div className="flex justify-between my-2 text-base font-medium text-gray-900">
                    <p>Subtotal</p>
                    <p>
                      ${" "}
                      {totalAmount -
                        couponDiscountAmount +
                        Math.round((totalAmount * 6.25) / 100) +
                        5}
                    </p>
                  </div>
                  <div className="flex justify-between my-2 text-base font-medium text-gray-900">
                    <p>Total Items in Cart</p>
                    <p>{totalItems} items</p>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500"></p>
                  {/* Expected Delivery Date */}
                  <div className="flex justify-between my-2 text-base font-medium text-gray-900">
                    <p>Expected Delivery Date:</p>
                    <p>{expectedDeliveryDate.toDateString()}</p>
                  </div>
                  <div className="mt-6">
                    <div
                      onClick={handleOrder}
                      className="flex cursor-pointer items-center justify-center rounded-md border border-transparent bg-gray-900 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-gray-700"
                    >
                      Order Now
                    </div>
                  </div>
                  <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                    <p>
                      or&nbsp;
                      <Link to="/home">
                        <button
                          type="button"
                          className="font-medium text-gray-900 hover:text-gray-600"
                        >
                          Continue Shopping
                          <span aria-hidden="true"> &rarr;</span>
                        </button>
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
              <div className="mx-auto rounded-lg mt-12 bg-yellow-50 max-w-7xl px-2 sm:px-2 lg:px-4">
                <div className="border-t border-gray-200 px-0 py-6 sm:px-0">
                  <h1 className="text-3xl my-5 font-bold tracking-tight text-gray-900">
                    Discount Delight🤩
                  </h1>
                  <div className="flow-root">
                    <Form
                      layout="vertical"
                      onFinish={handleCoupon}
                      form={couponForm}
                    >
                      <Form.Item label="Coupon Code" name="couponCode">
                        <Input
                          style={{
                            color: "black",
                            border: "1px solid black",
                            borderRadius: "5px",
                            margin: "0",
                          }}
                          placeholder="Apply the Coupon Code"
                        />
                      </Form.Item>
                      <Form.Item shouldUpdate>
                        {() => (
                          <Button
                            className="bg-gray-900 text-white"
                            htmlType="submit"
                            disabled={couponForm?.couponCode?.length === 0}
                          >
                            Apply
                          </Button>
                        )}
                      </Form.Item>

                      {couponDiscountAmount !== 0 ? (
                        <Button
                          className="bg-gray-900 text-white"
                          onClick={() => {
                            couponForm.resetFields();
                            setCouponDiscountAmount(0);
                          }}
                        >
                          Reset
                        </Button>
                      ) : null}
                    </Form>
                  </div>
                </div>

                <div className="border-t border-gray-200 px-2 py-6 sm:px-2">
                  {conponCodes?.map((itm) => {
                    return (
                      <>
                        <div
                          style={{ border: "1px solid #E3E1D9" }}
                          className="flex gap-3 p-2 mb-2 rounded-md"
                        >
                          <p className="text-sm text-gray-600">
                            Apply Coupon{" "}
                            <span className="text-red-400">{itm.code}</span> for{" "}
                            {itm.couponDiscount}% Discount
                          </p>
                        </div>
                      </>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}

export default Checkout;
