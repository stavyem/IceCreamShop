const express = require('express');
const router = express.Router();
const persist = require('./persist');

router.post('/register', async (req, res) => {
  try {
    console.log(req.body)
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    const userData = { username, password };
    await persist.saveUser(userData);
    
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    if (error.message.includes('already exists')) {
      return res.status(409).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    const user = await persist.getUser(username);
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const loginData = {
      username,
      datetime: new Date().toISOString()
    };
    await persist.saveLogin(loginData);

    res.status(200).json({ message: 'Login successful.' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
});


router.post('/logout', async (req, res) => {
  try {
    const { user } = req.body;
    if (!user) {
      return res.status(400).json({ message: 'No user is logged in.' });
    }

    const logoutData = {
      username: user,
      datetime: new Date().toISOString()
    };
    await persist.saveLogout(logoutData);

    res.status(200).json({ message: 'Logout successful.' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
});


module.exports = router;
