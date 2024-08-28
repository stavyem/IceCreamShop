import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./styles/navbar.css";

const Navbar = () => {
  const { isLoggedIn, user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-logo">
        <h1>Frosty Delights</h1>
      </div>
      <nav className="navbar-nav">
        <ul className="navbar-links">
          {isLoggedIn ? (
            <>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/readme">Readme</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/store">Store</Link></li>
              <li><Link to="/cart">Cart</Link></li>
              <li><Link to="/fun-facts">Fun Facts</Link></li>
              <li><Link to="/quiz">Quiz</Link></li>
              <li><Link to="/flavor-voting">Flavor Voting</Link></li>
              <li><Link to="/guess-the-flavor">Guess The Flavor</Link></li>
              <li><Link to="/llm">LLM</Link></li>
              {user === "admin" && <li><Link to="/admin">Admin Panel</Link></li>}
              <li><Link to="/" id="logoutButton" onClick={logout}>Logout</Link></li>
            </>
          ) : (
            <>
              <li><Link to="/readme">Readme</Link></li>
              <li><Link to="/store">Store</Link></li>
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/login">Login</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;