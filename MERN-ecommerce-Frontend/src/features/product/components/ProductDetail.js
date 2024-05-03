import { useState, useEffect } from "react";
import { RadioGroup } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, Form, InputNumber, Input } from "antd";
import {
  fetchProductByIdAsync,
  selectProductById,
  selectProductListStatus,
} from "../productSlice";
import {
  fetchBargainRequestByProduct,
  fetchReviews,
  reviewProduct,
} from "../productAPI";
import { fetchLoggedInUserAsync, selectUserInfo } from "../../user/userSlice";
import { useParams } from "react-router-dom";
import { addToCartAsync, selectItems } from "../../cart/cartSlice";
import { selectLoggedInUser } from "../../auth/authSlice";
import { useAlert } from "react-alert";
import { Grid } from "react-loader-spinner";
import TypedInputNumber from "antd/es/input-number";
import {
  addToWishlist,
  fetchWishlistItemsByUserId,
} from "../../wishlist/wishlistAPI";
import { bargainProduct } from "../productAPI";
import NavBarUnLogged from "../../navbar/NavBarUnLogged";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ProductDetail() {
  const [selectedColor, setSelectedColor] = useState();
  const [selectedSize, setSelectedSize] = useState();
  const items = useSelector(selectItems);
  const product = useSelector(selectProductById);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [bargainRequests, setBargainRequest] = useState([]);
  const dispatch = useDispatch();
  const params = useParams();
  const alert = useAlert();
  const status = useSelector(selectProductListStatus);
  const [bargainForm] = Form.useForm();
  const [reviewForm] = Form.useForm();
  const { TextArea } = Input;
  const userInfo = useSelector(selectUserInfo);
  const [reviewsByUser, setReviewsByUser] = useState([]);

  const handleFetchWishlistItms = () => {
    fetchWishlistItemsByUserId()
      .then((result) => {
        setWishlistItems(result.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleBargainItems = () => {
    fetchBargainRequestByProduct(params.id, userInfo?.id)
      .then((result) => {
        setBargainRequest(result.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleRewiews = () => {
    fetchReviews(params.id)
      .then((result) => {
        // console.log(result.data);
        setReviewsByUser(result.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (userInfo) {
      handleFetchWishlistItms();
      handleBargainItems();
    }
    handleRewiews();
  }, []);

  const handleBargainRequest = async (values) => {
    bargainForm.resetFields();
    const bargainPayload = {
      price: values.userBargainPrice,
      product: params.id,
      user: userInfo.id,
    };
    await bargainProduct(bargainPayload);
    handleBargainItems();
  };

  const handleSubmitReview = async (values) => {
    const reviewPayload = {
      user: userInfo.id,
      product: params.id,
      review: values.review,
    };
    await reviewProduct(reviewPayload);
    handleRewiews();
  };

  const handleCart = (e) => {
    if (!userInfo) {
      window.location.href = "/login";
    }
    e.preventDefault();
    if (items.findIndex((item) => item.product.id === product.id) < 0) {
      console.log({ items, product });
      const newItem = {
        product: product.id,
        quantity: 1,
      };
      if (selectedColor) {
        newItem.color = selectedColor;
      }
      if (selectedSize) {
        newItem.size = selectedSize;
      }
      dispatch(addToCartAsync({ item: newItem, alert }));
    } else {
      console.log("hello");
      alert.error("Item Already added");
    }
  };

  const handleWishlist = async (e) => {
    if (!userInfo) {
      window.location.href = "/login";
    }
    e.preventDefault();
    if (
      wishlistItems.findIndex((item) => item?.product?.id === product?.id) < 0
    ) {
      console.log({ items, product });
      const newItem = {
        product: product?.id,
        quantity: 1,
      };
      if (selectedColor) {
        newItem.color = selectedColor;
      }
      if (selectedSize) {
        newItem.size = selectedSize;
      }
      await addToWishlist(newItem);
      alert.success("Item Added to Wishlist");
    } else {
      alert.error("Item Already added");
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    bargainForm.submit();
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    dispatch(fetchProductByIdAsync(params.id));
  }, [dispatch, params.id]);

  return (
    <div className="bg-white">
      {status === "loading" ? (
        <div style={{ margin: "5rem" }}>
          <Grid
            height="80"
            width="80"
            color="rgb(79, 70, 229)"
            ariaLabel="grid-loading"
            radius="12.5"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      ) : null}
      {product && (
        <>
          <NavBarUnLogged />
          <div className="mt-12 lg:flex">
            {/* Image gallery */}
            <div
              className="mx-auto mt-6 max-w-xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8"
              style={{ minWidth: "50%" }}
            >
              <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
                <div className="aspect-h-4 aspect-w-3 hidden overflow-hidden  lg:block">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full object-contain object-center"
                  />
                </div>
                <div className="aspect-h-2 aspect-w-3 overflow-hidden">
                  <img
                    src={product.images[2]}
                    alt={product.title}
                    className=" w-full object-contain object-center"
                  />
                </div>
              </div>
              <div className="lg:grid lg:grid-cols-1 lg:gap-y-8">
                <div className="aspect-h-2 aspect-w-3 overflow-hidden">
                  <img
                    src={product.images[1]}
                    alt={product.title}
                    className=" w-full object-contain object-center"
                  />
                </div>
                <div className="aspect-h-5 aspect-w-4 lg:aspect-h-4 lg:aspect-w-3 sm:overflow-hidden">
                  <img
                    src={product.images[3]}
                    alt={product.title}
                    className="h-2.3 w-full object-contain object-center"
                  />
                </div>
              </div>
            </div>

            {/* Product info */}
            <div className=" border-l border-gray-300 lg:w-1/3 mx-auto px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-1 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
              <div className="lg:col-span-2 lg:border-r lg:border-white lg:pr-8">
                <h1 className="lg:text-4xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                  {product.title}
                </h1>
              </div>

              {/* Options */}
              <div className="mt-4 lg:row-span-3 lg:mt-4">
                <h2 className="sr-only">Product information</h2>
                <p className="text-xl line-through tracking-tight text-gray-600">
                  $
                  {bargainRequests.length > 0
                    ? bargainRequests.map((itm) => {
                        return itm.accepted === true
                          ? itm.price
                          : product.price;
                      })
                    : product.price}
                </p>
                <p className="text-3xl tracking-tight text-gray-900">
                  $
                  {bargainRequests.length &&
                  userInfo &&
                  bargainRequests[0].accepted > 0
                    ? bargainRequests[0].price -
                      Math.round(
                        (bargainRequests[0].price *
                          product.discountPercentage) /
                          100
                      )
                    : // bargainRequests.map((itm) => {

                      //   return itm.accepted === true
                      //     ? itm.price -
                      //     Math.round(
                      //       (itm.price * product.discountPercentage) / 100
                      //     )
                      //     : product.price -
                      //     Math.round(
                      //       (product.price * product.discountPercentage) /
                      //       100
                      //     );
                      // })
                      product.price -
                      Math.round(
                        (product.price * product.discountPercentage) / 100
                      )}
                  {/* {(product.price -
                    Math.round(
                      (product.price * product.discountPercentage) / 100
                    ))} */}
                </p>

                {/* Reviews */}

                <form className="mt-10">
                  {/* Colors */}
                  {product.colors && product.colors.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        Color
                      </h3>

                      <RadioGroup
                        value={selectedColor}
                        onChange={setSelectedColor}
                        className="mt-4"
                      >
                        <RadioGroup.Label className="sr-only">
                          Choose a color
                        </RadioGroup.Label>
                        <div className="flex items-center space-x-3">
                          {product.colors.map((color) => (
                            <RadioGroup.Option
                              key={color?.name}
                              value={color}
                              className={({ active, checked }) =>
                                classNames(
                                  color?.selectedClass,
                                  active && checked ? "ring ring-offset-1" : "",
                                  !active && checked ? "ring-2" : "",
                                  "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none"
                                )
                              }
                            >
                              <RadioGroup.Label as="span" className="sr-only">
                                {color?.name}
                              </RadioGroup.Label>
                              <span
                                aria-hidden="true"
                                style={{ background: color?.class }}
                                className={classNames(
                                  "h-8 w-8 rounded-full border border-black border-opacity-10"
                                )}
                              />
                            </RadioGroup.Option>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  )}

                  {/* Sizes */}
                  {product.sizes && product.sizes.length > 0 && (
                    <div className="mt-10">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900">
                          Size
                        </h3>
                        <a
                          href="#"
                          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                        ></a>
                      </div>

                      <RadioGroup
                        value={selectedSize}
                        onChange={setSelectedSize}
                        className="mt-4"
                      >
                        <RadioGroup.Label className="sr-only">
                          Choose a size
                        </RadioGroup.Label>
                        <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4">
                          {product.sizes.map((size) => (
                            <RadioGroup.Option
                              key={size?.name}
                              value={size}
                              disabled={!size?.inStock}
                              className={({ active }) =>
                                classNames(
                                  size?.inStock
                                    ? "cursor-pointer bg-white text-gray-900 shadow-sm"
                                    : "cursor-not-allowed bg-gray-50 text-gray-200",
                                  active ? "ring-2 ring-indigo-500" : "",
                                  "group relative flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 sm:py-6"
                                )
                              }
                            >
                              {({ active, checked }) => (
                                <>
                                  <RadioGroup.Label as="span">
                                    {size?.name}
                                  </RadioGroup.Label>
                                  {size?.inStock ? (
                                    <span
                                      className={classNames(
                                        active ? "border" : "border-2",
                                        checked
                                          ? "border-indigo-500"
                                          : "border-transparent",
                                        "pointer-events-none absolute -inset-px rounded-md"
                                      )}
                                      aria-hidden="true"
                                    />
                                  ) : (
                                    <span
                                      aria-hidden="true"
                                      className="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200"
                                    >
                                      <svg
                                        className="absolute inset-0 h-full w-full stroke-2 text-gray-200"
                                        viewBox="0 0 100 100"
                                        preserveAspectRatio="none"
                                        stroke="currentColor"
                                      >
                                        <line
                                          x1={0}
                                          y1={100}
                                          x2={100}
                                          y2={0}
                                          vectorEffect="non-scaling-stroke"
                                        />
                                      </svg>
                                    </span>
                                  )}
                                </>
                              )}
                            </RadioGroup.Option>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  )}

                  <button
                    disabled={userInfo?.role === "admin"}
                    style={{
                      cursor:
                        userInfo?.role === "admin" ? "not-allowed" : "pointer",
                      display: product.stock <= 0 ? "none" : "block",
                    }}
                    onClick={handleCart}
                    type="submit"
                    className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-gray-900 px-8 py-3 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Add to Cart
                  </button>
                  {product.stock <= 0 && (
                    <div>
                      <p className="text-md text-red-400">out of stock</p>
                    </div>
                  )}
                  <button
                    disabled={userInfo?.role === "admin"}
                    style={{
                      cursor:
                        userInfo?.role === "admin" ? "not-allowed" : "pointer",
                    }}
                    onClick={handleWishlist}
                    className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-gray-900 px-8 py-3 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Add to Wishlist
                  </button>
                </form>
                {product.stock <= 10 && product.stock > 0 && (
                  <div>
                    <p className="text-sm mt-10 text-red-400">
                      Only {product.stock} quantity left
                    </p>
                  </div>
                )}

                {userInfo && (
                  <div className="py-10">
                    <Button
                      disabled={userInfo?.role === "admin"}
                      style={{
                        cursor:
                          userInfo?.role === "admin"
                            ? "not-allowed"
                            : "pointer",
                      }}
                      onClick={showModal}
                      className="bg-gray-900 text-white"
                      type=""
                    >
                      Bargain Price
                    </Button>

                    <Modal
                      title="Set Your Price"
                      open={isModalOpen}
                      onOk={handleOk}
                      okButtonProps={{ className: "bg-gray-800" }}
                      onCancel={handleCancel}
                    >
                      <Form onFinish={handleBargainRequest} form={bargainForm}>
                        <Form.Item
                          label="Your Price"
                          name="userBargainPrice"
                          initialValue={product.price}
                          rules={[
                            {
                              required: true,
                              message: "Please input your price!",
                            },
                          ]}
                        >
                          <InputNumber
                            addonBefore="$"
                            placeholder="Your Price"
                            max={product.price}
                          />
                        </Form.Item>
                      </Form>
                    </Modal>
                    {bargainRequests.length ? (
                      <div className="mt-10">
                        <h3 className="">Bargain Requests</h3>
                        <div>
                          {bargainRequests.map((itm) => {
                            return (
                              <>
                                <div className="p-5 m-2 border-2 border-gray-200 rounded-md flex justify-between">
                                  <div className=" font-light">
                                    <span className=" font-bold">
                                      Bargained Price -
                                    </span>
                                    {itm.price}
                                  </div>
                                  <div>
                                    {itm.accepted === true
                                      ? "Accepted"
                                      : itm.rejected === true
                                      ? "Rejected"
                                      : "Pending"}
                                  </div>
                                </div>
                              </>
                            );
                          })}
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>

              <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-white lg:pb-16 lg:pr-8 lg:pt-6">
                {/* Description and details */}
                <div>
                  <h3 className="">Description</h3>

                  <div className="space-y-6">
                    <p className="text-base text-gray-900">
                      {product.description}
                    </p>
                  </div>
                </div>

                {product.highlights && (
                  <div className="mt-10">
                    <h3 className="text-sm font-medium text-gray-900">
                      Highlights
                    </h3>

                    <div className="mt-4">
                      <ul
                        role="list"
                        className="list-disc space-y-2 pl-4 text-sm"
                      >
                        {product.highlights.map((highlight) => (
                          <li key={highlight} className="text-gray-400">
                            <span className="text-gray-600">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* <div className="mt-10">
                  <h2 className="text-sm font-medium text-gray-900">Details</h2>

                  <div className="mt-4 space-y-6">
                    <p className="text-sm text-gray-600">
                      {product.description}
                    </p>
                  </div>
                </div> */}
                <div className="mt-10">
                  <h2 className="text-sm font-medium text-gray-900">Reviews</h2>
                  {userInfo && (
                    <div className="mt-4 space-y-6">
                      <Form
                        layout="vertical"
                        onFinish={(values) => {
                          reviewForm.resetFields();
                          handleSubmitReview(values);
                        }}
                        form={reviewForm}
                      >
                        <Form.Item label="Your review" name="review">
                          <TextArea
                            rows={4}
                            placeholder="Write a review about the Product"
                          />
                        </Form.Item>
                        <Form.Item shouldUpdate>
                          {() => (
                            <Button
                              className="bg-gray-900 text-white"
                              htmlType="submit"
                            >
                              sent
                            </Button>
                          )}
                        </Form.Item>
                      </Form>
                      <p className="text-md text-gray-600">Reviews By Users</p>
                      <div>
                        {reviewsByUser.map((itm) => {
                          return (
                            <>
                              <div
                                style={{ border: "1px solid #E3E1D9" }}
                                className="flex gap-3 p-2 mb-2 rounded-md"
                              >
                                <h2 className="text-sm font-medium text-gray-900">
                                  {itm.user.name} -
                                </h2>
                                <p className="text-sm text-gray-600">
                                  {itm.review}
                                </p>
                              </div>
                            </>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
