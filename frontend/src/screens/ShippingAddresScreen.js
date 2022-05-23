import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Store } from "../Store";
import { useNavigate } from "react-router-dom";
import CheckOutSteps from "../components/CheckOutSteps";
function ShippingAddresScreen() {
  const { state, dispatch: contextDispatch } = useContext(Store);

  const {
    userInfo,
    cart: { shippingAdress },
  } = state;
  const [fullName, setFullName] = useState(shippingAdress.fullName || "");
  const [address, setAddress] = useState(shippingAdress.address || "");
  const [city, setCity] = useState(shippingAdress.city || "");
  const [postalCode, setPostalCode] = useState(shippingAdress.postalCode || "");
  const [country, setCountry] = useState(shippingAdress.country || "");

  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    contextDispatch({
      type: "SAVE_SHIPPING_ADRESS",
      payload: {
        fullName,
        address,
        city,
        postalCode,
        country,
      },
    });
    localStorage.setItem(
      "shippingAdress",
      JSON.stringify({ fullName, address, city, postalCode, country })
    );
    navigate("/payment");
  };
  useEffect(() => {
    if (!userInfo) {
      navigate("/signin?redirect=/shipping");
    }
  }, [userInfo, navigate]);

  return (
    <div className="container">
      <Helmet>
        <title>Shipping Address</title>
      </Helmet>
      <CheckOutSteps step1 step2 />
      <div className="container form-container">
        <h1>Shipping Address</h1>
        <form onSubmit={submitHandler}>
          <label htmlFor="full-name">Full Name</label>
          <input
            type="text"
            id="full-name"
            name="full-name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            name="city"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <label htmlFor="postal-code">Postal Code</label>
          <input
            type="text"
            id="postal-code"
            name="postal-code"
            required
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />
          <label htmlFor="country">Country</label>
          <input
            type="text"
            id="country"
            name="country"
            required
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
          <button type="submit">Continue</button>
        </form>
      </div>
    </div>
  );
}

export default ShippingAddresScreen;
