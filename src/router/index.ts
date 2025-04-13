import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/chat',
    name: 'chat',
    component: () => import('@/views/ChatView.vue')
  },
  {
    path: '/new-chat',
    name: 'new-chat',
    component: () => import('@/views/NewChatView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 