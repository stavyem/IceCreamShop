const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const DATA_DIR = path.join(__dirname, "..", "data");

async function readJsonFile(filePath) {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    if (err.code === "ENOENT") {
      return [];
    } else {
      throw err;
    }
  }
}

async function writeJsonFile(filePath, data) {
  const jsonString = JSON.stringify(data, null, 2);
  await fs.writeFile(filePath, jsonString);
}

async function saveUser(userData) {
  const usersFilePath = path.join(DATA_DIR, "users.json");
  const users = await readJsonFile(usersFilePath);

  const existingUser = users.find(
    (user) => user.username === userData.username
  );
  if (existingUser) {
    throw new Error(
      `User with username "${userData.username}" already exists.`
    );
  }

  users.push(userData);
  await writeJsonFile(usersFilePath, users);
}

async function getUser(username) {
  const usersFilePath = path.join(DATA_DIR, "users.json");
  const users = await readJsonFile(usersFilePath);
  return users.find((user) => user.username === username);
}

async function initializeAdminUser() {
  const adminUser = {
    username: "admin",
    password: "admin",
  };

  try {
    const existingAdmin = await getUser(adminUser.username);
    if (!existingAdmin) {
      await saveUser(adminUser);
      console.log("Admin user created.");
    } else {
      console.log("Admin user already exists.");
    }
  } catch (error) {
    console.error("Error initializing admin user:", error.message);
  }
}

async function saveProduct(productData) {
  const productsFilePath = path.join(DATA_DIR, "products.json");
  const products = await readJsonFile(productsFilePath);
  const productWithId = { ...productData, id: uuidv4() };
  products.push(productWithId);

  await writeJsonFile(productsFilePath, products);
}

async function removeProduct(productId) {
  const productsFilePath = path.join(DATA_DIR, "products.json");
  const products = await readJsonFile(productsFilePath);

  const updatedProducts = products.filter(
    (product) => product.id !== productId
  );

  if (updatedProducts.length === products.length) {
    throw new Error(`Product with ID "${productId}" not found.`);
  }

  await writeJsonFile(productsFilePath, updatedProducts);
}

async function getProducts() {
  const productsFilePath = path.join(DATA_DIR, "products.json");
  return await readJsonFile(productsFilePath);
}

async function saveAddToCart(cartData) {
  const cartsFilePath = path.join(DATA_DIR, "carts.json");
  const cartActivitiesFilePath = path.join(DATA_DIR, "cartActivities.json");
  let carts = await readJsonFile(cartsFilePath);
  let userCart = carts.find((cart) => cart.username === cartData.username);

  if (!userCart) {
    userCart = { username: cartData.username, items: [] };
    carts.push(userCart);
  }

  userCart.items = [...new Set([...userCart.items, ...cartData.productIds])];
  await writeJsonFile(cartsFilePath, carts);

  let cartActivities = await readJsonFile(cartActivitiesFilePath);
  cartActivities.push({
    username: cartData.username,
    datetime: new Date().toISOString(),
  });
  await writeJsonFile(cartActivitiesFilePath, cartActivities);
}

async function deleteFromCart(cartData) {
  const cartsFilePath = path.join(DATA_DIR, "carts.json");

  let carts = await readJsonFile(cartsFilePath);
  let userCart = carts.find((cart) => cart.username === cartData.username);

  if (!userCart) {
    userCart = { username: cartData.username, items: [] };
    carts.push(userCart);
  }

  userCart.items = userCart.items.filter((id) => !cartData.items.includes(id));
  await writeJsonFile(cartsFilePath, carts);
}

async function getAddToCarts() {
  const cartActivitiesFilePath = path.join(DATA_DIR, "cartActivities.json");
  return await readJsonFile(cartActivitiesFilePath);
}

async function getUserCart(username) {
  const cartsFilePath = path.join(DATA_DIR, "carts.json");
  const carts = await readJsonFile(cartsFilePath);
  const userCart = carts.find((cart) => cart.username === username);
  return userCart ? userCart.items : [];
}

async function savePurchase(purchaseData) {
  const purchasesFilePath = path.join(DATA_DIR, "purchases.json");
  let purchases = await readJsonFile(purchasesFilePath);
  purchases.push({ ...purchaseData, datetime: new Date().toISOString() });
  await writeJsonFile(purchasesFilePath, purchases);
}

async function saveLogin(loginData) {
  const loginsFilePath = path.join(DATA_DIR, "logins.json");
  const logins = await readJsonFile(loginsFilePath);
  logins.push(loginData);
  await writeJsonFile(loginsFilePath, logins);
}

async function getLogins() {
  const loginsFilePath = path.join(DATA_DIR, "logins.json");
  return await readJsonFile(loginsFilePath);
}

async function saveLogout(logoutData) {
  const logoutsFilePath = path.join(DATA_DIR, "logouts.json");
  const logouts = await readJsonFile(logoutsFilePath);
  logouts.push(logoutData);
  await writeJsonFile(logoutsFilePath, logouts);
}

async function getLogouts() {
  const logoutsFilePath = path.join(DATA_DIR, "logouts.json");
  return await readJsonFile(logoutsFilePath);
}

async function getFunFacts() {
  const productsFilePath = path.join(DATA_DIR, "funFacts.json");
  return await readJsonFile(productsFilePath);
}

async function getQuiz() {
  const productsFilePath = path.join(DATA_DIR, "quiz.json");
  return await readJsonFile(productsFilePath);
}

async function getFlavorsForVoting() {
  const flavorsFilePath = path.join(DATA_DIR, "flavors.json");
  return await readJsonFile(flavorsFilePath);
}

async function getFlavorByName(name) {
  const flavors = await getFlavorsForVoting();
  return flavors.find(
    (flavor) => flavor.name.toLowerCase() === name.toLowerCase()
  );
}

async function addFlavorSuggestion(name, username) {
  const flavorsFilePath = path.join(DATA_DIR, "flavors.json");
  const flavors = await getFlavorsForVoting();
  const newFlavor = { id: uuidv4(), name, votes: [username] };
  flavors.push(newFlavor);
  await writeJsonFile(flavorsFilePath, flavors);
  return newFlavor;
}

async function incrementFlavorVote(flavorId, username) {
  const flavorsFilePath = path.join(DATA_DIR, "flavors.json");
  const flavors = await readJsonFile(flavorsFilePath);

  const flavor = flavors.find((f) => f.id === flavorId);

  if (!flavor) {
    return null;
  }

  flavor.votes = [...flavor.votes, username];

  await writeJsonFile(flavorsFilePath, flavors);

  return flavor;
}

module.exports = {
  saveUser,
  getUser,
  initializeAdminUser,
  saveProduct,
  removeProduct,
  getProducts,
  saveAddToCart,
  deleteFromCart,
  getAddToCarts,
  getUserCart,
  savePurchase,
  saveLogin,
  getLogins,
  saveLogout,
  getLogouts,
  getFunFacts,
  getQuiz,
  getFlavorsForVoting,
  getFlavorByName,
  addFlavorSuggestion,
  incrementFlavorVote,
};
