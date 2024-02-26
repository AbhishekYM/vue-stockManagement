import { createRouter, createWebHistory } from 'vue-router';

function auth(to, from, next) {
  if (!localStorage.getItem("access_token")) {
    return next({ name: "login" });
  }
  next();
}

function guest(to, from, next) {
  if (localStorage.getItem("access_token")) {
    return next({ name: "dashboard" });
  }
  next();
}
function isUserLoggedIn() {
  return localStorage.getItem("access_token") !== null;
}
function token(to, from, next) {
  const resetToken = to.params.reset_token;
  axios
    .post("checkresettoken", { reset_token: resetToken })
    .then((response) => {
      if (response.data.exists) {
        next();
      } else {
        next({ name: "login" });
      }
    })
    .catch((error) => {
      next({ name: "login" });
    });
}

const home = () => import('../layouts/components/default.vue');

const routes = [
  { path: "/", redirect: "/dashboard", meta: { requiresAuth: true } ,component: home,

    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('../views/Dashboard.vue'),
        beforeEnter: auth,
      },
      {
        path: 'branchDetails',
        name: 'branchDetails',
        component: () => import('../views/Branch/index.vue'),
        beforeEnter: auth,
      },
      {
        path: 'stockDetails',
        name: 'stockDetails',
        component: () => import('../views/Stock/index.vue'),
        beforeEnter: auth,
      },
      {
        path: 'stockDetails/create',
        name: 'stockDetails.create',
        component: () => import('../views/Stock/create.vue'),
        beforeEnter: auth,
      },
    ],
  },
      {
        path: "/login",
        name: "login",
        meta: { requiresAuth: false },
        component: () => import("@/views/Login/login.vue"), 
        beforeEnter: guest,
      },
    
    ]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

window.addEventListener('storage', (event) => {
  if (event.key === 'access_token' && event.newValue === null) {
    alert('You have been logged out due to inactivity in another tab.');
    router.push({ name: 'login' });
  }
});

window.addEventListener('storage', (event) => {
  if (event.key === 'access_token' && event.newValue === 'true') {
    router.push({ name: 'dashboard' });
  }
});

export default router;
