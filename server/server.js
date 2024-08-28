const express = require("express");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./authRoutes");
const storeRoutes = require("./storeRoutes");
const cartRoutes = require("./cartRoutes");
const adminRoutes = require("./adminRoutes");
const additionalRoutes = require("./additionalRoutes");
const persist = require('./persist');
const cors = require('cors');


const app = express();
const PORT = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

async function startServer() {
  try {
    await persist.initializeAdminUser();
    app.use("/auth", authRoutes);
    app.use("/store", storeRoutes);
    app.use("/cart", cartRoutes);
    app.use("/admin", adminRoutes);
    app.use("/", additionalRoutes);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error initializing server:", error);
    process.exit(1);
  }
}

startServer();