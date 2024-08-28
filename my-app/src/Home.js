import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./styles/home.css";

const Home = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  window.onload = function() {
    const middlePosition = document.body.scrollHeight / 2;
    window.scrollTo({
        top: middlePosition,
        behavior: "smooth"
    });
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);
  return (
    <div>
      <h1>Welcome to Our Store!</h1>
      <main>
        <p>Here you can enjoy fun Ice Cream facts, doing our Ice Cream quiz, 
           vote for your favorite Ice Cream flavor... or just buy your favorite Ice Cream!</p>
      </main>
    </div>
  );
};

export default Home;