import axios from "axios";
import { useContext, useEffect, useReducer } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Store } from "../Store";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { toast } from "react-toastify";
import { getError } from "../functions";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCES":
      return { ...state, loading: false, error: "", order: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "PAY_REQUEST":
      return { ...state, loadingPay: true };
    case "PAY_SUCCESS":
      return { ...state, loadingPay: false, successPay: true };
    case "PAY_FAIL":
      return { ...state, loadingPay: false };
    case "PAY_RESET":
      return { ...state, loadingPay: false, successPay: false };
    default:
      return state;
  }
}

function OrderScreen() {
  const [{ loading, error, order, successPay, loadingPay }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
      order: {},
      successPay: false,
      loadingPay: false,
    });
  const navigate = useNavigate();
  const { state } = useContext(Store);

  const { userInfo } = state;
  const { id } = useParams();

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
          },
        ],
      })
      .then((orderId) => {
        return orderId;
      });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then(async (details) => {
      try {
        dispatch({ type: "PAY_REQUEST" });
        console.log(details);
        const { data } = await axios.put(
          `/api/orders/${order._id}/pay`,
          details,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: "PAY_SUCCESS", payload: data });
        toast.success("Order is paid");
      } catch (err) {
        dispatch({ type: "PAY_FAIL", payload: err });
        console.log(err);
        toast.error(getError(err));
      }
    });
  };

  const onError = (err) => {
    toast.error(getError(err));
  };

  useEffect(() => {
    const getOrder = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/orders/${id}`, {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        });
        dispatch({ type: "FETCH_SUCCES", payload: data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: getError(error) });
      }
    };
    if (!userInfo) {
      return navigate("/signin");
    }

    if (!order._id || successPay || (order._id && order._id !== id)) {
      getOrder();
      if (successPay) {
        dispatch({ type: "PAY_RESET" });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get("/api/keys/paypal", {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      loadPaypalScript();
    }
  }, [userInfo, navigate, order, id, paypalDispatch, successPay]);

  return loading ? (
    <div className="loading-spinner" />
  ) : error ? (
    <div className="error">{getError(error)}</div>
  ) : (
    <div className="container">
      <Helmet>
        <title>Order {id}</title>
      </Helmet>
      <h1>Order {id}</h1>
      <div className="info-checkout">
        <div className="info">
          <div className="box">
            <h3>Shipping</h3>
            <strong>Name:</strong> {order.shippingAddress.fullName} <br />
            <strong>Address:</strong> {order.shippingAddress.address},{" "}
            {order.shippingAddress.city}, {order.shippingAddress.postalCode},{" "}
            {order.shippingAddress.country}
            <div>
              {order.isDelivered ? (
                <div className="successBox">
                  Delivered At {order.deliveredAt}
                </div>
              ) : (
                <div className="dangerBox">Not Delivered</div>
              )}
            </div>
          </div>
          <div className="box">
            <h3>Payment</h3>
            <strong>Method: </strong> {order.paymentMethod}
            {order.isPaid ? (
              <div className="succesBox">
                Paid At {order.paidAt.substring(0, 10)}
              </div>
            ) : (
              <div className="dangerBox">Not Paid</div>
            )}
          </div>

          <div className="box">
            <h3>Items</h3>
            <div className="items-preview">
              {order.orderItems.map((x) => (
                <div className="preview-item" key={x._id}>
                  <div
                    style={{
                      width: 186,
                      gap: "1rem",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div className="thumbnail">
                      <img src={x.image} alt={x.slug} />
                    </div>
                    <Link to={`/product/${x.slug}`}>{x.slug}</Link>
                  </div>
                  <div className="quantity">{x.quantity}</div>
                  <div className="price">${x.price}</div>
                </div>
              ))}
            </div>
            <Link to="/cart">Edit</Link>
          </div>
        </div>
        <div className="order box">
          <h3>Order Summary</h3>
          <div className="prices">
            <div className="pricing">
              <p>Items</p>
              <p>${order.itemsPrice}</p>
            </div>
            <div className="line" />
            <div className="pricing">
              <p>Shipping</p>
              <p>${order.shippingPrice}</p>
            </div>
            <div className="line" />
            <div className="pricing">
              <p>Tax</p>
              <p>${order.taxPrice}</p>
            </div>
            <div className="line" />
            <div className="pricing dark">
              <p>Order Total</p>
              <p>${order.totalPrice}</p>
            </div>
          </div>
          {!order.isPaid && (
            <div className="payment-div">
              {isPending ? (
                <div className="loading-spinner"></div>
              ) : (
                <PayPalButtons
                  createOrder={createOrder}
                  onApprove={onApprove}
                  onError={onError}
                ></PayPalButtons>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderScreen;
