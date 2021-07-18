import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import InvestSettings from "../views/InvestSettings";

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/changeinvestment',
    name: 'ChangeInvestment',
    component: InvestSettings  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
