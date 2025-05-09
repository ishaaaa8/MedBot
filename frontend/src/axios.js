import axios from "axios";

export const contextRequest = axios.create({
  baseURL: "http://localhost:5000/",
  withCredentials: true,
});