import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import axios from "axios";
import "./styles/guess-the-flavor.css";

const GuessTheFlavor = () => {
  const [flavorImage, setFlavorImage] = useState("");
  const [correctFlavor, setCorrectFlavor] = useState("");
  const [userGuess, setUserGuess] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const fetchRandomFlavor = async () => {
    try {
      const response = await axios.get("http://localhost:8000/store/products");
      const flavors = response.data;
      const randomFlavor = flavors[Math.floor(Math.random() * flavors.length)];
      setFlavorImage(randomFlavor.imageUrl);
      setCorrectFlavor(randomFlavor.title);
      setUserGuess("");
      setFeedbackMessage("");
    } catch (error) {
      console.error("Error fetching flavors:", error);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      fetchRandomFlavor();
    }
  }, [isLoggedIn, navigate]);

  const handleGuessSubmit = (e) => {
    e.preventDefault();
    if (userGuess.trim().toLowerCase() === correctFlavor.toLowerCase()) {
      setFeedbackMessage("Correct! You guessed the flavor!");
    } else {
      setFeedbackMessage(`Incorrect! The flavor was ${correctFlavor}.`);
    }

    setTimeout(() => {
      fetchRandomFlavor();
    }, 2000);
  };

  return (
    <div className="guess-the-flavor-container">
      <h1>Guess the Ice Cream Flavor</h1>
      <div className="ice-cream-image-container">
        <img
          src={flavorImage}
          alt="Guess the ice cream flavor"
          className="ice-cream-image"
        />
      </div>
      <form onSubmit={handleGuessSubmit} className="guess-form">
        <input
          type="text"
          value={userGuess}
          placeholder="Enter your guess"
          onChange={(e) => setUserGuess(e.target.value)}
          required
        />
        <div className="submit-instruction">Press enter to submit</div>
      </form>
      {feedbackMessage && <p className="feedback-message">{feedbackMessage}</p>}
    </div>
  );
};

export default GuessTheFlavor;
