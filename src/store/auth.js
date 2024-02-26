import { useStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { computed } from "vue";
import { useRouter } from "vue-router";

export const useAuth = defineStore("auth", () => {
  const router = useRouter();
  const accessToken = useStorage("access_token", "");
  const check = computed(() => !!accessToken.value);

  function setAccessToken(value) {
    accessToken.value = value;
    if (value) {
      window.axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken.value}`;
      sessionStorage.setItem("access_token", accessToken.value);
    } else {
      delete window.axios.defaults.headers.common["Authorization"];
      sessionStorage.removeItem("access_token");
    }
  }

  function initializeSession() {
    const storedToken = sessionStorage.getItem("access_token");
    if (storedToken) {
      setAccessToken(storedToken);
    }
  }

  function login(accessToken, origin = "login") {
    setAccessToken(accessToken);

    if (origin === "login" || origin === "register") {
      return router.push({ name: "dashboard" });
    }
  }

  function destroyTokenAndSessionAndRedirectTo(routeName = "login") {
    setAccessToken(null);
    router.push({ name: routeName });
  }

  async function logout() {
    return window.axios.post("logout").finally(() => {
      destroyTokenAndSessionAndRedirectTo();
    });
  }
  initializeSession();
  return { login, logout, check, destroyTokenAndSessionAndRedirectTo };

});
