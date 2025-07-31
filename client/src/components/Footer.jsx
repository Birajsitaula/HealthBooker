import React from "react";
import "../styles/footer.css";
import { FaFacebookF, FaYoutube, FaInstagram, FaGithub } from "react-icons/fa";
import { HashLink } from "react-router-hash-link";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <footer>
        <div className="footer">
          <div className="footer-links">
            <h3>Links</h3>
            <ul>
              <li>
                <NavLink to={"/"}>Home</NavLink>
              </li>
              <li>
                <NavLink to={"/doctors"}>Doctors</NavLink>
              </li>
              <li>
                <NavLink to={"/appointments"}>Appointments</NavLink>
              </li>
              <li>
                <NavLink to={"/notifications"}>Notifications</NavLink>
              </li>
              <li>
                <HashLink to={"/#contact"}>Contact Us</HashLink>
              </li>
              <li>
                <NavLink to={"/profile"}>Profile</NavLink>
              </li>
            </ul>
          </div>
          <div className="social">
            <h3>Social links</h3>
            <ul>
              <li className="facebook">
                <a
                  href="https://www.facebook.com/biraj.sitaula.5"
                  target={"_blank"}
                  rel="noreferrer"
                >
                  <FaFacebookF />
                </a>
              </li>
              <li className="youtube">
                <a
                  href="https://www.youtube.com/@birajsitaula8645"
                  target={"_blank"}
                  rel="noreferrer"
                >
                  <FaYoutube />
                </a>
              </li>
              <li className="instagram">
                <a
                  href="https://www.instagram.com/birajsitaula21/"
                  target={"_blank"}
                  rel="noreferrer"
                >
                  <FaInstagram />
                </a>
              </li>
              <li className="GitHub">
                <a
                  href="https://www.github.com/birajsitaula"
                  target={"_blank"}
                  rel="noreferrer"
                >
                  <FaGithub />
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          Made by
          <a
            href="https://www.linkedin.com/in/biraj-sitaula-aa7897188/"
            target="_blank"
            rel="noreferrer"
          >
            Biraj & Bramdev
          </a>
          © {new Date().getFullYear()}
        </div>
      </footer>
    </>
  );
};

export default Footer;
