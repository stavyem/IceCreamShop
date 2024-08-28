import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import "./styles/login.css";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    remember: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (!formData.username || !formData.password) {
      setError("Please fill out all fields.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/auth/login", {
        username: formData.username,
        password: formData.password,
      });

      if (response.status === 200) {
        setLoginCookie(formData.remember);
        login({ username: formData.username });
        setIsSuccessful(true);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Invalid username or password.");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const setLoginCookie = (remember) => {
    const now = new Date();
    const expirationTime = remember
      ? now.setDate(now.getDate() + 10)
      : now.setMinutes(now.getMinutes() + 30);

    document.cookie = `username=${formData.username}; expires=${new Date(
      expirationTime
    ).toUTCString()}; path=/`;
  };

  return (
    <div>
      <main>
        <div>
          <h1>Please log in</h1>
          {isSuccessful ? (
            <div className="success-message">
              <p>Login successful! Redirecting to homepage...</p>
            </div>
          ) : (
            <div>
              <form id="loginForm" onSubmit={handleSubmit}>
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
                <label>
                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                  />
                  Show Password
                </label>

                <label htmlFor="remember">
                  <input
                    type="checkbox"
                    id="remember"
                    name="remember"
                    checked={formData.remember}
                    onChange={handleChange}
                  />
                  Remember me
                </label>

                {error && <p className="error">{error}</p>}

                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Logging in..." : "Login"}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Login;
