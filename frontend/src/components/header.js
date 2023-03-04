import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

import { useViewport } from "../utills/hooks";
import Login from "./login";
import logo from "../assets/icons/logo.png";

const marker = new Image(40, 40);
marker.src = logo;

const menuItems = [
  {
    label: "CHALLENGES",
    link: "challenges",
  },
  {
    label: "CREATE",
    link: "create",
  },
  { 
    label: "ABOUT",
    link: "about" },
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
              <h5 className="offcanvas-title">Offcanvas</h5>
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
    navClass + " border-bottom border-2 border-primary active";
  return (
    <>
      <div className="collapse navbar-collapse" id="navbarText">
        <ul className="navbar-nav me-auto">
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
        </ul>
        <div className="d-flex">
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
      <nav className="navbar navbar-expand-lg bg-body-tertiary border-bottom mb-4">
        <div className="container">
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
            <span className="fs-4">OSM Localizer</span>
          </NavLink>
          {width > breakpoint ? <NavBarLarge /> : <NavBarSmall />}
        </div>
      </nav>
      <Outlet />
    </>
  );
}
export default NavBar;
