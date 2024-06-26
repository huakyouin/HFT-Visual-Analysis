import 'element-plus/lib/theme-chalk/index.css';
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus';
// import axios from 'axios'


createApp(App)
.use(store)
.use(router)
// .use(axios)
.use(ElementPlus)
.mount('#app')
