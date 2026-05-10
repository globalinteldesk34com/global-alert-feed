import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.REACT_APP_BACKEND_URL ||
    "https://global-alert-feed.vercel.app",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
