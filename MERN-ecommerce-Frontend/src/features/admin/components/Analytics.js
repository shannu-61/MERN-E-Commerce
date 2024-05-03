import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { Flex } from "antd";
import NavBar from "../../navbar/Navbar";

const Analytics = () => {
  const [products, setProducts] = useState([]);
  const [revenueDetailsPerMonth, setRevenueDetailsPerMonth] = useState([]);
  const [productCount, setProductCount] = useState([]);
  const [orderCountByMonth, setOrderCountByMonth] = useState([]);
  const [orders, setOrders] = useState([]);
  const [todayOrderCount, setTodayOrderCount] = useState(0);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [weeklyRevenue, setWeeklyRevenue] = useState(0);
  const [yearlyRevenue, setYearlyRevenue] = useState(0);
  const [weeklyOrderCount, setWeeklyOrderCount] = useState(0);
  const [yearlyOrderCount, setYearlyOrderCount] = useState(0);

  // Function to calculate weekly and yearly order counts
  const calculateWeeklyYearlyOrders = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    // Calculate the first day of the current week
    const firstDayOfWeek = new Date();
    firstDayOfWeek.setDate(firstDayOfWeek.getDate() - firstDayOfWeek.getDay());

    // Calculate the last day of the current week
    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);

    // Filter orders for the current week
    const weeklyOrders = orders.filter(
      (order) =>
        new Date(order.createdAt) >= firstDayOfWeek &&
        new Date(order.createdAt) <= lastDayOfWeek &&
        order.status !== "cancelled by seller" &&
        order.status !== "cancelled by buyer"
    );

    // Set the weekly order count
    setWeeklyOrderCount(weeklyOrders.length);

    // Filter orders for the current year
    const yearlyOrders = orders.filter(
      (order) =>
        new Date(order.createdAt).getFullYear() === currentYear &&
        order.status !== "cancelled by seller" &&
        order.status !== "cancelled by buyer"
    );

    // Set the yearly order count
    setYearlyOrderCount(yearlyOrders.length);
  };

  const calculateTodayStats = () => {
    const today = new Date().toLocaleDateString();
    const todayOrders = orders.filter(
      (order) =>
        new Date(order.createdAt).toLocaleDateString() === today &&
        order.status !== "cancelled by seller" &&
        order.status !== "cancelled by buyer"
    );
    const todayOrderCount = todayOrders.length;
    const todayRevenue = todayOrders.reduce((total, order) => {
      // Only add the order's totalAmount if it's not canceled
      if (
        order.status !== "cancelled by seller" &&
        order.status !== "cancelled by buyer"
      ) {
        return total + order.totalAmount;
      } else {
        return total;
      }
    }, 0);
    setTodayOrderCount(todayOrderCount);
    setTodayRevenue(todayRevenue);
  };

  // Function to calculate weekly and yearly revenue
  const calculateWeeklyYearlyRevenue = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    // Calculate the start and end dates of the current week
    const firstDayOfWeek = new Date(
      currentDate.setDate(currentDate.getDate() - currentDate.getDay())
    );
    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);

    // Calculate weekly revenue, filtering out cancelled orders
    const weeklyRevenue = orders
      .filter((order) => {
        const orderDate = new Date(order.createdAt);
        return (
          orderDate >= firstDayOfWeek &&
          orderDate <= lastDayOfWeek &&
          !["cancelled by seller", "cancelled by buyer"].includes(order.status)
        );
      })
      .reduce((total, order) => total + order.totalAmount, 0);

    // Calculate yearly revenue, filtering out cancelled orders
    const yearlyRevenue = orders
      .filter(
        (order) =>
          new Date(order.createdAt).getFullYear() === currentYear &&
          !["cancelled by seller", "cancelled by buyer"].includes(order.status)
      )
      .reduce((total, order) => total + order.totalAmount, 0);

    setWeeklyRevenue(weeklyRevenue);
    setYearlyRevenue(yearlyRevenue);
  };

  useEffect(() => {
    calculateTodayStats();
    calculateWeeklyYearlyRevenue();
    calculateWeeklyYearlyOrders();
  }, [orders]);

  // Helper function to get week number
  const getWeekNumber = (date) => {
    const onejan = new Date(date.getFullYear(), 0, 1);
    const millisecsInDay = 86400000;
    return Math.ceil(
      ((date - onejan) / millisecsInDay + onejan.getDay() + 1) / 7
    );
  };
  function convertToCSV(
    orderCountByMonth,
    revenueDetailsPerMonth,
    todayOrderCount,
    todayRevenue,
    weeklyOrderCount,
    weeklyRevenue,
    yearlyOrderCount,
    yearlyRevenue
  ) {
    const csvRows = [];

    // Add current date
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
    csvRows.push(["Date:", formattedDate]);

    csvRows.push([]);

    // Add header for Today's Statistics
    csvRows.push(["Today's Statistics"]);
    csvRows.push(["Order Count Today", todayOrderCount]);
    csvRows.push(["Revenue Today", `$${todayRevenue}`]);

    // Add empty row for separation
    csvRows.push([]);

    // Add header for Weekly Statistics
    csvRows.push(["Weekly Statistics"]);
    csvRows.push(["Order Count Weekly", weeklyOrderCount]);
    csvRows.push(["Revenue Weekly", `$${weeklyRevenue}`]);

    // Add empty row for separation
    csvRows.push([]);

    // Add header for Yearly Statistics
    csvRows.push(["Yearly Statistics"]);
    csvRows.push(["Order Count Yearly", yearlyOrderCount]);
    csvRows.push(["Revenue Yearly", `$${yearlyRevenue}`]);

    // Add empty row for separation
    csvRows.push([]);

    // Add header for Order Count by Month
    csvRows.push(["Order Count by Month"]);
    orderCountByMonth.slice(1).forEach((row) => {
      csvRows.push(row);
    });

    // Add empty row for separation
    csvRows.push([]);

    // Add header for Revenue Detail by Month
    csvRows.push(["Revenue Detail by Month"]);
    revenueDetailsPerMonth.slice(1).forEach((row) => {
      row[1] = `"$${row[1]}"`;
      csvRows.push(row);
    });

    // Join rows with newline character
    return csvRows.join("\n");
  }

  // Function to trigger CSV download
  function downloadCSV(csvString) {
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "analytics.csv";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }

  const date = new Date();
  const year = date.toLocaleString("default", { year: "numeric" });
  const month = date.toLocaleString("default", { month: "long" });
  const day = date.toLocaleString("default", { day: "numeric" });

  const fetchAllProducts = () => {
    return new Promise(async (resolve) => {
      const response = await fetch("/products");
      const data = await response.json();
      resolve({ data });
    });
  };

  const fetchAllOrders = () => {
    return new Promise(async (resolve) => {
      const response = await fetch("/orders");
      const data = await response.json();
      resolve({ data });
    });
  };
  useEffect(() => {
    fetchAllProducts()
      .then((res) => {
        setProducts(res.data);
      })
      .catch((error) => {
        console.log(error);
      });

    fetchAllOrders()
      .then((res) => {
        setOrders(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const temp = {};
    let productCountCategoryWise = [["category", "product count"]];
    for (let index = 0; index < products.length; index++) {
      if (products[index].category in temp) {
        temp[products[index].category] += 1;
      } else {
        temp[products[index].category] = 1;
      }
    }
    for (let key in temp) {
      productCountCategoryWise.push([key, temp[key]]);
    }
    setProductCount(productCountCategoryWise);
  }, [products]);

  useEffect(() => {
    const temp = {};
    const revenueTemp = {};
    const odersCount = [["Month", ""]];
    const revenueDetails = [["Month", ""]];
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const validOrders = orders.filter(
      (order) =>
        order.status !== "cancelled by seller" &&
        order.status !== "cancelled by buyer"
    ); // Filter out cancelled orders
    for (let index = 0; index < validOrders.length; index++) {
      const dateString = validOrders[index].createdAt;
      const date = new Date(dateString);
      const month = monthNames[date.getMonth()];
      if (month in temp) {
        temp[month] += 1;
      } else {
        temp[month] = 1;
      }
      if (month in revenueTemp) {
        if (validOrders[index]?.totalAmount) {
          revenueTemp[month] += validOrders[index]?.totalAmount;
        }
      } else {
        if (validOrders[index]?.totalAmount) {
          revenueTemp[month] = validOrders[index]?.totalAmount;
        }
      }
    }
    //console.log(revenueTemp);
    for (let key in temp) {
      odersCount.push([key, temp[key]]);
    }
    for (let key in revenueTemp) {
      revenueDetails.push([key, revenueTemp[key]]);
    }
    //console.log(revenueDetails);
    setRevenueDetailsPerMonth(revenueDetails);
    setOrderCountByMonth(odersCount);
  }, [orders]);
  const options = {
    title: "Category wise product count",
    titleTextStyle: { color: "#fff" },
    legend: "none",
    pieSliceText: "label",
    is3D: true,
    slices: {
      4: { offset: 0.2 },
      12: { offset: 0.3 },
      14: { offset: 0.4 },
      15: { offset: 0.5 },
    },
    backgroundColor: "#496989",
  };

  const orderGraphOptions = {
    title: "Orders",
    titleTextStyle: { color: "#fff" },
    hAxis: {
      title: "Month",
      titleTextStyle: { color: "#fff" },
      textStyle: { color: "#fff" },
    },
    vAxis: {
      title: "Order Count",
      minValue: 0,
      titleTextStyle: { color: "#fff" },
      textStyle: { color: "#fff" },
    },
    chartArea: { width: "50%", height: "70%" },
    backgroundColor: "#496989",
    colors: ["white"],
  };
  const revenueGraphOptions = {
    title: "Revenue in $",
    titleTextStyle: { color: "#fff" },
    hAxis: {
      title: "Month",
      titleTextStyle: { color: "#fff" },
      textStyle: { color: "#fff" },
    },
    vAxis: {
      title: "Revenue Amount",
      titleTextStyle: { color: "#fff" },
      textStyle: { color: "#fff" },
      minValue: 0,
    },
    chartArea: { width: "50%", height: "70%" },
    backgroundColor: "#496989",
    colors: ["white"],
    style: { borderRadius: "1rem" },
  };

  console.log(revenueDetailsPerMonth, orderCountByMonth);
  const months = orderCountByMonth.slice(1).map((item) => item[0]);
  const values = orderCountByMonth.slice(1).map((item) => item[1]);

  const months2 = revenueDetailsPerMonth.slice(1).map((item) => item[0]);
  const values2 = revenueDetailsPerMonth.slice(1).map((item) => item[1]);
  return (
    <>
      <div style={{ minHeight: "100vh" }} className="bg-gray-900 pb-4">
        <NavBar />
        <div
          style={{ padding: "0 20px" }}
          className="bg-gray-900"
          color="white"
        >
          <h1
            style={{
              textAlign: "center",
              fontSize: "34px",
              marginBottom: "30px",
              color: "white",
            }}
          >
            Analytics <br />
          </h1>

          <h1
            style={{
              fontSize: "30px",
              marginBottom: "25px",
              color: "white",
            }}
          >
            {month} {day} {year} <br />
          </h1>
          <div
            style={{
              display: "inline-block",
              border: "1px solid white",
              padding: "5px",
              borderRadius: "5px",
              marginBottom: "10px",

              ":hover": { backgroundColor: "#385d85" },
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#385d85";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
            }}
          >
            <button
              style={{
                fontSize: "19px",
                color: "white",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
              onClick={() =>
                downloadCSV(
                  convertToCSV(
                    orderCountByMonth,
                    revenueDetailsPerMonth,
                    todayOrderCount,
                    todayRevenue,
                    weeklyOrderCount,
                    weeklyRevenue,
                    yearlyOrderCount,
                    yearlyRevenue
                  )
                )
              }
            >
              Download CSV <span>&#x21E9;</span>
            </button>
          </div>

          <div className="lg:flex lg:flex-row w-full py-4 sm:flex-col">
            <div className="lg:w-1/2 sm:w-full bg-[#496898] p-8 mt-2 rounded-lg shadow-lg">
              <div className="border-b-2 border-white mb-4 pb-4">
                <h1 className="text-white text-3xl mb-4">Orders</h1>
                <div className="grid grid-cols-3 gap-4 text-white">
                  {months?.map((data, index) => (
                    <div key={index}>
                      <p className="text-lg">{data}</p>
                      <p className="text-4xl">{values[index]}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="mt-8">
                  <h2 className="text-lg text-white">Today</h2>
                  <p className="text-3xl text-white">{todayOrderCount}</p>
                </div>
                {/* Render weekly order count */}
                <div className="mt-8">
                  <h2 className="text-lg text-white">Week</h2>
                  <p className="text-3xl text-white">{weeklyOrderCount}</p>
                </div>
                {/* Render yearly order count */}
                <div className="mt-8">
                  <h2 className="text-lg text-white">Year</h2>
                  <p className="text-3xl text-white">{yearlyOrderCount}</p>
                </div>
              </div>
            </div>

            <div className="lg:mx-2 sm:my-4"></div>

            <div className="lg:w-1/2 sm:w-full bg-[#496898] p-8 mt-2 rounded-lg shadow-lg">
              <div className="border-b-2 border-white mb-4 pb-4">
                <h1 className="text-3xl text-white mb-2">Revenue</h1>
                <div className="grid grid-cols-3 gap-4">
                  {months2?.map((data, index) => (
                    <div key={index} className="text-white">
                      <p className="text-lg">{data}</p>
                      <p className="text-4xl">${values2[index]}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h2 className="text-lg text-white">Today</h2>
                  <p className="text-3xl text-white">${todayRevenue}</p>
                </div>
                <div>
                  <h2 className="text-lg text-white">Week</h2>
                  <p className="text-3xl text-white">${weeklyRevenue}</p>
                </div>
                <div>
                  <h2 className="text-lg text-white">Year</h2>
                  <p className="text-3xl text-white">${yearlyRevenue}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Container for statistics */}
          <div className="lg:flex lg:justify-around lg:items-center lg:flex-wrap lg:flex-row sm:flex-col">
            <div
              className="rounded-lg lg:w-1/2 w-full"
              style={{
                //width: "calc(50% - 20px)",
                marginBottom: "20px",
                boxSizing: "border-box",
              }}
            >
              {orderCountByMonth.length > 0 && (
                <Chart
                  className="chart-item"
                  chartType="AreaChart"
                  height="710px"
                  data={orderCountByMonth}
                  options={orderGraphOptions}
                />
              )}
            </div>

            <div
              className="lg:w-1/2 w-full lg:pl-3 lg:flex lg:flex-col flex justify-around flex-row lg:gap-0 gap-5"
              style={{
                boxSizing: "border-box",
              }}
            >
              <div
                className="rounded-lg w-1/2 lg:w-full"
                style={{
                  marginBottom: "10px",
                  boxSizing: "border-box",
                }}
              >
                {revenueDetailsPerMonth.length > 0 && (
                  <Chart
                    className="chart-item"
                    chartType="AreaChart"
                    height="350px"
                    data={revenueDetailsPerMonth}
                    options={revenueGraphOptions}
                  />
                )}
              </div>

              <div
                className="rounded-lg w-1/2 lg:w-full"
                style={{
                  //width: "calc(100% - 20px)",
                  marginBottom: "10px",
                  boxSizing: "border-box",
                }}
              >
                {productCount.length > 0 && (
                  <Chart
                    className="chart-item"
                    chartType="PieChart"
                    height="350px"
                    data={productCount}
                    options={options}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Analytics;
