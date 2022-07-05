import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Store } from "../Store";
import { HiPlusCircle, HiMinusCircle, HiOutlineTrash } from "react-icons/hi";
import axios from "axios";
import { Helmet } from "react-helmet-async";
function CartScreen() {
  const { state, dispatch: contextDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  const navigate = useNavigate();
  const changeQuantity = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      return;
    }
    if (quantity < 1) {
      return;
    }
    contextDispatch({
      type: "ADD_TO_CART",
      payload: { ...item, quantity },
    });
  };
  const deleteItem = (x) => {
    contextDispatch({
      type: "CART_DELETE_ITEM",
      payload: { ...x },
    });
  };
  const checckoutHandler = () => {
    navigate("/signin?redirect=/shipping");
  };
  return (
    <div className="container">
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <h1>Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div className="cart-empty">
          Cart is empty. <Link to={"/"}>Go Shopping</Link>
        </div>
      ) : (
        <div className="cart">
          <div className="cart-items">
            {cartItems.map((x) => (
              <div className="cart-item" key={x._id}>
                <div style={{ width: 186, gap: "1rem" }}>
                  <div className="thumbnail">
                    <img src={x.image} alt={x.slug} />
                  </div>
                  <Link to={`/product/${x.slug}`}>{x.slug}</Link>
                </div>

                <div className="control-quantity">
                  <span
                    className={x.quantity <= 1 ? "icon disabled" : "icon minus"}
                    onClick={() => changeQuantity(x, x.quantity - 1)}
                  >
                    <HiMinusCircle />
                  </span>
                  <span>{x.quantity}</span>
                  <span
                    className={
                      x.quantity >= x.countInStock
                        ? "icon disabled"
                        : "icon plus"
                    }
                    onClick={() => changeQuantity(x, x.quantity + 1)}
                  >
                    <HiPlusCircle />
                  </span>
                </div>
                <div className="price">${x.price}</div>
                <div className="icon delete" onClick={() => deleteItem(x)}>
                  <HiOutlineTrash />
                </div>
              </div>
            ))}
          </div>
          <div className="payment">
            <div className="payment-info">
              Subtotal ({cartItems.length} items): $
              {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
            </div>
            <div className="line"></div>
            <div className="checkout">
              <button onClick={() => checckoutHandler()}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartScreen;
