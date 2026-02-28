import axios from "axios";

const AUTH_API = axios.create({
  baseURL: "https://api.chronosgallery.com/api/",
  // baseURL: "http://127.0.0.1:8000/api/",
});

export const loginAPI = (data) => AUTH_API.post("user/login/", data);

