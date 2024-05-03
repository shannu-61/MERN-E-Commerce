import NavBar from "../features/navbar/Navbar";
import UserOrders from "../features/user/components/UserOrders";

function UserOrdersPage() {
  return (
    <div>
      <NavBar>
        <div className="bg-yellow-50 py-5" style={{ minHeight: "90vh" }}>
          <h1 className="mx-auto text-4xl text-center text-gray-900 pt-16">
            My Orders
          </h1>
          <UserOrders></UserOrders>
        </div>
      </NavBar>
    </div>
  );
}

export default UserOrdersPage;
