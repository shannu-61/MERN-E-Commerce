import { Link } from "react-router-dom";
import NavBar from "../features/navbar/Navbar";
import ProductList from "../features/product/components/ProductList";
import Footer from "../features/common/Footer";
import { useSelector } from "react-redux";
import { selectLoggedInUser } from "../features/auth/authSlice";

function Home() {
    const user = useSelector(selectLoggedInUser);
    return (
        <div>
            {user ?
                <NavBar>
                    <ProductList></ProductList>
                </NavBar> : <ProductList></ProductList>
            }

            <Footer></Footer>
        </div>
    );
}

export default Home;