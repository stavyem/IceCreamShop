const fetch = require("node-fetch");
const assert = require("assert");

const testUser = {
  username: "testuser",
  password: "testpassword",
};

async function testRegister() {
  const response = await fetch("http://localhost:8000/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(testUser),
  });
  const data = await response.json();

  assert.strictEqual(
    response.status,
    201,
    "User should be successfully registered"
  );
  assert.strictEqual(
    data.message,
    "User registered successfully.",
    "Registration message should be correct"
  );
}

async function testLogin() {
  const response = await fetch("http://localhost:8000/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(testUser),
  });
  const data = await response.json();

  assert.strictEqual(
    response.status,
    200,
    "User should be successfully logged in"
  );
  assert.strictEqual(
    data.message,
    "Login successful.",
    "Login message should be correct"
  );
}

async function testLogout() {
  const response = await fetch("http://localhost:8000/auth/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user: testUser.username }),
  });
  const data = await response.json();

  assert.strictEqual(
    response.status,
    200,
    "User should be successfully logged out"
  );
  assert.strictEqual(
    data.message,
    "Logout successful.",
    "Logout message should be correct"
  );
}

async function testGetProducts() {
  const response = await fetch("http://localhost:8000/store/products");
  const data = await response.json();

  assert.strictEqual(
    response.status,
    200,
    "Products should be fetched successfully"
  );
  assert(Array.isArray(data), "Products data should be an array");
}

async function testAddToCart() {
  const response = await fetch("http://localhost:8000/cart/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: testUser.username, productIds: [1, 2] }),
  });

  assert.strictEqual(
    response.status,
    200,
    "Products should be added to cart successfully"
  );
}

async function testCheckout() {
  const response = await fetch("http://localhost:8000/store/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: testUser.username, items: [1, 2] }),
  });
  const data = await response.json();

  assert.strictEqual(response.status, 200, "Checkout should be successful");
  assert.strictEqual(
    data.message,
    "Purchase successful.",
    "Checkout message should be correct"
  );
}

async function testAddProduct() {
  const response = await fetch("http://localhost:8000/admin/products/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "New Product",
      price: 10,
      imageUrl: "image.jpg",
    }),
  });
  const data = await response.json();

  assert.strictEqual(
    response.status,
    201,
    "Product should be added successfully"
  );
  assert.strictEqual(
    data.message,
    "Product added successfully.",
    "Add product message should be correct"
  );
}

async function runTests() {
  const testResults = [];

  async function runTest(testFn, testName) {
    try {
      await testFn();
      testResults.push({ testName, status: "passed" });
    } catch (error) {
      testResults.push({ testName, status: "failed", error: error.message });
    }
  }

  await runTest(testRegister, "Register Test");
  await runTest(testLogin, "Login Test");
  await runTest(testGetProducts, "Get Products Test");
  await runTest(testAddToCart, "Add to Cart Test");
  await runTest(testCheckout, "Checkout Test");
  await runTest(testAddProduct, "Add Product Test");
  await runTest(testLogout, "Logout Test");

  console.log("--- Test Results ---");
  testResults.forEach((result) => {
    console.log(`${result.testName}: ${result.status}`);
    if (result.status === "failed") {
      console.log(`  Error: ${result.error}`);
    }
  });
}

runTests();
