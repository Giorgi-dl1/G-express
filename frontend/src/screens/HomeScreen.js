import { useEffect, useReducer } from "react";
import axios from "axios";
import logger from "use-reducer-logger";
import Product from "../components/Product";
import { Helmet } from "react-helmet-async";
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, products: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      break;
  }
};

function HomeScreen() {
  const [{ loading, products, error }, dispatch] = useReducer(logger(reducer), {
    products: [],
    error: "",
    loading: true,
  });
  useEffect(() => {
    const getProducts = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const data = await axios.get("/api/products");
        dispatch({ type: "FETCH_SUCCESS", payload: data.data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: error.message });
      }
    };
    getProducts();
  }, []);

  return (
    <div className="container">
      <Helmet>
        <title>G-express</title>
      </Helmet>
      <h1>featured products</h1>
      <div className="products">
        {loading ? (
          <div>loading...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          products.map((product) => (
            <Product product={product} key={product.slug} />
          ))
        )}
      </div>
    </div>
  );
}

export default HomeScreen;
