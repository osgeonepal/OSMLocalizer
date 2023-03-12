import { API_BASE_URL } from "../config";

export async function handleErrors(response) {
  if (response.ok) {
    return response;
  }

  let text;
  await response
    .clone()
    .json()
    .then((res) => {
      text = res.sub_code || response.statusText;
    });
  throw Error(text);
}

export function fetchLocalJSONAPI(
  endpoint,
  token,
  method = "GET",
  language = "en"
) {
  const url = new URL(endpoint, API_BASE_URL);
  let headers = {
    "Content-Type": "application/json",
    "Accept-Language": language.replace("-", "_"),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return fetch(url, {
    method: method,
    headers: headers,
  })
    .then(handleErrors)
    .then((res) => {
      return res.json();
    });
}

export function pushToLocalJSONAPI(
  endpoint,
  payload,
  token,
  method = "POST",
  language = "en"
) {
  const url = new URL(endpoint, API_BASE_URL);
  const headers = {
    "Content-Type": "application/json",
    "Accept-Language": language.replace("-", "_"),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return fetch(url, {
    method: method,
    headers: headers,
    body: payload,
  })
    .then(handleErrors)
    .then((res) => {
      return res.json();
    });
}

export function fetchExternalJSONAPI(url, payload) {
  return fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: payload,
  })
    .then(handleErrors)
    .then((res) => {
      return res.json();
    });
}

export function pushToExternalJSONAPI(url, payload) {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: payload,
  })
    .then(handleErrors)
    .then((res) => {
      return res.json();
    });
}
