import axios from "axios";
import queryString from "query-string";

const baseURL = "https://rk-shop.vercel.app/api/v1/"; //server URL
// const baseURL = "http://localhost:5000/api/v1/"; //server URL
const privateClient = axios.create({
  baseURL,
  paramsSerializer: {
    encode: (params) => queryString.stringify(params),
  },
  withCredentials: true,
});

//request interceptor
privateClient.interceptors.request.use(async (config) => {
  return {
    ...config,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
});

//response interceptor
privateClient.interceptors.response.use(
  (response) => {
    if (response && response.data) return response.data;
    return response;
  },
  (error) => {
    const originalRequest = error.config;

    // Check if the response status is 401 (Unauthorized)
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      // Make a request to refresh the token
      return privateClient
        .get("http://localhost:5000/api/v1/user/refresh-token")
        .then((response) => {
          localStorage.setItem("accessToken", response.accessToken);

          originalRequest.headers[
            "Authorization"
          ] = `Bearer ${response.accessToken}`;
          return privateClient(originalRequest);
        })
        .catch((error) => {
          console.log("Error refreshing token:", error);

          throw error;
        });
    } else {
      throw error.response.data;
    }
  }
);

export default privateClient;
