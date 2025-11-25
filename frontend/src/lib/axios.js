import axios from "axios";

const BASE_URL = "https://miscellaneous-considering-variations-place.trycloudflare.com/api";

const api = axios.create({
  baseURL: BASE_URL,
});

export default api;
