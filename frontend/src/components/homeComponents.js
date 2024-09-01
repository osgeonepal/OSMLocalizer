import React from "react";
import { useNavigate } from "react-router-dom";

import { useSpring, animated } from "@react-spring/web";

import background from "../assets/icons/background.png";

const isSvg = (name) => {
  return name.includes("svg");
};

export const PartnersComponent = ({ name, logo, displayText, className }) => {
  const isNameImage = isSvg(name);
  return (
    <div className={className || "col-3 d-flex justify-content-start"}>
      <img className="img-fluid" src={logo} alt="" />
      {displayText &&
        (isNameImage ? (
          <img className="img-fluid" src={name} alt="" />
        ) : (
          <div className="d-flex flex-column justify-content-center text-secondary fs-bold">
            <span>{name}</span>
          </div>
        ))}
    </div>
  );
};

export const PartnersSection = ({ partners }) => {
  return (
    <section className="mb-4 pb-4">
      <div className="container mt-4 pt-2">
        <h3 className="text-center">In Collaboration With</h3>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ gap: 4 }}
        >
          {partners.map((partner, index) => (
            <PartnersComponent
              key={index}
              name={partner.name}
              logo={partner.logo}
              displayText={partner.displayText}
              className={partner.className}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export const HeroComponent = ({ headlineText }) => {
  const navigate = useNavigate();

  const letters = headlineText.split("").map((char, index) => ({
    char,
    delay: index * 120, // Adjust delay for stagger effect
  }));

  const springProps = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 1000 },
    delay: 500,
  });

  const props = useSpring({
    from: { opacity: 0, transform: "translate3d(0, -40px, 0)" },
    to: { opacity: 1, transform: "translate3d(0, 0, 0)" },
    config: { duration: 1000 },
    delay: 4000,
  });

  const bounce = useSpring({
    from: { opacity: 0, transform: "translateY(-100px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: { tension: 300, friction: 60 },
    delay: 5200,
  });

  return (
    <div
      className="jumbotron text-center text-dark d-flex flex-column justify-content-center"
      style={{
        height: "70vh",
        backgroundImage: `
                linear-gradient(to bottom, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0)),
                linear-gradient(to right, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.8)),
                url(${background})
                `,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className="d-flex flex-column justify-content-evenly p-2"
        style={{ gap: 30 }}
      >
        <animated.div style={springProps}>
          <div style={{ display: "inline", whiteSpace: "pre" }}>
            {letters.map(({ char, delay }, index) => (
              <h1
                key={index}
                style={{
                  opacity: 0,
                  display: "inline",
                  animation: `fadeIn ${1}s ${delay / 1000}s forwards`,
                }}
              >
                {char}
              </h1>
            ))}
          </div>
          <style>
            {`
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                `}
          </style>
        </animated.div>
        <animated.div style={props}>
          <p className="lead text-secondary">
            Seamlessly Localize OpenStreetMap with OSMLocalizer
          </p>
        </animated.div>

        <animated.div style={bounce}>
          <button
            className="btn btn-primary btn-lg "
            onClick={() => navigate("/challenges")}
          >
            Get Started
          </button>
        </animated.div>
      </div>
    </div>
  );
};

export const FeaturesElement = ({ icon, text, description }) => {
  return (
    <div className="card shadow-none col-md-4 border border-0 p-2">
      <div className=" border border-0">
        <i className={icon} style={{ fontSize: "3rem" }}></i>
        <h5 className=" card-title mt-4">{text}</h5>
        <p className="card-text mt-4">{description}</p>
      </div>
    </div>
  );
};

export const FeaturesSection = ({ features }) => {
  const navigate = useNavigate();
  return (
    <section className="py-5 mt-4">
      <div className="d-flex justify-content-center mt-4">
        <div className="w-75">
          <h2 className="text-center">Features</h2>
          <div className="d-flex flex-column align-items-center border border-0 rounded">
            <div className="d-flex flex-row pt-4 " style={{ gap: 30 }}>
              {features.map((feature, index) => (
                <FeaturesElement
                  key={index}
                  icon={feature.icon}
                  text={feature.text}
                  description={feature.description}
                />
              ))}
            </div>
          </div>
          <div className="d-flex justify-content-center pt-2 mt-3">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/about")}
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export const MakeDifferenceElement = ({ icon, title, description, color }) => {
  return (
    <div className="card">
      <div className="card-body">
        <i className={icon} style={{ fontSize: "48px", color: color }}></i>
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{description}</p>
      </div>
    </div>
  );
};

export const MakeDifferenceSection = ({ elements }) => {
  return (
    <div className="row text-center mt-4 pt-4 mb-4 pb-4">
      <div className="col-12 mt-4">
        <h2 className="mb-4 pb-4">Make a Difference</h2>
        <div
          className="d-flex justify-content-center align-items-center mt-4"
          style={{ gap: 30 }}
        >
          {elements.map((element, index) => (
            <MakeDifferenceElement
              key={index}
              icon={element.icon}
              title={element.title}
              description={element.description}
              color={element.color}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
