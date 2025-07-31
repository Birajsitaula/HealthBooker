import React from "react";
import image from "../images/aboutimg.jpg";

const AboutUs = () => {
  return (
    <>
      <section className="container">
        <h2 className="page-heading about-heading">About Us</h2>
        <div className="about">
          <div className="hero-img">
            <img src={image} alt="hero" />
          </div>
          <div className="hero-content">
            <p>
              At HealthBooker, we are committed to revolutionizing healthcare
              management with a user-friendly platform designed to streamline
              appointments, enhance patient care, and support healthcare
              professionals. Built with advanced technology, our system ensures
              secure, efficient, and accessible services for patients, doctors,
              and administrators alike. Our mission is to improve healthcare
              delivery through innovation and collaboration.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutUs;
