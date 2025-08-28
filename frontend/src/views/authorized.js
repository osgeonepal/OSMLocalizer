import { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import { setItem, getItem, removeItem } from "../utills/localStorage";
import { fetchLocalJSONAPI } from "../utills/fetch";
import { authActions } from "../store/store";

function AuthorizedView(props) {
  const [isRedyToRedirect, setIsRedyToRedirect] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const setUserToStore = (response) => {
    const user = response.user;
    setItem("osm_token", response.osm_token);
    setItem("jwt_token", response.jwt_token);
    setItem("username", user.username);
    setItem("user_id", user.id);
    setItem("role", user.role);
    setItem("picture_url", user.picture_url);
  };

  const authComplete = useCallback(
    (code, state) => {
      const responseState = getItem("authState");
      const redirectTo = getItem("authRedirectTo");
      if (responseState === state) {
        const url = "auth/token/?code=" + code;
        fetchLocalJSONAPI(url, "GET").then((response) => {
          setUserToStore(response);
          dispatch(authActions.login(response));
          const params = new URLSearchParams({
            redirectTo: redirectTo ? redirectTo : "/",
          }).toString();
          let redirectUri = "/authorized/?" + params;

          removeItem("authState");
          removeItem("authRedirectTo");
          window.location.href = redirectUri;
        }).catch((error) => {
          removeItem("authState");
          removeItem("authRedirectTo");
          console.log(error);
        });
      }
    },
    [dispatch],
  );

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    const state = params.get("state");
    if (code !== null) {
      authComplete(code, state);
      return;
    }
    const redirectUrl =
      params.get("redirectTo") && params.get("redirectTo") !== "/"
        ? params.get("redirectTo")
        : "/";
    setIsRedyToRedirect(true);
    navigate(redirectUrl);
  }, [navigate, location.search, authComplete]);
  return <>{!isRedyToRedirect ? null : <div>Redirecting</div>}</>;
}

export default AuthorizedView;
