import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { Link } from "react-router-dom";
import "./styles/thank-you.css";

const ThankYou = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  return (
    <div>
      <header>
        <h1>Thank You for Your Order!</h1>
      </header>
      <main>
        <Link to="/" className="button">
          Continue Shopping
        </Link>
        <br />
        <img
          src="https://m.media-amazon.com/images/S/mms-media-storage-prod/final/BrandPosts/brandPosts/62214eb9-5156-4b7a-b6b3-6e135b9eb066/524cd52a-4d07-46e2-8fb6-91a613ebb944/media._SL480_.jpeg"
          alt="Thank you"
          className="thank-you-image"
        />
      </main>
    </div>
  );
};

export default ThankYou;
