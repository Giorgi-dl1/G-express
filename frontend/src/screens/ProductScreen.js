import { useContext, useEffect, useReducer } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Rating from "../components/Rating";
import { Helmet } from "react-helmet-async";
import { getError } from "../functions";
import { Store } from "../Store";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, product: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function ProductScreen() {
  const [{ loading, product, error }, dispatch] = useReducer(reducer, {
    product: [],
    loading: false,
    error: "",
  });
  const params = useParams();
  const { slug } = params;
  const navigate = useNavigate();
  useEffect(() => {
    const getProducts = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const data = await axios.get(`/api/products/slug/${slug}`);
        dispatch({ type: "FETCH_SUCCESS", payload: data.data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: getError(error) });
      }
    };
    getProducts();
  }, [slug]);

  const { state, dispatch: contextDispatch } = useContext(Store);
  const { cart } = state;
  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert("Sorry, Product is out of stock");
      return;
    }
    contextDispatch({
      type: "ADD_TO_CART",
      payload: { ...product, quantity },
    });
    navigate("/cart");
  };

  return (
    <div>
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner" />
        </div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="container moreinfo">
          <div className="moreinfo-image">
            <img src={product.image} alt={product.name} />
          </div>
          <div className="information-action">
            <div className="information">
              <Helmet>
                <title>{product.name}</title>
              </Helmet>
              <h1 className="underline">{product.name}</h1>
              <div className="underline">
                <Rating
                  rating={product.rating}
                  numReviews={product.numReviews}
                />
              </div>
              <p className="underline">Price: ${product.price}</p>
              <div className="description">
                <p>Description:</p>
                <p>{product.description}</p>
              </div>
            </div>
            <div className="action">
              <div className="moreinfo-price underline">
                <span>Price:</span>
                <span>${product.price}</span>
              </div>
              <div className="status underline">
                <span>Status:</span>
                <span
                  className={
                    product.countInStock > 0 ? "in-stock" : "unavailable"
                  }
                >
                  {product.countInStock > 0 ? "In Stock" : "Unavailable"}
                </span>
              </div>
              {product.countInStock > 0 && (
                <button onClick={addToCartHandler}>Add to Cart</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductScreen;
