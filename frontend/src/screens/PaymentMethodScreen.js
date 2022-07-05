import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import CheckOutSteps from "../components/CheckOutSteps";
import { Store } from "../Store";
function PaymentMethodScreen() {
  const navigate = useNavigate();
  const { state, dispatch: contextDispatch } = useContext(Store);
  const {
    cart: { shippingAddress, paymentMethod },
  } = state;
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);

  const [paymentMethodName, setPaymentMethodName] = useState(
    paymentMethod || "PayPal"
  );

  const submitHandler = (e) => {
    e.preventDefault();
    contextDispatch({
      type: "SAVE_PAYMENT_METHOD",
      payload: paymentMethodName,
    });
    localStorage.setItem("paymentMethod", paymentMethodName);
    navigate("/placeorder");
  };
  return (
    <div className="container">
      <Helmet>
        <title>Payment Method</title>
      </Helmet>
      <CheckOutSteps step1 step2 step3 />
      <div className="container form-container">
        <h1>Payment Method</h1>
        <form onSubmit={submitHandler}>
          <div className="inline">
            <input
              type="radio"
              id="PayPal"
              value="PayPal"
              name="paymentMethod"
              checked={paymentMethodName === "PayPal"}
              onChange={(e) => setPaymentMethodName("PayPal")}
            />
            <label htmlFor="PayPal">PayPal</label>
          </div>
          <div className="inline">
            <input
              type="radio"
              id="Stripe"
              value="Stripe"
              name="paymentMethod"
              checked={paymentMethodName === "Stripe"}
              onChange={(e) => setPaymentMethodName("Stripe")}
            />
            <label htmlFor="Stripe">Stripe</label>
          </div>
          <button type="submit">Continue</button>
        </form>
      </div>
    </div>
  );
}

export default PaymentMethodScreen;
