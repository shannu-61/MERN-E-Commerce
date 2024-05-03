import { useEffect, useState } from "react";
import { fetchProductById } from "../../product/productAPI";
import { Button, message } from "antd";

import { fetchUserByID } from "../../user/userAPI";

const AdminBargainRequests = () => {
  const [bargainRequests, setBargainRequest] = useState([]);
  const [bargainProductData, setBargainProductData] = useState([]);

  const fetchBargainRequests = () => {
    return new Promise(async (resolve) => {
      const response = await fetch("/bargains");
      const data = await response.json();
      resolve({ data });
    });
  };

  const handelAccept = (id) => {
    return new Promise(async (resolve) => {
      const response = await fetch("/bargains/accept/" + id, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
      });
    });
  };

  const handelDelete = (id) => {
    return new Promise(async (resolve) => {
      const response = await fetch("/bargains/" + id, {
        method: "DELETE",
        headers: { "content-type": "application/json" },
      });
    });
  };

  const handelReject = (id) => {
    return new Promise(async (resolve) => {
      const response = await fetch("/bargains/reject/" + id, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
      });
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let temp = [];
        const productPromises = bargainRequests.map((request) =>
          fetchProductById(request.product)
            .then((result) => ({
              ...result.data,
              bargainPrice: request.price,
              bargainId: request._id,
              bargainAccept: request.accepted,
              bargainReject: request.rejected,
              user: request.user,
            }))
            .catch((error) => {
              console.error(error);
              return null;
            })
        );
        const userPromises = bargainRequests.map((request) =>
          fetchUserByID(request.user)
            .then((userData) => {
              return {
                id: userData.data.id,
                userEmail: userData.data.email,
              };
            })
            .catch((error) => {
              console.error(error);
              return null;
            })
        );
        const productResults = await Promise.all(productPromises);
        const userResults = await Promise.all(userPromises);
        const validProducts = productResults.filter(
          (product) => product !== null
        );
        const validUsers = userResults.filter((user) => user !== null);

        validProducts.forEach((product) => {
          const userData = validUsers.find((user) => user.id === product.user);
          if (userData) {
            product.userEmail = userData.userEmail;
          }
        });
        setBargainProductData(validProducts);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [bargainRequests]);

  useEffect(() => {
    fetchBargainRequests()
      .then((result) => {
        setBargainRequest(result.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  return (
    <>
      <div className="p-10">
        <h1 className="mb-10 text-2xl">Bargain Requests</h1>
        <ul
          className="-my-6 divide-y divide-gray-200 px-5 rounded-lg"
          style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
        >
          {bargainProductData.length === 0 ? (
            <div className="px-4 py-6 sm:px-6 rounded-lg flex justify-center">
              <div>No Requests</div>
            </div>
          ) : null}
          {bargainProductData.map((item) => (
            <li key={item.id} className="flex py-6">
              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="h-full w-full object-cover object-center"
                />
              </div>

              <div className="ml-4 flex flex-1 flex-col">
                <div>
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <h3>
                      <a href={item.id}>{item.title}</a>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Original Price - $
                      {item.price -
                        Math.round(
                          (item.price * item.discountPercentage) / 100
                        )}
                      <p className="ml-4">Asked Price - ${item.bargainPrice}</p>
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      User mail id - {item.userEmail}
                    </p>
                    <div className="flex flex-col gap-2">
                      <Button
                        disabled={
                          item.bargainAccept === true ||
                          item.bargainReject === true
                        }
                        onClick={() => {
                          handelAccept(item.bargainId);
                          window.location.reload();
                        }}
                        className="bg-green-600 text-white"
                      >
                        Accept
                      </Button>
                      <Button
                        disabled={
                          item.bargainAccept === true ||
                          item.bargainReject === true
                        }
                        onClick={() => {
                          handelReject(item.bargainId);
                          window.location.reload();
                        }}
                        className="bg-red-600 text-white"
                      >
                        Reject
                      </Button>
                      <Button
                        onClick={() => {
                          handelDelete(item.bargainId);
                          window.location.reload();
                        }}
                        className=""
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{item.brand}</p>
                </div>
                <div className="flex flex-1 items-end justify-between text-sm"></div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default AdminBargainRequests;
