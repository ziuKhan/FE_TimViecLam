import './assets/main.css'
import Antd from 'ant-design-vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import 'ant-design-vue/dist/reset.css'
import './assets/ckeditor-reset.css'
import { CkeditorPlugin } from '@ckeditor/ckeditor5-vue'
import { vPermission } from './directives/permission'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Antd)
app.use(CkeditorPlugin)
app.directive('permission', vPermission)
app.mount('#app')
