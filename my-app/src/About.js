import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import axios from "axios";
import "./styles/about.css";

const About = () => {
  const [products, setProducts] = useState([]);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      fetchProducts();
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (products.length > 0) {
      const interval = setInterval(() => {
        setCurrentProductIndex(
          (prevIndex) => (prevIndex + 1) % products.length
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [products]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8000/store/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  return (
    <section>
      <h1>About Frosty Delights</h1>
      <h2>Our Story</h2>
      <p>
        Welcome to Frosty Delights, where we've been serving up smiles and
        scoops since 2010. Our passion for creating the perfect ice cream began
        in a small kitchen and has grown into the beloved store you see today.
      </p>
      <p>
        At Frosty Delights, we believe that ice cream is more than just a treat
        - it's an experience. That's why we use only the finest, locally-sourced
        ingredients to craft our unique flavors. From classic vanilla to daring
        flavors like tomato sorbet, we have something to please every taste.
        Come join us for a scoop of happiness!
      </p>
      <h2>Our Flavors</h2>
      {products.length > 0 && (
        <div className="featured-flavor-container">
          <h3>{products[currentProductIndex].title}</h3>
          <img
            src={products[currentProductIndex].imageUrl}
            alt={products[currentProductIndex].title}
            className="featured-flavor-image"
          />
        </div>
      )}
    </section>
  );
};

export default About;
