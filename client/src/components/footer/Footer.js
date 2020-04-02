import React from "react";

//This renders the footer.
const Footer = () => {
  return (
    <div
      style={{
        backgroundColor: "#333366",
        color: "white",
        width: "100%",
        height: 200,
        paddingTop: 60,
        position: "relative",
        clear: "both"
      }}
    >
      <p>
        MealTime is a fictional product created by David Allison, Rachel
        Scherer, Alex Tung, June Lee, and Osiris Sielatshom for CS4800.
      </p>
      <a
        href="https://rachelscherer.github.io/kodeop"
        target="_blank"
        rel="noopener noreferrer"
      >
        Company website
      </a>
      <br />
      <a
        href="https://github.com/Kode-Op/mealtime"
        target="_blank"
        rel="noopener noreferrer"
      >
        Github repository
      </a>
    </div>
  );
};

export default Footer;
