import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Product from "./components/Product";
import ProductCard from "./components/ProductCard";
import ProductInsertion from "./components/ProductInsertion";

function App() {
  return (
    <>
      <ProductInsertion></ProductInsertion>
    </>
  );
}

export default App;
