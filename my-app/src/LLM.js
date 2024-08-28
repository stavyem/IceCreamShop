import React from "react";
import "./styles/llm.css";

const LLM = () => {
  const content = [
    {
      codeSnippet: `
const getCookie = (name) => {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    if (match) return match[2];
    return null;
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
      `
    },
    {
      codeSnippet: `
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);
      `
    },
    {
      codeSnippet: `
  const fetchCartItems = async () => {
    try {
      const cartResponse = await axios.get(\`http://localhost:8000/cart/\${user}\`);
      const productIds = cartResponse.data;
      const productsResponse = await axios.get("http://localhost:8000/store/products");
      const allProducts = productsResponse.data;
      const cartProducts = allProducts.filter(product => productIds.includes(product.id));
      setCartItems(cartProducts);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

      `
    },
    {
      codeSnippet: `
  const handleCheckout = () => {
    const itemsToCheckout = cartItems.filter(item => selectedItems.includes(item.id));
    navigate("/checkout", { state: { itemsToCheckout } });
  };

      `
    },

    {
      codeSnippet: `
<div>
<h2>Your Selected Items</h2>
{selectedItems.length > 0 ? (
  <>
    <ul>
      {itemsToCheckout.map((item) => (
        <li key={item.id}>
          <input
            type="checkbox"
            checked={selectedItems.some((selectedItem) => selectedItem.id === item.id)}
            onChange={() => handleItemChange(item)}
          />
          {item.title} - {item.price}
        </li>
      ))}
    </ul>
    <h3>Total: \${total.toFixed(2)}</h3>

    <form id="checkoutForm" onSubmit={handleSubmit}>
      <h2>Shipping Information</h2>
      <input
        type="text"
        id="name"
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
        required
        pattern="[A-Za-z]+(\s[A-Za-z]+)+"
        title="Please enter a valid name"
      />
      <input
        type="text"
        id="address"
        name="address"
        placeholder="Address"
        value={formData.address}
        onChange={handleChange}
        required
        pattern="[A-Za-z]+( [A-Za-z]+)* \d+"
        title="Please enter a valid address"
      />
      <input
        type="text"
        id="city"
        name="city"
        placeholder="City"
        value={formData.city}
        onChange={handleChange}
        required
        pattern="[A-Za-z]+( [A-Za-z]+)*"
        title="Please enter a valid city name"
      />
      <input
        type="text"
        id="zipcode"
        name="zipcode"
        placeholder="Zip Code"
        value={formData.zipcode}
        onChange={handleChange}
        required
        pattern="\d{5}"
        maxLength="5"
        title="Zip code must be 5 digits"
      />

      <h2>Payment Information</h2>
      <input
        type="text"
        id="cardNumber"
        name="cardNumber"
        placeholder="Card Number"
        value={formData.cardNumber}
        onChange={handleChange}
        required
        pattern="\d{8,19}"
        maxLength="19"
        title="Card number must be between 8 to 19 digits"
      />
      <input
        type="text"
        id="expDate"
        name="expDate"
        placeholder="MM/YY"
        value={formData.expDate}
        onChange={handleChange}
        required
        pattern="(0[1-9]|1[0-2])\/(2[4-9]|[3-9][0-9])"
        maxLength="5"
        title="Expiration date must be in MM/YY format"
      />
      <input
        type="text"
        id="cvv"
        name="cvv"
        placeholder="CVV"
        value={formData.cvv}
        onChange={handleChange}
        required
        pattern="\d{3,4}"
        maxLength="4"
        title="CVV must be 3 or 4 digits"
      />

      <button type="submit">Place Order</button>
    </form>
  </>
) : (
  <p>Your cart is empty. Please add items before checking out.</p>
)}
</div>
      `
    },

    {
      title: "Quiz Page",
      description: "Users can play a quiz to test their knowledge about ice cream flavors.",
      codeSnippet: `
const setLoginCookie = (remember) => {
    const now = new Date();
    const expirationTime = remember
      ? now.setDate(now.getDate() + 10)
      : now.setMinutes(now.getMinutes() + 30);

    document.cookie = \`username=\${formData.username}; expires=\${new Date(
      expirationTime
    ).toUTCString()}; path=/\`;
  };
      `
    },
    {
      codeSnippet:`  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/store/products", {});
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchCartItems = async () => {
      try {
        const response = await axios.get("http://localhost:8000/cart/get", {});
        setCartItems(response.data);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchProducts();
    fetchCartItems();
  }, []);

  useEffect(() => {
    setFilteredProducts(
      products.filter(
        (product) =>
          product.title.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().startsWith(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, products]);`
    }
  ];
  
  return (
    <div className="container">
      <h1>LLM Generated Content</h1>
      <div>
        {content.map((content, index) => (
          <div key={index}>
            <pre>
              <code>{content.codeSnippet}</code>
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LLM;