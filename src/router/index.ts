import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ChatView from '@/views/ChatView.vue'
import NewChatView from '@/views/NewChatView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/chat/:chatId?',
      name: 'chat',
      component: ChatView
    },
    {
      path: '/new-chat',
      name: 'new-chat',
      component: NewChatView
    }
  ]
})

export default router 