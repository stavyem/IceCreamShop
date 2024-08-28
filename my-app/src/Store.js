import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./AuthContext";
import "./styles/store.css";

const Store = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/store/products",
          {}
        );
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [isLoggedIn, user]);

  useEffect(() => {
    setFilteredProducts(
      products.filter(
        (product) =>
          product.title.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().startsWith(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, products]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddToCart = async (product) => {
    if (isLoggedIn) {
      try {
        await axios.post("http://localhost:8000/cart/add", {
          productIds: [product.id],
          username: user,
        });
        setCartItems((prevCartItems) => [...prevCartItems, product.id]);
      } catch (error) {
        console.error("Error updating cart:", error);
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <div>
      <header>
        <h1>Store</h1>
      </header>
      <main>
        <input
          type="text"
          id="searchInput"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <div id="productList">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => {
              const isInCart = cartItems.includes(product.id);
              return (
                <div key={product.id} className="product">
                  <h2>{product.title}</h2>
                  <p>{product.description}</p>
                  <p>{product.price}</p>
                  {product.imageUrl && (
                    <img src={product.imageUrl} alt={product.title} />
                  )}
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={isInCart}
                  >
                    {isInCart ? "Already in Cart" : "Add to Cart"}
                  </button>
                </div>
              );
            })
          ) : (
            <p>No products available</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Store;
