import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/hi',
    name: 'HelloWorld',
    component: () => import ('../components/HelloWorld.vue')
  },{
    path: '/heatmap',
    name:'Heatmap',
    component: () => import('../components/Heatmap.vue')
  },{
    path: '/candlestick',
    name:'Candlestick',
    component: () => import('../components/Candlestick.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router