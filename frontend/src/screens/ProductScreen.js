import { useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Rating from "../components/Rating";
import { Helmet } from "react-helmet-async";
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

  useEffect(() => {
    const getProducts = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const data = await axios.get(`/api/products/slug/${slug}`);
        dispatch({ type: "FETCH_SUCCESS", payload: data.data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: error.message });
      }
    };
    getProducts();
  }, [slug]);

  return (
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
            <Rating rating={product.rating} numReviews={product.numReviews} />
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
              className={product.countInStock > 0 ? "in-stock" : "unavailable"}
            >
              {product.countInStock > 0 ? "In Stock" : "Unavailable"}
            </span>
          </div>
          {product.countInStock > 0 && <button>Add to Cart</button>}
        </div>
      </div>
    </div>
  );
}

export default ProductScreen;
