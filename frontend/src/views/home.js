import React from "react";

import {
  PartnersSection,
  HeroComponent,
  FeaturesSection,
  MakeDifferenceSection,
} from "../components/homeComponents";

import kll_icon from "../assets/icons/kll-logo.svg";
import os_geo_nepal from "../assets/icons/osgeonepal.png";
import osmnepal from "../assets/icons/osmnepal.jpg";

import "react-responsive-carousel/lib/styles/carousel.min.css";

const partners = [
  {
    name: "Kathmandu Living Labs",
    logo: kll_icon,
    displayText: true,
  },
  {
    name: "OSGeo Nepal",
    logo: os_geo_nepal,
    displayText: false,
    className: "col-2 d-flex",
  },
  {
    name: "OSM Nepal",
    logo: osmnepal,
    displayText: false,
    className: "col-2 d-flex",
  },
];

const makeDifference = [
    {
        icon: "bi bi-globe",
        title: "Localize Map Data",
        description: "Translate and localize place names and features in your community, making maps accessible to everyone.",
        color: "#4CAF50",
    },
    {
        icon: "bi bi-people",
        title: "Join the Community",
        description: "Be part of a global community of volunteers. Share your knowledge and learn from others.",
        color: "#2196F3",
    },
    {
        icon: "bi bi-heart",
        title: "Make an Impact",
        description: "Your efforts can directly improve the quality of life in underserved areas by providing accurate.",
        color: "#FF9800",
    },
];

const HomeView = () => {
  const headlineText = "Creating Maps in Your Language";

  const features = [
    {
      icon: "fa fa-pencil-square",
      text: "Built-in Editor",
      description: "With built-in editor upload directly to OpenStreetMap",
    },
    {
      icon: "fa fa-globe",
      text: "Integrated Translation Engine",
      description: "Easily localize data with integrated translation engine",
    },
    {
      icon: "fa fa-users",
      text: "Real-time Collaboration",
      description: "Collaborate with other contributors in real-time",
    },
  ];

  return (
    <div>
      <HeroComponent headlineText={headlineText} />
      <PartnersSection partners={partners} />
      <FeaturesSection features={features} />
      <MakeDifferenceSection elements={makeDifference} />

    </div>
  );
};

export default HomeView;
