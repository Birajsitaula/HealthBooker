import React from "react";
import image from "../images/heroimg.jpg";
import "../styles/hero.css";

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>
          Your Health, <br />
          Our Responsibility
        </h1>
        <p>
          At HealthBooker, we are dedicated to safeguarding your health with a
          commitment to excellence. Our platform empowers you with seamless
          appointment booking, secure data management, and personalized care,
          while supporting healthcare providers and administrators. Built with
          cutting-edge technology, we take pride in being a trusted partner in
          your wellness journey, ensuring your health is our top priority every
          step of the way.
        </p>
      </div>
      <div className="hero-img">
        <img src={image} alt="hero" />
      </div>
    </section>
  );
};

export default Hero;
