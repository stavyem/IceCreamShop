import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./styles/register.css";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    remember: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/auth/register",
        {
          username: formData.username,
          password: formData.password,
        },
        { withCredentials: true }
      );

      if (response.status === 201) {
        login({ username: formData.username });
        setIsSuccessful(true);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else if (response.status === 409) {
        setError("Username already exists.");
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setError("Username already exists.");
      } else {
        setError(`An error occurred. Please try again.`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <header>
        <h1>Register</h1>
      </header>
      <main>
        {isSuccessful ? (
          <div className="success-message">
            <p>Registration successful! Redirecting to homepage...</p>
          </div>
        ) : (
          <form id="registerForm" onSubmit={handleSubmit}>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <label htmlFor="password">Password:</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <label>
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              Show Password
            </label>
            {error && <p className="error">{error}</p>}{" "}
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Registering..." : "Register"}
            </button>
          </form>
        )}
      </main>
    </div>
  );
};

export default Register;
