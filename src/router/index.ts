import { createRouter, createWebHistory } from '@ionic/vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/pasar' },
  { path: '/pasar', component: () => import('../views/MarketPage.vue') },
];

export default createRouter({ history: createWebHistory(import.meta.env.BASE_URL), routes });
