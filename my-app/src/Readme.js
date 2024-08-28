import React from "react";
import "./styles/readme.css";

const Readme = () => {
  return (
    <div>
      <h1>Online Store Project README - Stav Yemin & Itay Tiomkin</h1>
      <section>
        <h2>Store Name: Frosty delights</h2>
        <p>What we're selling: Ice cream</p>
      </section>
      <section>
        <h2>Additional Pages</h2>
        <ul>
          <li>
            1. Fun facts: a page with a button that, when pressed, generates a
            random fact about ice cream
          </li>
          <li>
            2. Quiz: a page with multiple choice questions about ice cream
          </li>
          <li>
            3. Flavor voting: a page that allows users to vote for their favorite ice cream flavor
          </li>
          <li>
            4. Guess The Flavor: a page that prompts users with random ice cream 
               images and asks them to guess the ice cream's flavor
          </li>
        </ul>
      </section>
      <section>
        <h2>Challenges Faced</h2>
        <p>Stav: Developing this online store presented a few key challenges. Integrating the frontend and backend required careful attention to API design, ensuring that data flowed seamlessly between the two layers. Managing state in the frontend while handling asynchronous data retrieval from the backend was also tricky. Generally getting up to speed with technologies like React and express took some learning.</p>
        <p>Itay: One key challenge faced while the development of this online store was finding the appropriate css design scheme for the website. The website design had to reflect the atmosphere of an ice cream store, while also being neat and modern. The manual testing of the website brought attention to several significant problems in its activity, which required handling and fixing while leaving the rest of the code unharmed.</p>
      </section>
      <section>
        <h2>Project Partners</h2>
        <p>Stav Yemin, ID: 318226461</p>
        <p>Itay Tiomkin, ID: 207828914</p>
        <p>Stav's Contributions: Data persistence, server endpoints handling, frontend</p>
        <p>Itay's Contributions: Styling, manual testing, frontend</p>
      </section>
      <section>
        <h2>Supported Routes</h2>
        <ul>
          <li>'/': Home - The main page of the app where users start their journey.</li>
          <li>'/about': About - Information about the app and its creators.</li>
          <li>'/login': Login - The page where users can sign in to their account.</li>
          <li>'/store': Store - A page showcasing the ice cream flavors available for purchase.</li>
          <li>'/admin': Admin - Admin dashboard for managing products and user data.</li>
          <li>'/cart': Cart - The shopping cart where users can review their selected items.</li>
          <li>'/checkout': Checkout - The page for users to complete their purchase.</li>
          <li>'/fun-facts': Fun Facts - Interesting facts and trivia about ice cream.</li>
          <li>'/quiz': Quiz - An interactive quiz related to ice cream.</li>
          <li>'/flavor-voting': Flavor Voting - A page where users can vote for their favorite ice cream flavors and suggest new ones.</li>
          <li>'/guess-the-flavor': Guess the Flavor - A game where users guess the ice cream flavor based on an image.</li>
          <li>'/llm': LLM - A page to note which code LLMs produced for us.</li>
          <li>'/register': Register - The page for new users to sign up for an account.</li>
          <li>'/thank-you': Thank You - A confirmation page displayed after a successful purchase.</li>
          <li>'/readme': Readme - A page explaining how to use the app and documenting our challenges and contributions.</li>
        </ul>
      </section>
    </div>
  );
};

export default Readme;