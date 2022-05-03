import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
function App() {
  return (
    <BrowserRouter>
      <div className="site-container">
        <div>
          <header>
            <div className="container">
              <Link to="/">G-express</Link>
            </div>
          </header>
          <main>
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/product/:slug" element={<ProductScreen />} />
            </Routes>
          </main>
        </div>
        <footer>
          <p>footer</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
