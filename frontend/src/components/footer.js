import { useEffect, useState } from "react";
import { fetchExternalJSONAPI } from "../utills/fetch";

import osgeonepallogo from "../assets/icons/osgeonepal.png";

const footerItems = [
  {
    label: "Challenges",
    link: "challenges",
  },
  {
    label: "Leaderboard",
    link: "leaderboard",
  },
  {
    label: "About",
    link: "about",
  },
  {
    label: "Report",
    icon: "fa fa-external-link ms-1",
    link: "https://forms.gle/fmfeyPEXjSPZk1tX6",
  },
  {
    label: "Source Code",
    icon: "bi bi-github",
    link: "https://github.com/OSGeoNepal/OSMLocalizer",
  },
];

const Footer = () => {
  const [version, setVersion] = useState("v1..0.1");

  useEffect(() => {
    fetchExternalJSONAPI(
      "https://api.github.com/repos/Aadesh-Baral/OSMLocalizer/releases/latest"
    )
      .then((data) => {
        setVersion(data.tag_name);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <footer className="bg-secondary pb-4">
      <div className="container">
        <div className="text-light pt-4 fs-5 d-flex flex-column">
          <div className="d-flex mb-4">
            <div className="flex-grow-1">
              <div className="title">
                <span className="me-2">OSMLocalizer:</span>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-light"
                  href="https://github.com/Aadesh-Baral/OSMLocalizer/releases/latest/"
                >
                  {version}
                </a>
              </div>
              <div className="title d-flex flex-column">
                <span className="fw-semibold">
                  A tool to help you localize places in OpenStreetMap.
                </span>
                <span style={{ fontSize: "0.9rem" }}>
                  One tool to localize them all.
                </span>
              </div>
            </div>
            <div className="d-flex justify-content-center mt-4">
              {footerItems.map((item, index) => (
                <a
                  style={{ fontSize: "0.9rem", textDecoration: "none" }}
                  key={index}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-light me-3"
                >
                  {item.label}
                  &nbsp;
                  {item.icon && (
                    <i className={item.icon} style={{ fontSize: "0.8rem" }}></i>
                  )}
                </a>
              ))}
            </div>
          </div>

          <div className="title d-flex justify-content-end align-items-center mt-4">
            <span className="pe-2">An </span>
            <div className="col-1">
              <div className="">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.osgeo.org/local-chapters/osgeo-nepal/"
                >
                  <img
                    className="img-fluid"
                    src={osgeonepallogo}
                    alt="OSGeo Nepal"
                  />
                </a>
              </div>
            </div>
            <span>Project.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
