import React, { useState, Fragment, useEffect } from "react";
import StarRateIcon from "@mui/icons-material/StarRate";
import SearchIcon from "@mui/icons-material/Search";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchBrandsAsync,
  fetchCategoriesAsync,
  fetchProductsByFiltersAsync,
  selectAllProducts,
  selectBrands,
  selectCategories,
  selectProductListStatus,
  selectTotalItems,
} from "../productSlice";
import { Dialog, Disclosure, Menu, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
} from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
  Squares2X2Icon,
} from "@heroicons/react/20/solid";
import { ITEMS_PER_PAGE } from "../../../app/constants";
import Pagination from "../../common/Pagination";
import { Grid } from "react-loader-spinner";
import NavBarUnLogged from "../../navbar/NavBarUnLogged";

const sortOptions = [
  {
    name: "Price: Low to High",
    sort: "discountPrice",
    order: "asc",
    current: false,
  },
  {
    name: "Price: High to Low",
    sort: "discountPrice",
    order: "desc",
    current: false,
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ProductList() {
  const [allProducts, setAllProducts] = useState([]);
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const brands = useSelector(selectBrands);
  const categories = useSelector(selectCategories);
  const totalItems = useSelector(selectTotalItems);
  const status = useSelector(selectProductListStatus);
  const [searchedProducts, setSearchedProducts] = useState([]);
  const filters = [
    {
      id: "category",
      name: "Category",
      options: categories,
    },
    {
      id: "brand",
      name: "Brands",
      options: brands,
    },
  ];

  const [filter, setFilter] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState({});
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);

  const handleFilter = (e, section, option) => {
    console.log(e.target.checked);
    const newFilter = { ...filter };
    if (e.target.checked) {
      if (newFilter[section.id]) {
        newFilter[section.id].push(option.value);
      } else {
        newFilter[section.id] = [option.value];
      }
    } else {
      const index = newFilter[section.id].findIndex(
        (el) => el === option.value
      );
      newFilter[section.id].splice(index, 1);
    }
    console.log({ newFilter });

    setFilter(newFilter);
  };

  const fetchAllProducts = () => {
    return new Promise(async (resolve) => {
      const response = await fetch("/products");
      const data = await response.json();
      resolve({ data });
    });
  };

  const handleSort = (e, option) => {
    const sort = { _sort: option.sort, _order: option.order };
    console.log({ sort });
    setSort(sort);
  };

  const handlePage = (page) => {
    console.log({ page });
    setPage(page);
  };

  useEffect(() => {
    const pagination = { _page: page, _limit: ITEMS_PER_PAGE };
    dispatch(fetchProductsByFiltersAsync({ filter, sort, pagination }));
  }, [dispatch, filter, sort, page]);

  useEffect(() => {
    setPage(1);
  }, [totalItems, sort]);

  useEffect(() => {
    dispatch(fetchBrandsAsync());
    dispatch(fetchCategoriesAsync());
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    fetchAllProducts()
      .then((res) => {
        console.log(res.data);
        setAllProducts(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleFilterProductArr = () => {
    const searchedProductsTemp = allProducts?.filter((product) =>
      product?.title?.toLowerCase().includes(searchTerm?.toLowerCase())
    );
    setSearchedProducts(searchedProductsTemp);
  };
  useEffect(() => {
    handleFilterProductArr();
  }, [searchTerm, allProducts]);
  console.log("result");
  return (
    <div className="bg-white">
      <div>
        <MobileFilter
          handleFilter={handleFilter}
          mobileFiltersOpen={mobileFiltersOpen}
          setMobileFiltersOpen={setMobileFiltersOpen}
          filters={filters}
        ></MobileFilter>
        <NavBarUnLogged />
        <main className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24 rounded-md">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              All Products
            </h1>
            <div
              style={{
                border: "1px solid gray",
                borderRadius: "5px",
                padding: "0 2px 0",
              }}
            >
              <SearchIcon />
              <input
                type="text"
                placeholder="Search by Product name"
                value={searchTerm}
                onChange={handleSearch}
                style={{ marginBottom: "0", color: "black" }}
                className="w-72 m-0 border-spacing-0 focus:border-none text-black"
              />
            </div>

            <div className="flex items-center">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                    Sort
                    <ChevronDownIcon
                      className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {sortOptions.map((option) => (
                        <Menu.Item key={option.name}>
                          {({ active }) => (
                            <p
                              onClick={(e) => handleSort(e, option)}
                              className={classNames(
                                option.current
                                  ? "font-medium text-gray-900"
                                  : "text-gray-500",
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm"
                              )}
                            >
                              {option.name}
                            </p>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>

              {/* <button
                type="button"
                className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7"
              >
                <span className="sr-only">View grid</span>
                <Squares2X2Icon className="h-5 w-5" aria-hidden="true" />
              </button> */}
              <button
                type="button"
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pb-24 pt-6">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 gap-y-10">
              {/* Product grid */}
              <div className="lg:col-span-3">
                <ProductGrid
                  products={searchTerm.length > 0 ? searchedProducts : products}
                  status={status}
                ></ProductGrid>
              </div>

              {/* Product grid end */}
              {/* <DesktopFilter
                handleFilter={handleFilter}
                filters={filters}
              ></DesktopFilter> */}
            </div>
          </section>

          {/* section of product and filters ends */}
          <Pagination
            page={page}
            setPage={setPage}
            handlePage={handlePage}
            totalItems={totalItems}
          ></Pagination>
        </main>
      </div>
    </div>
  );
}

function MobileFilter({
  mobileFiltersOpen,
  setMobileFiltersOpen,
  handleFilter,
  filters,
}) {
  return (
    <Transition.Root show={mobileFiltersOpen} as={Fragment}>
      <Dialog as="div" className="relative z-40" onClose={setMobileFiltersOpen}>
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 z-40 flex">
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-gray-900 py-4 pb-12 shadow-xl">
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-white">Filters</h2>
                <button
                  type="button"
                  className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-gray-900 p-2 text-gray-200"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              {/* Filters */}
              <form className="mt-4 border-t border-gray-200">
                {filters.map((section) => (
                  <Disclosure
                    as="div"
                    key={section.id}
                    className="border-t border-gray-200 px-4 py-6"
                  >
                    {({ open }) => (
                      <>
                        <h3 className="-mx-2 -my-3 flow-root">
                          <Disclosure.Button className="flex w-full items-center justify-between bg-gray-900 px-2 py-3 text-gray-400 hover:text-gray-500">
                            <span className="font-medium text-white">
                              {section.name}
                            </span>
                            <span className="ml-6 flex items-center">
                              {open ? (
                                <MinusIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              ) : (
                                <PlusIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              )}
                            </span>
                          </Disclosure.Button>
                        </h3>
                        <Disclosure.Panel className="pt-6">
                          <div className="space-y-6">
                            {section.options.map((option, optionIdx) => (
                              <div
                                key={option.value}
                                className="flex items-center"
                              >
                                <input
                                  id={`filter-mobile-${section.id}-${optionIdx}`}
                                  name={`${section.id}[]`}
                                  defaultValue={option.value}
                                  type="checkbox"
                                  defaultChecked={option.checked}
                                  onChange={(e) =>
                                    handleFilter(e, section, option)
                                  }
                                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label
                                  htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                  className="ml-3 min-w-0 flex-1 text-gray-400"
                                >
                                  {option.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ))}
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

function DesktopFilter({ handleFilter, filters }) {
  return (
    <form className="hidden lg:block rounded-md p-4 bg-gray-900 text-white">
      {filters.map((section) => (
        <Disclosure
          as="div"
          key={section.id}
          className="border-b border-gray-200 py-6"
        >
          {({ open }) => (
            <>
              <h3 className="-my-3 flow-root">
                <Disclosure.Button className="flex w-full items-center justify-between py-3 text-sm text-gray-400 hover:text-white">
                  <span className="font-medium text-white">{section.name}</span>
                  <span className="ml-6 flex items-center">
                    {open ? (
                      <MinusIcon className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <PlusIcon className="h-5 w-5" aria-hidden="true" />
                    )}
                  </span>
                </Disclosure.Button>
              </h3>
              <Disclosure.Panel className="pt-6">
                <div className="space-y-4">
                  {section.options.map((option, optionIdx) => (
                    <div key={option.value} className="flex items-center">
                      <input
                        id={`filter-${section.id}-${optionIdx}`}
                        name={`${section.id}[]`}
                        defaultValue={option.value}
                        type="checkbox"
                        defaultChecked={option.checked}
                        onChange={(e) => handleFilter(e, section, option)}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label
                        htmlFor={`filter-${section.id}-${optionIdx}`}
                        className="ml-3 text-sm text-white"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      ))}
    </form>
  );
}

function ProductGrid({ products, status }) {
  return (
    <div className="bg-white">
      <div
        className="mx-auto px-4 py-0 sm:px-6 sm:py-0  lg:px-8"
        // style={{ transition: "transform 0.3s ease-in-out" }}
      >
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5  xl:gap-x-8">
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
          {products.map((product) => (
            <Link to={`/product-detail/${product.id}`} key={product.id}>
              <div className="group relative p-2 border-gray-200 transform transition-transform hover:scale-110">
                <div className="relative aspect-h-1 aspect-w-1 w-full overflow-hidden lg:aspect-none group-hover:shadow-2xl lg:h-96 lg:w-72">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="h-full w-full object-contain py-5 object-center lg:h-full lg:w-full"
                  />
                  <div
                    style={{
                      background: "#FC6736",
                      position: "absolute",
                      top: "25px",
                      right: "5px",
                      color: "white",
                      borderRadius: "50%",
                      width: "3rem",
                      height: "3rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "lighter",
                    }}
                  >
                    -{Math.round(product.discountPercentage)}%
                  </div>
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3
                      className="text-gray-700 text-md"
                      style={{ fontWeight: "400" }}
                    >
                      <div href={product.thumbnail}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.title.length > 26
                          ? product.title.slice(0, 26) + "..."
                          : product.title}
                      </div>
                    </h3>
                    <div
                      className=" flex gap-2"
                      style={{ alignItems: "center" }}
                    >
                      <p className="block line-through font-medium text-gray-400">
                        ${product.price}
                      </p>
                      <p className="block font-medium text-gray-900 text-lg">
                        $
                        {product.price -
                          Math.round(
                            (product.price * product.discountPercentage) / 100
                          )}
                      </p>
                    </div>
                  </div>
                  {product.rating !== 0 ? (
                    <p
                      className="mt-1 text-sm bg-green-900 w-14 h-7 flex rounded-lg text-white"
                      style={{ alignItems: "center", justifyContent: "center" }}
                    >
                      <StarRateIcon
                        className="w-3 h-3 inline"
                        fontSize="small"
                      ></StarRateIcon>
                      <span className=" align-bottom">{product.rating}</span>
                    </p>
                  ) : (
                    ""
                  )}
                </div>
                {product.deleted && (
                  <div>
                    <p className="text-sm text-red-400">product deleted</p>
                  </div>
                )}
                {product.stock <= 0 && (
                  <div>
                    <p className="text-sm text-red-400">out of stock</p>
                  </div>
                )}
                {product.stock <= 10 && product.stock > 0 && (
                  <div>
                    <p className="text-sm text-red-400">
                      Only {product.stock} quantity left
                    </p>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
