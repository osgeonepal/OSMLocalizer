import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function AuthorizedView(props) {
  const [isRedyToRedirect, setIsRedyToRedirect] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    const state = params.get("state");
    if (code !== null) {
      window.opener.authComplete(code, state);
      window.close();
      return;
    }
    const redirectUrl =
      params.get("redirectTo") && params.get("redirectTo") !== "/"
        ? params.get("redirectTo")
        : "/";
    setIsRedyToRedirect(true);
    navigate(redirectUrl);
  }, [navigate, location.search]);
  return <>{!isRedyToRedirect ? null : <div>Redirecting</div>}</>;
}

export default AuthorizedView;
