import React from "react";
import AnchorLink from "react-anchor-link-smooth-scroll";

function Sidebar() {
  return (
    <div className="sidebar">
      <i
        className="fa-solid fa-xmark"
        onClick={() => {
          const sidebar = document.querySelector(".sidebar");
          sidebar.style.transform = "translateX(100%)";
        }}
      ></i>
      <ul>
        <AnchorLink href="#apod" style={{ textDecoration: "none" }}>
          <li>ASTRONOMY PICTURE OF THE DAY</li>
        </AnchorLink>
        <AnchorLink href="#satellite" style={{ textDecoration: "none" }}>
          <li>TRACK SATELLITE</li>
        </AnchorLink>
        <AnchorLink href="#neo" style={{ textDecoration: "none" }}>
          <li>ASTROIDS</li>
        </AnchorLink>
          <li><a href="https://www.n2yo.com/satellites/?c=most-popular" target="_blank">MOST TRACKED SATELLITES</a></li>
      </ul>
    </div>
  );
}

export default Sidebar;
