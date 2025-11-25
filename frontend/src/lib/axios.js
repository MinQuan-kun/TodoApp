import axios from "axios";

const BASE_URL = "https://modifications-pin-epinions-lid.trycloudflare.com/api";

const api = axios.create({
  baseURL: BASE_URL,
});

export default api;
