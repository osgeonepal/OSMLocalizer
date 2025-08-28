import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDetectClickOutside } from "react-detect-click-outside";

import { fetchLocalJSONAPI } from "../utills/fetch";
import { setItem, removeItem } from "../utills/localStorage";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../store/store";
import userAvatar from "../assets/icons/user_avatar.png";

const removeUserFromStore = () => {
  removeItem("osm_token");
  removeItem("jwt_token");
  removeItem("username");
  removeItem("user_id");
  removeItem("role");
  removeItem("picture_url");
};

const createLoginWindow = (redirectTo) => {
  const url = "auth/url/";
  fetchLocalJSONAPI(url, "GET")
    .then((response) => {
      setItem("authState", response.state);
      if (redirectTo) {
        setItem("authRedirectTo", redirectTo);
      }
      window.location = response.url;
    })
    .catch((error) => {
      console.log(error);
    });
};

const UserMenu = ({ username, user_picture, dispatch }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const picture_url = user_picture !== "null" ? user_picture : userAvatar;
  const onClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const navigate = useNavigate();
  const navigateToProfile = () => {
    navigate(`/profile/${username}`);
  };
  const ref = useDetectClickOutside({
    onTriggered: () => setIsDropdownOpen(false),
  });
  return isDropdownOpen ? (
    <div className="dropdown" ref={ref} style={{ cursor: "pointer" }}>
      <span className="dropdown-toggle">
        <img
          className="me-1"
          src={picture_url}
          alt="img"
          style={{ width: "35px", height: "35px", borderRadius: "50%" }}
          onClick={onClick}
        />
        <span onClick={onClick}> {username} </span>
      </span>
      <ul className="dropdown-menu d-flex flex-column mt-1 p-1 rounded-0 ">
        <li>
          <span className="dropdown-item" onClick={navigateToProfile}>
            Profile
          </span>
        </li>
        <li>
          <span
            className="dropdown-item"
            onClick={() => {
              removeUserFromStore();
              dispatch(authActions.logout());
            }}
          >
            Logout
          </span>
        </li>
      </ul>
    </div>
  ) : (
    <div className="dropdown" style={{ cursor: "pointer" }}>
      <span className="dropdown-toggle">
        <img
          className="me-1"
          src={picture_url}
          alt="img"
          style={{ width: "35px", height: "35px", borderRadius: "50%" }}
          onClick={onClick}
        />
        <span onClick={onClick}> {username} </span>
      </span>
    </div>
  );
};

const Login = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  return (
    <div>
      {!props.expired && user ? (
        <UserMenu
          username={user.username}
          user_picture={user.picture_url}
          dispatch={dispatch}
        />
      ) : (
        <button
          className="btn btn-primary"
          onClick={() => {
            createLoginWindow(props.redirectTo);
          }}
        >
          Login
        </button>
      )}
    </div>
  );
};

export default Login;
