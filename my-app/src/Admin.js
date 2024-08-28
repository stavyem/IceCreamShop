import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles/admin.css";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [filter, setFilter] = useState("");
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    price: "",
    imageUrl: "",
  });
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8000/store/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    } else if (user !== "admin") {
      navigate("/");
    }

    const fetchActivities = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/admin/activity"
        );
        setActivities(response.data);
        setFilteredActivities(response.data);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    fetchActivities();
    fetchProducts();
  }, [isLoggedIn, user, navigate]);

  const handleFilterChange = (e) => {
    const prefix = e.target.value.toLowerCase();
    setFilter(prefix);
    setFilteredActivities(
      activities.filter((activity) => {
        return (
          activity.username &&
          activity.username.toLowerCase().startsWith(prefix)
        );
      })
    );
  };

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: value,
    });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/admin/products/add",
        newProduct,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        fetchProducts();
      } else {
        console.error("Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleRemoveProduct = async (productId) => {
    try {
      const response = await axios.delete(
        "http://localhost:8000/admin/products/remove",
        {
          data: { productId },
        }
      );

      if (response.status === 200) {
        setProducts(products.filter((product) => product.id !== productId));
      } else {
        console.error("Failed to remove product");
      }
    } catch (error) {
      console.error("Error removing product:", error);
    }
  };

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>

      <h2>User Activity</h2>
      <input
        type="text"
        placeholder="Filter by username..."
        value={filter}
        onChange={handleFilterChange}
      />
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Username</th>
            <th>Activity Type</th>
          </tr>
        </thead>
        <tbody>
          {filteredActivities.map((activity, index) => (
            <tr key={index}>
              <td>{new Date(activity.datetime).toLocaleString()}</td>
              <td>{activity.username}</td>
              <td>{activity.type}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Manage Products</h2>
      <form onSubmit={handleAddProduct}>
        <input
          type="text"
          name="title"
          placeholder="Product Title"
          value={newProduct.title}
          onChange={handleProductChange}
          required
        />
        <textarea
          name="description"
          placeholder="Product Description"
          value={newProduct.description}
          onChange={handleProductChange}
          required
        ></textarea>
        <input
          type="text"
          name="price"
          placeholder="Price"
          value={newProduct.price}
          onChange={handleProductChange}
          required
        />
        <input
          type="text"
          name="imageUrl"
          placeholder="Image URL"
          value={newProduct.imageUrl}
          onChange={handleProductChange}
        />
        <button type="submit">Add Product</button>
      </form>

      <div className="product-list">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="product">
              <h3>{product.title}</h3>
              <p>{product.description}</p>
              <p>Price: {product.price}</p>
              {product.imageUrl && (
                <img src={product.imageUrl} alt={product.title} />
              )}
              <button onClick={() => handleRemoveProduct(product.id)}>
                Remove
              </button>
            </div>
          ))
        ) : (
          <p>No products available</p>
        )}
      </div>
    </div>
  );
};

export default Admin;
