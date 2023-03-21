import CheckOutSteps from '../components/CheckOutSteps'
import { Helmet } from 'react-helmet-async'
import { useContext, useEffect, useReducer } from 'react'
import { Store } from '../Store'
import { Link, useNavigate } from 'react-router-dom'
import { getError } from '../functions'
import { toast } from 'react-toastify'
import Axios from 'axios'

const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loading: true }
    case 'CREATE_SUCCESS':
      return { ...state, loading: false }
    case 'CREATE_FAIL':
      return { ...state, loading: false }
    default:
      return state
  }
}

function PreviewOrderScreen() {
  const [{ loading, error }, dispatch] = useReducer(reducer, {
    loading: false,
    error: '',
  })
  const { state, dispatch: contextDispatch } = useContext(Store)
  const { cart, userInfo } = state
  const navigate = useNavigate()
  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate('/payment')
    }
  }, [navigate, cart.paymentMethod])

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100
  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0),
  )

  cart.shippingPrice = cart.itemsPrice > 100 ? 0 : 10
  cart.taxPrice = round2(0.12 * cart.itemsPrice)
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice

  const placeOrderHandler = async () => {
    try {
      dispatch({ type: 'CREATE_REQUEST' })
      const { data } = await Axios.post(
        '/api/orders',
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        },
      )
      contextDispatch({ type: 'CART_CLEAR' })
      dispatch({ type: 'CREATE_SUCCESS' })
      localStorage.removeItem('cartItems')
      navigate(`/order/${data.order._id}`)
    } catch (error) {
      dispatch({ type: 'CREATE_FAIL' })
      toast.error(getError(error))
    }
  }
  return loading ? (
    <div className="loading-spinner" />
  ) : error ? (
    <div className="error">{error}</div>
  ) : (
    <div className="container">
      <CheckOutSteps step1 step2 step3 step4 />
      <Helmet>
        <title>Preview Order</title>
      </Helmet>
      <div>
        <h1>Preview Order</h1>
        <div className="info-checkout">
          <div className="info">
            <div className="box">
              <h3>Shipping</h3>
              <div className="shippingInfo">
                <div className="inline">
                  <strong>Name: </strong>
                  <p>{cart.shippingAddress.fullName}</p>
                </div>
                <div className="inline">
                  <strong>Address: </strong>
                  <p>{cart.shippingAddress.address}</p>
                </div>
              </div>
              <Link to="/shipping">Edit</Link>
            </div>

            <div className="box">
              <h3>Payment</h3>
              <div className="shippingInfo">
                <div className="inline">
                  <strong>Method:</strong> {cart.paymentMethod}
                </div>
              </div>
              <Link to="/payment">Edit</Link>
            </div>

            <div className="box">
              <h3>Items</h3>
              <div className="items-preview">
                {cart.cartItems.map((x) => (
                  <div className="preview-item" key={x._id}>
                    <div
                      style={{
                        width: 186,
                        gap: '1rem',
                        display: 'flex',
                        alignItems: 'center',
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
                <p>${cart.itemsPrice}</p>
              </div>
              <div className="line" />
              <div className="pricing">
                <p>Shipping</p>
                <p>${cart.shippingPrice}</p>
              </div>
              <div className="line" />
              <div className="pricing">
                <p>Tax</p>
                <p>${cart.taxPrice}</p>
              </div>
              <div className="line" />
              <div className="pricing dark">
                <p>Total</p>
                <p>${cart.totalPrice}</p>
              </div>
              <div className="line" />
            </div>
            <button onClick={placeOrderHandler}>Place Order</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PreviewOrderScreen
