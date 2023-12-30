import React from "react";
import "./Footer.css";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="footer">
      <div className="row  icons">
        <a href="#">
          <FaFacebook />
        </a>
        <a href="#">
          <FaInstagram />
        </a>
        <a href="#">
          <FaYoutube />{" "}
        </a>
        <a href="#">
          <FaTwitter />
        </a>
      </div>

      <div className="row">
        <ul>
          <li>
            <a href="#">Contact us</a>
          </li>
          <li>
            <a href="#">Our Services</a>
          </li>
          <li>
            <a href="#">Privacy Policy</a>
          </li>
          <li>
            <a href="#">Terms & Conditions</a>
          </li>
          <li>
            <a href="#">Career</a>
          </li>
        </ul>
      </div>

      <div className="row">
        CodeMate Copyright © 2023 Codemate - All rights reserved
      </div>
    </div>
  );
};

export default Footer;
