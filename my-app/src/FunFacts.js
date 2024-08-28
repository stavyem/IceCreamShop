import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import axios from "axios";
import "./styles/fun-facts.css";

const FunFacts = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [selectedFact, setSelectedFact] = useState("");
  const [allFacts, setAllFacts] = useState("");

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
    const fetchFunFacts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/fun-facts", {});
        setAllFacts(response.data.map(factObj => factObj.fact));
      } catch (error) {
        console.error("Error fetching fun facts:", error);
      }
    };

    fetchFunFacts();
  }, [isLoggedIn, navigate]);


  const showRandomFact = () => {
    const randomFact = allFacts[Math.floor(Math.random() * allFacts.length)];
    setSelectedFact(randomFact);
  };

  return (
    <div>
      <h1>Ice Cream Fun Facts</h1>
      <main>
        <button id="factButton" onClick={showRandomFact}>
          Show Me a Fun Fact!
        </button>
        <p id="factDisplay">{selectedFact}</p>
      </main>
    </div>
  );
};

export default FunFacts;