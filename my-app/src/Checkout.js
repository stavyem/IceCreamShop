import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/checkout.css";
import { useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Checkout = () => {
  const location = useLocation();
  const { itemsToCheckout = [] } = location.state || {};
  const { user, isLoggedIn } = useAuth();

  const [selectedItems, setSelectedItems] = useState(itemsToCheckout);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    zipcode: "",
    cardNumber: "",
    expDate: "",
    cvv: "",
  });

  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
    if (itemsToCheckout && itemsToCheckout.length > 0) {
      calculateTotal(itemsToCheckout);
    }
  }, [itemsToCheckout, isLoggedIn, navigate]);

  const calculateTotal = (items) => {
    const calculatedTotal = items.reduce(
      (sum, item) => sum + parseFloat(item.price.replace("$", "")),
      0
    );
    setTotal(calculatedTotal);
  };

  const handleItemChange = (item) => {
    const alreadySelected = selectedItems.some((selectedItem) => selectedItem.id === item.id);
    let updatedSelectedItems;

    if (alreadySelected) {
      updatedSelectedItems = selectedItems.filter((selectedItem) => selectedItem.id !== item.id);
    } else {
      updatedSelectedItems = [...selectedItems, item];
    }

    setSelectedItems(updatedSelectedItems);
    calculateTotal(updatedSelectedItems);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderData = {
      username: user,
      items: selectedItems.map(item => item.id),
      total: total.toFixed(2),
      shippingDetails: {
        name: formData.name,
        address: formData.address,
        city: formData.city,
        zipcode: formData.zipcode,
      },
      paymentDetails: {
        cardNumber: formData.cardNumber,
        expDate: formData.expDate,
        cvv: formData.cvv,
      },
    };

    try {
      const response = await axios.post("http://localhost:8000/store/checkout", orderData);

      if (response.status === 200) {
        navigate("/thank-you");
        await axios.delete("http://localhost:8000/cart/remove", {
          data: {
            items: [...orderData.items],
            username: user
          }
        });
      }
    } catch (error) {
      console.error("Error processing order:", error);
    }
  };

  return (
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
          <h3>Total: ${total.toFixed(2)}</h3>

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
        <p>Please add items before checking out.</p>
      )}
    </div>
  );
};

export default Checkout;