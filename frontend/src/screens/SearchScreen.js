import { useEffect, useReducer, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { getError } from "../functions";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import Rating from "../components/Rating";
import Product from "../components/Product";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        countProducts: action.payload.countProducts,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const prices = [
  {
    name: "$1 to $50",
    value: "1-50",
  },
  {
    name: "$51 to $200",
    value: "51-200",
  },
  {
    name: "$201 to $1000",
    value: "201-1000",
  },
];

const ratings = [
  {
    name: "4stars & up",
    rating: 4,
  },
  {
    name: "3stars & up",
    rating: 3,
  },
  {
    name: "2stars & up",
    rating: 2,
  },
  {
    name: "1stars & up",
    rating: 1,
  },
];

function SearchScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const category = sp.get("category") || "all";
  const query = sp.get("query") || "all";
  const price = sp.get("price") || "all";
  const rating = sp.get("rating") || "all";
  const order = sp.get("order") || "newest";
  const page = sp.get("page") || 1;

  const [{ loading, error, products, pages, countProducts }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `/api/products/search?page=${page}&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`
        );
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: getError(error) });
      }
    };
    fetchData();
  }, [category, error, order, page, price, query, rating]);

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("/api/products/categories");
        setCategories(data);
      } catch (error) {
        toast.error(error);
      }
    };
    fetchCategories();
  }, [dispatch]);

  const getFilterUrl = (filter) => {
    const filterPage = filter.page || 1;
    const filterCategory = filter.category || category;
    const filterQuery = filter.query || query;
    const filterRating = filter.rating || rating;
    const filterPrice = filter.price || price;
    const sortOrder = filter.order || order;
    return `/search?page=${filterPage}&query=${filterQuery}&category=${filterCategory}&price=${filterPrice}&rating=${filterRating}&order=${sortOrder}`;
  };

  return (
    <div className="container">
      <Helmet>
        <title>Search Products</title>
      </Helmet>
      <div className="search-screen">
        <div className="filters">
          <div className="filter-department">
            <h3>Department</h3>
            <div>
              <ul>
                <li>
                  <Link
                    className={category === "all" ? "text-bold" : ""}
                    to={getFilterUrl({ category: "all" })}
                  >
                    Any
                  </Link>
                </li>
                {categories.map((c) => (
                  <li key={c}>
                    <Link
                      className={category === c ? "text-bold" : ""}
                      to={getFilterUrl({ category: c })}
                    >
                      {c}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="filter-price">
            <h3>Price</h3>
            <div>
              <ul>
                <li>
                  <Link
                    className={price === "all" ? "text-bold" : ""}
                    to={getFilterUrl({ price: "all" })}
                  >
                    Any
                  </Link>
                </li>
                {prices.map((c) => (
                  <li key={c.value}>
                    <Link
                      className={price === c.value ? "text-bold" : ""}
                      to={getFilterUrl({ price: c.value })}
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="filter-reviev">
            <h3>Avg. Customer Reviev</h3>
            <div>
              <ul>
                {ratings.map((c) => (
                  <li key={c.rating}>
                    <Link
                      className={rating === c.rating ? "text-bold" : ""}
                      to={getFilterUrl({ rating: c.rating })}
                    >
                      <Rating rating={c.rating} caption={" & up"} />
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    className={rating === "all" ? "text-bold" : ""}
                    to={getFilterUrl({ rating: "all" })}
                  >
                    <Rating rating={0} caption={" & up"} />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="products-div">
          {loading ? (
            <div className="loading-spinner" />
          ) : error ? (
            <div className="error">{error}</div>
          ) : (
            <div>
              <div className="info-sort">
                <div className="info">
                  {countProducts === 0 ? "No" : countProducts} Results
                  {query !== "all" && " : " + query}
                  {category !== "all" && " : " + category}
                  {price !== "all" && " : Price " + price}
                  {rating !== "all" && " : Rating " + rating}
                  {query !== "all" ||
                  category !== "all" ||
                  price !== "all" ||
                  rating !== "all" ? (
                    <button
                      className="button-search"
                      onClick={() => navigate("/search")}
                    >
                      reset
                    </button>
                  ) : null}
                </div>
                <div className="sort">
                  Sort bt{" "}
                  <select
                    value={order}
                    onChange={(e) => {
                      navigate(getFilterUrl({ order: e.target.value }));
                    }}
                  >
                    <option value="newest">Newest Arrival</option>
                    <option value="lowest">Price: Low to High</option>
                    <option value="highest">Price: High to Low</option>
                    <option value="toprated">Avg. customer Reviews</option>
                  </select>
                </div>
              </div>
              {products.length === 0 ? (
                <div className="error">No Products Found</div>
              ) : (
                <>
                  <div className="products min-height">
                    {products.map((product) => (
                      <Product product={product} key={product.slug} />
                    ))}
                  </div>
                  <div className="pagination">
                    {[...Array(pages).keys()].map((x) => (
                      <Link key={x + 1} to={getFilterUrl({ page: x + 1 })}>
                        <button
                          className={
                            Number(page) === x + 1
                              ? "button-search active-page"
                              : "button-search"
                          }
                        >
                          {x + 1}
                        </button>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchScreen;
