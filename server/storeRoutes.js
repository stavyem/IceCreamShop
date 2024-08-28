const express = require('express');
const router = express.Router();
const persist = require('./persist');

router.get('/products', async (req, res) => {
  try {
    const products = await persist.getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
});

router.post('/checkout', async (req, res) => {
  const { username, items } = req.body;

  try {
    if (!username || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Invalid request data. Please provide a username and a list of product IDs.' });
    }

    const purchaseData = {
      username,
      products: items
    };

    await persist.savePurchase(purchaseData);
    await persist.deleteFromCart({ username, items });
    res.status(200).json({ message: 'Purchase successful.'});
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
});

module.exports = router;
