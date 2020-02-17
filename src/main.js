import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router/index'
import axios from 'axios'
import moment from 'moment'

// 使用插件
Vue.use(ElementUI)

Vue.config.productionTip = false

// -------------axios优化-------------
axios.defaults.baseURL = 'http://localhost:3000'
Vue.prototype.$axios = axios

// -------------moment过滤器----------
Vue.filter('time', function (input) {
  return moment(input).format('YYYY-MM-DD')
})

// 给Vue原型添加一个方法,用于图片的url的处理
Vue.prototype.$fixUrl = function (url) {
  // 如果URL地址以http开头,不处理
  if (url.startsWith('http')) {
    return url
  } else {
    return axios.defaults.baseURL + url
  }
}

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
