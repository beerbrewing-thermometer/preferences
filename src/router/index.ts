import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/display",
  },
  {
    path: "/display",
    name: "Display Settings | Beerbrewing Thermometer",
    component: () => import("@/views/settings/DisplaySettings.vue"),
  },
  {
    path: "/wifi",
    name: "Wifi Settings | Beerbrewing Thermometer",
    component: () => import("@/views/settings/WifiSettings.vue"),
  },
  {
    path: "/time",
    name: "Time Settings | Beerbrewing Thermometer",
    component: () => import("@/views/settings/TimeSettings.vue"),
  },
  {
    path: "/firebase",
    name: "Firebase Settings | Beerbrewing Thermometer",
    component: () => import("@/views/settings/FirebaseSettings.vue"),
  },
  {
    path: "/:catchAll(.*)",
    name: "Not Found | Beerbrewing Thermometer",
    component: () => import("@/views/not-found/NotFound.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.name) {
    document.title = to.name.toString();
  }
  next();
});
export default router;
