import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './index.css'  // Добавьте эту строку обратно

document.documentElement.setAttribute('data-theme', 'soviet-light');

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')