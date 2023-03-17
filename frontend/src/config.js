export const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
export const OAUTH_CLIENT_ID = process.env.REACT_APP_OAUTH_CLIENT_ID;
export const OAUTH_CLIENT_SECRET = process.env.REACT_APP_OAUTH_CLIENT_SECRET;
export const DEFAULT_CHANGESET_COMMENT =
  process.env.REACT_APP_DEFAULT_CHANGESET_COMMENT ||
  "#OSMLocalizer #LocalizeNepal";

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL
  ? new URL("/api/", process.env.REACT_APP_API_BASE_URL)
  : "http://127.0.0.1:5000/api/";

export const SENTRY_FRONTEND_DSN = process.env.REACT_APP_SENTRY_FRONTEND_DSN;
export const SENTRY_ENVIRONMENT = process.env.REACT_APP_SENTRY_ENVIRONMENT;
