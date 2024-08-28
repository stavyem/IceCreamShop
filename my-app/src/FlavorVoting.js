import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import axios from "axios";
import "./styles/flavor-voting.css";

const FlavorVoting = () => {
  const [flavors, setFlavors] = useState([]);
  const [newFlavor, setNewFlavor] = useState("");
  const [votedFlavors, setVotedFlavors] = useState([]);
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
    fetchFlavors();
  }, [isLoggedIn, navigate, setFlavors, setVotedFlavors, setNewFlavor]);

  const fetchFlavors = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/flavors/voting",
        {}
      );

      const sortedFlavors = response.data.sort(
        (a, b) => b.votes.length - a.votes.length
      );
      setFlavors(sortedFlavors);
      const votedFlavors = sortedFlavors
        .filter((flavor) => flavor.votes.includes(user))
        .map((flavor) => flavor.id);
      setVotedFlavors(votedFlavors);
    } catch (error) {
      console.error("Error fetching flavors:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/flavors/suggest", {
        flavor: newFlavor,
        username: user,
      });
      fetchFlavors();
      setNewFlavor("");
    } catch (error) {
      console.error("Error submitting flavor suggestion:", error);
    }
  };

  const handleVote = async (flavorId) => {
    if (votedFlavors.includes(flavorId)) {
      return;
    }
    try {
      await axios.post(`http://localhost:8000/flavors/vote`, {
        flavorId,
        username: user,
      });
      setVotedFlavors([...votedFlavors, flavorId]);
      fetchFlavors();
    } catch (error) {
      console.error("Error voting for flavor:", error);
    }
  };

  return (
    <div>
      <h1>Suggest and Vote for New Flavors</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newFlavor}
          placeholder="Suggest a new flavor"
          onChange={(e) => setNewFlavor(e.target.value)}
          required
        />
        <button type="submit">Submit Flavor</button>
      </form>
      <h2>Vote for Your Favorite Flavor</h2>
      <ul>
        {flavors.map((flavor) => (
          <li key={flavor.id}>
            {flavor.name} - {flavor.votes.length} votes
            <button
              onClick={() => handleVote(flavor.id)}
              disabled={votedFlavors.includes(flavor.id)}
            >
              {votedFlavors.includes(flavor.id) ? "Voted" : "Vote"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FlavorVoting;
