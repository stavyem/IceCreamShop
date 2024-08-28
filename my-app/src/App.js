import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import Home from "./Home";
import About from "./About";
import Store from "./Store";
import Admin from "./Admin";
import Cart from "./Cart";
import Login from "./Login";
import Checkout from "./Checkout";
import FunFacts from "./FunFacts";
import Quiz from "./Quiz";
import LLM from "./LLM";
import Register from "./Register";
import ThankYou from "./Thankyou";
import Readme from "./Readme";
import FlavorVoting from "./FlavorVoting";
import GuessTheFlavor from "./GuessTheFlavor";

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/store" element={<Store />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/fun-facts" element={<FunFacts />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/flavor-voting" element={<FlavorVoting />} />
          <Route path="/guess-the-flavor" element={<GuessTheFlavor />} />
          <Route path="/llm" element={<LLM />} />
          <Route path="/register" element={<Register />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/readme" element={<Readme />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
