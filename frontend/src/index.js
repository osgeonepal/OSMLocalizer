import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

import "./index.css";
import App from "./App";
import store from "./store/store";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import { SENTRY_FRONTEND_DSN, SENTRY_ENVIRONMENT } from "./config";

if (SENTRY_FRONTEND_DSN) {
  Sentry.init({
    dsn: SENTRY_FRONTEND_DSN,
    environment: SENTRY_ENVIRONMENT,
    integrations: [new BrowserTracing()],
    tracesSampleRate: 0.1,
  });
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
