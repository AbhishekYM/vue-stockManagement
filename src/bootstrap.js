import axios from "axios";
// import { useAuth } from "/src/store/auth";
import { useStore } from 'vuex';
window.axios = axios;

window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
window.axios.defaults.withCredentials = true;
window.axios.defaults.baseURL = 'http://127.0.0.1:8000/api/';
window.axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 300) {
      const auth = useStore();
      auth.destroyTokenAndSessionAndRedirectTo();
    }
    return Promise.reject(error);
  }
);

if (localStorage.getItem("access_token")) {
  window.axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${localStorage.getItem("access_token")}`;
}
