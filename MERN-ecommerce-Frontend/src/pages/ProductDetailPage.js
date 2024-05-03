import NavBar from "../features/navbar/Navbar";
import ProductDetail from "../features/product/components/ProductDetail";
import Footer from "../features/common/Footer";
import { useSelector } from "react-redux";
import { selectLoggedInUser } from "../features/auth/authSlice";

function ProductDetailPage() {
    const user = useSelector(selectLoggedInUser);
    return (
        <div>{
            user ? <NavBar>
                <ProductDetail></ProductDetail>
            </NavBar> : <ProductDetail></ProductDetail>
        }

            <Footer></Footer>
        </div>
    );
}

export default ProductDetailPage;