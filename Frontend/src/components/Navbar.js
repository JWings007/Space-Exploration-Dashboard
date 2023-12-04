import React, { useEffect } from "react";
import Logo from "../logo.png";

function Navbar() {
  useEffect(() => {
    const navbarBg = document.querySelector(".navbar");
    document.addEventListener("scroll", () => {
      if (window.scrollY >= 500) {
        navbarBg.style.backgroundColor = "#090c13";
      } else {
        navbarBg.style.backgroundColor = "transparent";
      }
    });
  }, []);
  return (
    <div className="navbar">
      <img src={Logo} alt="" />
      <i
        className="fa-regular fa-equals"
        onClick={() => {
          const sidebar = document.querySelector(".sidebar");
          sidebar.style.transform = "translateX(0%)";
        }}
      ></i>
    </div>
  );
}

export default Navbar;
