import { useContext } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import CartScreen from "./screens/CartScreen";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import { Store } from "./Store";
function App() {
  const { state } = useContext(Store);
  const { cart } = state;
  return (
    <BrowserRouter>
      <div className="site-container">
        <div>
          <header>
            <div className="container navbar">
              <Link to="/">G-express</Link>
              <div className="navitems">
                <div className="cart-icon">
                  Cart
                  {cart.cartItems.length >= 1 && (
                    <span className="cartCount">
                      {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </header>
          <main>
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
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
