import { createContext, useReducer } from "react";
export const Store = createContext();

const initialState = {
  cart: {
    shippingAdress: localStorage.getItem("shippingAdress")
      ? JSON.parse(localStorage.getItem("shippingAdress"))
      : {},
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
  },
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find((x) => x._id === newItem._id);
      const cartItems = existItem
        ? state.cart.cartItems.map((x) =>
            x._id === existItem._id ? newItem : x
          )
        : [...state.cart.cartItems, newItem];
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    case "CART_DELETE_ITEM": {
      const itemToDelete = action.payload;
      const cartItems = state.cart.cartItems.filter(
        (x) => x._id != itemToDelete._id
      );
      localStorage.setItem("cartItems", JSON.stringify(cartItems));

      return {
        ...state,
        cart: { ...state.cart, cartItems },
      };
    }
    case "USER_SIGNIN":
      return { ...state, userInfo: action.payload };
    case "USER_SIGNOUT":
      return {
        ...state,
        userInfo: null,
        cart: {
          cartItems: [],
          shippingAdress: {},
        },
      };
    case "SAVE_SHIPPING_ADRESS":
      return {
        ...state,
        cart: { ...state.cart, shippingAdress: action.payload },
      };
    default:
      return state;
  }
};
export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
