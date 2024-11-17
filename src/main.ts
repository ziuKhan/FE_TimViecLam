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
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import { ConfigProvider } from 'ant-design-vue'
import locale from 'ant-design-vue/es/locale/vi_VN'

dayjs.locale('vi')

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Antd)
app.use(CkeditorPlugin)
app.directive('permission', vPermission)
app.component('ConfigProvider', ConfigProvider)
app.mount('#app')
