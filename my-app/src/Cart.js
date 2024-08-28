import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/cart.css";
import { useAuth } from "./AuthContext";

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const { user, isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
    fetchCartItems();
  }, [isLoggedIn, navigate, user]);

  const fetchCartItems = async () => {
    try {
      const cartResponse = await axios.get(`http://localhost:8000/cart/${user}`);
      const productIds = cartResponse.data;
      const productsResponse = await axios.get("http://localhost:8000/store/products");
      const allProducts = productsResponse.data;
      const cartProducts = allProducts.filter(product => productIds.includes(product.id));
      setCartItems(cartProducts);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      const response = await axios.delete("http://localhost:8000/cart/remove", {
        data: {
          items: [productId],
          username: user
        }
      });

      if (response.status === 200) {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
        setSelectedItems(prevSelected => prevSelected.filter(id => id !== productId));
      } else {
        console.error("Failed to remove product from cart");
      }
    } catch (error) {
      console.error("Error removing product from cart:", error);
    }
  };

  const handleCheckboxChange = (productId) => {
    if (selectedItems.includes(productId)) {
      setSelectedItems(selectedItems.filter(id => id !== productId));
    } else {
      setSelectedItems([...selectedItems, productId]);
    }
  };

  const handleCheckout = () => {
    const itemsToCheckout = cartItems.filter(item => selectedItems.includes(item.id));
    navigate("/checkout", { state: { itemsToCheckout } });
  };

  return (
    <div>
      <header>
        <h1>Your Cart</h1>
      </header>
      <main>
        {cartItems.length > 0 ? (
          <>
            <p>Please select the items you want to checkout by ticking the checkbox next to each item.</p>
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => handleCheckboxChange(item.id)}
                />
                <img src={item.imageUrl} alt={item.title} />
                <div className="cart-item-details">
                  <h2>{item.title}</h2>
                  <p>{item.description}</p>
                  <p>Price: {item.price}</p>
                </div>
                <div className="cart-item-actions">
                  <button className="remove-button" onClick={() => handleRemoveFromCart(item.id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </>
        ) : (
          <p>Your cart is empty</p>
        )}
        {cartItems.length > 0 && selectedItems.length > 0 && (
          <button id="checkoutButton" onClick={handleCheckout}>
            Proceed to Checkout with Selected Items
          </button>
        )}
      </main>
    </div>
  );
};

export default Cart;