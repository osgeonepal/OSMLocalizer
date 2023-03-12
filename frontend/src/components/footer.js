import { useEffect, useState } from "react";
import { fetchExternalJSONAPI } from "../utills/fetch";

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
    <footer className="bg-secondary" style={{ height: "33vh" }}>
      <div className="container text-light pt-4 fs-5">
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
        <div className="title">
          <span className="fw-semibold">
            A tool to help you localize places in OpenStreetMap.
          </span>
          <br />
          <span style={{ fontSize: "0.9rem" }}>
            One tool to localize them all.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
