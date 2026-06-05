import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    component: () => import("../layouts/defaultLayout.vue"),
    children: [
      {
        path: "/",
        name: "main",
        component: () => import("../pages/main/index.vue"),
      },
      {
        path: ":CatchAll(.*)",
        name: "404",
        component: () => import("../pages/404NotFound.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth",
      };
    } else {
      return { top: 0 };
    }
  },
});

export default router;
