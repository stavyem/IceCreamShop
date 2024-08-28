const express = require("express");
const router = express.Router();
const persist = require("./persist");

router.get("/:username", async (req, res) => {
  const { username } = req.params;
  
  try {
    userCart = await persist.getUserCart(username);
    res.json(userCart)
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
});

router.post("/add", async (req, res) => {
  const { productIds, username } = req.body;
  
  try {
    if (!username) {
      return res.status(400).json({ message: 'No user is logged in.' });
    }
    await persist.saveAddToCart({ username, productIds });
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
});

router.delete("/remove", async (req, res) => {
  const { username, items } = req.body;
  
  try {
    await persist.deleteFromCart({ username, items });
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
});

module.exports = router;
