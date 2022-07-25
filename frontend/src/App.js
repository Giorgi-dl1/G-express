import { useContext, useEffect, useState } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import CartScreen from "./screens/CartScreen";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import SigninScreen from "./screens/SigninScreen";
import { Store } from "./Store";
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ShippingAddresScreen from "./screens/ShippingAddresScreen";
import SignupScreen from "./screens/SignupScreen";
import PaymentMethodScreen from "./screens/PaymentMethodScreen";
import PreviewOrderScreen from "./screens/PreviewOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import OrderHistoryScreen from "./screens/OrderHistoryScreen";
import UserProfileScreen from "./screens/UserProfileScreen";
import { getError } from "./functions";
import axios from "axios";
import SearchBox from "./components/SearchBox";

function App() {
  const { state, dispatch: contextDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const [dropdown, setDropDown] = useState(false);
  const [showToggleNaw, setShowToggleNav] = useState(false);
  const signoutHandler = () => {
    contextDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("shippingAdress");
    localStorage.removeItem("paymentMethod");
    window.location.href = "/signin";
  };
  const [showSidebar, setShowSidebar] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("/api/products/categories");
        setCategories(data);
      } catch (error) {
        toast.error(getError(error));
      }
    };
    fetchCategories();
  }, []);

  return (
    <BrowserRouter>
      <div className="site-container">
        <div>
          <ToastContainer position="bottom-center" limit={1} />
          <header className={showSidebar ? "sidebar-margin" : ""}>
            <div className="container navbar">
              <div className="sidebar-brand">
                <div
                  className="hamburger"
                  onClick={() => setShowSidebar(!showSidebar)}
                >
                  <div className="line"></div>
                  <div className="line"></div>
                  <div className="line"></div>
                </div>
                <Link to="/">G-express</Link>
                <SearchBox />
              </div>
              <div className="navitems">
                <Link to="/cart">
                  <div className="cart-icon">
                    Cart
                    {cart.cartItems.length >= 1 && (
                      <span className="cartCount">
                        {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                      </span>
                    )}
                  </div>
                </Link>

                {userInfo ? (
                  <div
                    className="dropdown"
                    onClick={() => setDropDown(!dropdown)}
                  >
                    <div className="dropdown-title">
                      {userInfo.name}
                      {dropdown ? <AiOutlineArrowUp /> : <AiOutlineArrowDown />}
                    </div>
                    {dropdown ? (
                      <div className="dropdown-items">
                        <Link to="/profile">
                          <div className="dropdown-item">User Profile</div>
                        </Link>
                        <Link to="/orderhistory">
                          <div className="dropdown-item">Order History</div>
                        </Link>
                        <div className="line"></div>
                        <Link to="#signout">
                          <div
                            className="dropdown-item signout"
                            onClick={signoutHandler}
                          >
                            Sign Out
                          </div>
                        </Link>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                ) : (
                  <Link to="/signin">Sign In</Link>
                )}
              </div>
              <div
                className="hamburger mobile-hamburger"
                onClick={() => setShowToggleNav(!showToggleNaw)}
              >
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
              </div>
            </div>
          </header>
          {showToggleNaw && (
            <div className="navitems-toggle">
              <Link to="/cart">
                <div className="cart-icon">
                  Cart
                  {cart.cartItems.length >= 1 && (
                    <span className="cartCount">
                      {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                    </span>
                  )}
                </div>
              </Link>

              {userInfo ? (
                <div
                  className="dropdown"
                  onClick={() => setDropDown(!dropdown)}
                >
                  <div className="dropdown-title">
                    {userInfo.name}
                    {dropdown ? <AiOutlineArrowUp /> : <AiOutlineArrowDown />}
                  </div>
                  {dropdown ? (
                    <div className="dropdown-items">
                      <Link to="/profile">
                        <div className="dropdown-item">User Profile</div>
                      </Link>
                      <Link to="/orderhistory">
                        <div className="dropdown-item">Order History</div>
                      </Link>
                      <div className="line"></div>
                      <Link to="#signout">
                        <div
                          className="dropdown-item signout"
                          onClick={signoutHandler}
                        >
                          Sign Out
                        </div>
                      </Link>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                <Link to="/signin">Sign In</Link>
              )}
            </div>
          )}
          <div className={showSidebar ? "sidebar show-sidebar" : "sidebar "}>
            <h3 className="category-header">Categories</h3>
            {categories.map((category) => (
              <div className="category-link">
                <Link to={`/search?category=${category}`}>{category}</Link>
              </div>
            ))}
          </div>
          <main className={showSidebar ? "sidebar-margin" : ""}>
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route path="/shipping" element={<ShippingAddresScreen />} />
              <Route path="/payment" element={<PaymentMethodScreen />} />
              <Route path="/order/:id" element={<OrderScreen />} />
              <Route path="placeorder" element={<PreviewOrderScreen />} />
              <Route path="/orderhistory" element={<OrderHistoryScreen />} />
              <Route path="/profile" element={<UserProfileScreen />} />
            </Routes>
          </main>
        </div>
        <footer>
          <p>footer</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
