import axios from "axios";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { Store } from "../Store";
import Rating from "./Rating";

function Product({ product }) {
  const { state, dispatch: contextDispatch } = useContext(Store);
  const { cart } = state;
  const addToCartHandler = async (x) => {
    const existItem = cart.cartItems.find((item) => item._id === x._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${x._id}`);
    if (data.countInStock < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }
    contextDispatch({
      type: "ADD_TO_CART",
      payload: { ...x, quantity },
    });
  };
  return (
    <div className="product">
      <div className="image">
        <Link to={`/product/${product.slug}`}>
          <img src={product.image} alt={product.name} />
        </Link>
      </div>
      <div className="product-info">
        <Link to={`/product/${product.slug}`}>
          <p>{product.name}</p>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <p className="price">${product.price}</p>
        {product.countInStock === 0 ? (
          <button className="outstock-button">Out of stock</button>
        ) : (
          <button onClick={() => addToCartHandler(product)}>Add to cart</button>
        )}
      </div>
    </div>
  );
}

export default Product;
