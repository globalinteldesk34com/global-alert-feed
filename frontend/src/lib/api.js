import axios from "axios";

const api = axios.create({
  baseURL: "https://global-alert-feed.vercel.app/api",
});

export default api;
