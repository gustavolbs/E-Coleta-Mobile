import axios from "axios";

const api = axios.create({
  baseURL: "http://e-coleta-api.herokuapp.com/",
});

export default api;
