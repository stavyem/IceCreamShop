import React from "react";
import Navbar from "./Navbar";
import "./styles/layout.css";

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
      <footer>
        <p>&copy; 2024 Frosty Delights Ice Cream Store</p>
      </footer>
    </div>
  );
};

export default Layout;