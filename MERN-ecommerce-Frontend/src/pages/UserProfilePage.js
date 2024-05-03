import Footer from "../features/common/Footer";
import NavBar from "../features/navbar/Navbar";
import UserProfile from "../features/user/components/UserProfile";

function UserProfilePage() {
  return (
    <div>
      <NavBar>
        <div
          className="bg-yellow-50"
          style={{ minHeight: "89vh", boxSizing: "border-box" }}
        >
          <h1 className="mx-auto text-4xl text-center pt-16 text-gray-900">
            My Profile
          </h1>

          <UserProfile></UserProfile>
        </div>
      </NavBar>
    </div>
  );
}

export default UserProfilePage;
