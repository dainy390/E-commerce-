import Nav from "./Component/Nav";
import ProductDetail from "./Component/ProductDetail";
import AddProduct from "./Component/AddProduct";
import CartItems from "./Component/CartItems";
import ProductItemList from "./Component/ProductItemList";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addproducts } from "./actions/index";
import customFetch from "./apiCall";
import { useEffect, useCallback } from "react";

function App() {
  const productDetailItem = useSelector((state) => state.itemToDisplay);
  const dispatch = useDispatch();

  const url = "https://my-json-server.typicode.com/jaiswalaryan/data/db";

  // Use useCallback to stabilize the fetchData function
  const fetchData = useCallback(async () => {
    try {
      const response = await customFetch(url, { method: "GET" });
      const modifiedData = response.products.map((item) => {
        item.edit = true;
        return item;
      });

      window.localStorage.setItem("products", JSON.stringify(modifiedData));
      const products = JSON.parse(window.localStorage.getItem("products"));
      dispatch(addproducts(products));
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  }, [url, dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="App">
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/" element={<ProductItemList />} />
          <Route path="/addproducts" element={<AddProduct />} />
          <Route
            path={`/productdetails/${productDetailItem.id}`}
            element={<ProductDetail item={productDetailItem} />}
          />
          <Route path="/cart" element={<CartItems />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
