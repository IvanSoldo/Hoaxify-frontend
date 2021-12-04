import * as apiCalls from "../api/apiCalls";

export const localStorageMiddleware = ({ getState }) => {
  return (next) => (action) => {
    const result = next(action);
    localStorage.setItem("applicationState", JSON.stringify(getState()));
    apiCalls.setAuthorizationHeader(
      JSON.parse(localStorage.getItem("applicationState"))
    );
    return result;
  };
};

export const reHydrateStore = () => {
  if (localStorage.getItem("applicationState") !== null) {
    apiCalls.setAuthorizationHeader(
      JSON.parse(localStorage.getItem("applicationState"))
    );
    return JSON.parse(localStorage.getItem("applicationState"));
  }
};
