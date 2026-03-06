import axios from "axios";

const AUTH_API = axios.create({
  baseURL: "https://apiv2.chronosgallery.com/api/admin/",
  // baseURL: "http://127.0.0.1:8000/api/",
});

export const loginAPI = (data) => AUTH_API.post("adminlogin/", data);
