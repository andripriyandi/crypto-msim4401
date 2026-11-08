import { createRouter, createWebHistory } from '@ionic/vue-router';
import type { RouteRecordRaw } from 'vue-router';

// Remove fragments left by the previous hash router before Vue reads the URL.
if (/^#\/(?:home|pasar)?\/?$/.test(window.location.hash)) {
  window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search);
}

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/home/' },
  { path: '/home/', component: () => import('../views/MarketPage.vue') },
];

export default createRouter({ history: createWebHistory(import.meta.env.BASE_URL), routes });
