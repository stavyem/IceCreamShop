const express = require('express');
const router = express.Router();
const persist = require('./persist');

router.get('/activity', async (req, res) => {
  try {
    const logins = await persist.getLogins();
    const logouts = await persist.getLogouts();
    const addToCarts = await persist.getAddToCarts();
    
    const loginActivities = logins.map(activity => ({ ...activity, type: 'login' }));
    const logoutActivities = logouts.map(activity => ({ ...activity, type: 'logout' }));
    const addToCartActivities = addToCarts.map(activity => ({ ...activity, type: 'add-to-cart' }));

    const combinedActivities = [...loginActivities, ...logoutActivities, ...addToCartActivities];
    combinedActivities.sort((a, b) => new Date(b.datetime) - new Date(a.datetime));
    
    res.json(combinedActivities);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
});

router.get('/activity/filter', async (req, res) => {
  const { username, type } = req.query;
  
  try {
    let activities = await persist.getLogins();
    let logouts = await persist.getLogouts();
    let addToCarts = await persist.getAddToCarts();

    let combinedActivities = [...activities, ...logouts, ...addToCarts];
    
    if (username) {
      combinedActivities = combinedActivities.filter(activity => activity.username === username);
    }

    if (type) {
      combinedActivities = combinedActivities.filter(activity => activity.type === type);
    }

    res.json(combinedActivities);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
});

router.post('/products/add', async (req, res) => {
  try {
    const productData = req.body;
    await persist.saveProduct(productData);
    res.status(201).json({ message: 'Product added successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
});

router.delete('/products/remove', async (req, res) => {
  try {
    const { productId } = req.body;
    await persist.removeProduct(productId);
    res.status(200).json({ message: 'Product removed successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
});

module.exports = router;
