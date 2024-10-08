import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

import { useViewport } from "../utills/hooks";
import Login from "./login";
import logo from "../assets/icons/logo.png";

const marker = new Image(40, 40);
marker.src = logo;

const menuItems = [
  {
    label: "Challenges",
    link: "challenges",
  },
  {
    label: "Create",
    link: "manage/challenge/create",
  },
  {
    label: "Leaderboard",
    link: "leaderboard",
  },
  {
    label: "About",
    link: "about",
  },
];

const NavBarSmall = () => {
  const [showMenu, setShowMenu] = useState(false);
  const navClass = "nav-link ps-0 pe-0 ms-3 me-3";
  const navClassActive =
    navClass + " border-bottom border-2 border-primary active";
  // canvasClass = setShowMenu
  return (
    <div>
      <button
        className={"navbar-toggler"}
        onClick={() => setShowMenu(!showMenu)}
      >
        <span className={"navbar-toggler-icon"}></span>
      </button>
      {showMenu ? (
        <>
          <div className="offcanvas offcanvas-start show">
            <div className="offcanvas-header">
              <NavLink
                className="navbar-brand d-flex align-items-center"
                to="/"
                key="/"
              >
                <img
                  src={logo}
                  alt="OSM Localizer"
                  style={{ width: "35px", height: "35px", borderRadius: "50%" }}
                  className="me-1"
                />
                <span className="fs-4" onClick={() => setShowMenu(false)}>
                  OSM Localizer
                </span>
              </NavLink>
              <button
                className="btn btn-close"
                onClick={() => setShowMenu(false)}
              ></button>
            </div>
            <div className="offcanvas-body">
              <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                {menuItems.map((item) => (
                  <li className="nav-item" key={item.link}>
                    <NavLink
                      className={({ isActive }) =>
                        isActive ? navClassActive : navClass
                      }
                      to={"/" + item.link}
                    >
                      <span onClick={() => setShowMenu(false)} className="pb-1">
                        {item.label}
                      </span>
                    </NavLink>
                  </li>
                ))}
                <li className="nav-item">
                  <a
                    className={navClass}
                    href="https://forms.gle/fmfeyPEXjSPZk1tX6"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Report
                    <i
                      className="fa fa-external-link ms-1"
                      style={{ fontSize: "0.8rem" }}
                    ></i>
                  </a>
                </li>
                <div className="nav-item">
                  <div className={navClass}>
                    <Login />
                  </div>
                </div>
              </ul>
            </div>
          </div>
          <div className="offcanvas-backdrop fade show"></div>
        </>
      ) : null}
    </div>
  );
};

const NavBarLarge = () => {
  const navClass = "nav-link ps-0 pe-0 ms-3 me-3";
  const navClassActive =
    navClass + " border-bottom border-2 border-secondary active";
  return (
    <>
      <div className="collapse navbar-collapse d-flex" id="navbarText">
        <ul className="navbar-nav me-auto flex-grow-1 d-flex justify-content-center">
          {menuItems.map((item) => (
            <li className="nav-item" key={item.link}>
              <NavLink
                className={({ isActive }) =>
                  isActive ? navClassActive : navClass
                }
                to={"/" + item.link}
              >
                <span className="pb-1">{item.label}</span>
              </NavLink>
            </li>
          ))}
          <li className="nav-item">
            <a
              className={navClass}
              href="https://forms.gle/fmfeyPEXjSPZk1tX6"
              target="_blank"
              rel="noopener noreferrer"
            >
              Report
              <i
                className="fa fa-external-link ms-1"
                style={{ fontSize: "0.8rem" }}
              ></i>
            </a>
          </li>
        </ul>
        <div>
          <Login />
        </div>
      </div>
    </>
  );
};

function NavBar() {
  const { width } = useViewport();
  const breakpoint = 995;
  return (
    <>
      <nav
        className="navbar navbar-expand-lg border border-0 App"
        style={{ height: "8vh" }}
      >
        <div className="container">
          <NavLink
            className="navbar-brand d-flex align-items-center m-0 p-0"
            to="/"
            key="/"
          >
            <img
              src={logo}
              alt="OSM Localizer"
              style={{ width: "35px", height: "35px", borderRadius: "50%" }}
              className="me-1"
            />
            <span >OSMLocalizer</span>
          </NavLink>
          {width > breakpoint ? <NavBarLarge /> : <NavBarSmall />}
        </div>
      </nav>
      <Outlet />
    </>
  );
}
export default NavBar;
