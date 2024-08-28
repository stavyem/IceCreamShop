const express = require("express");
const router = express.Router();
const persist = require("./persist");

router.get("/fun-facts", async (req, res) => {
  try {
    const funFacts = await persist.getFunFacts();
    res.json(funFacts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
});

router.get("/quiz", async (req, res) => {
  try {
    const quiz = await persist.getQuiz();
    res.json(quiz);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
});

router.get("/flavors/voting", async (req, res) => {
  try {
    const flavors = await persist.getFlavorsForVoting();
    res.json(flavors);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
});

router.post("/flavors/vote", async (req, res) => {
  const { flavorId, username } = req.body;

  try {
    if (!flavorId) {
      return res.status(400).json({ message: "No flavor ID provided" });
    }

    const flavor = await persist.incrementFlavorVote(flavorId, username);

    if (!flavor) {
      return res.status(404).json({ message: "Flavor not found" });
    }

    res.status(200).json({ message: "Vote recorded", flavor });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
});

router.post("/flavors/suggest", async (req, res) => {
  const { flavor, username } = req.body;

  try {
    if (!flavor || flavor.trim() === "") {
      return res.status(400).json({ message: "Flavor name is required" });
    }

    const existingFlavor = await persist.getFlavorByName(flavor);
    if (existingFlavor) {
      return res.status(409).json({ message: "Flavor already exists" });
    }

    const newFlavor = await persist.addFlavorSuggestion(flavor, username);
    res
      .status(201)
      .json({ message: "Flavor suggestion submitted", flavor: newFlavor });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
});

module.exports = router;
