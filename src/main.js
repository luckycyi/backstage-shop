import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import './plugins/element.js'

// 引入全局样式表
import './assets/css/global.css'

// 引入字体图标样式
import './assets/fonts/iconfont.css'

// 导入插件树形表格插件
import TreeTable from 'vue-table-with-tree-grid'

// 引入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器对应样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 引入axios跨域
import axios from 'axios'
// 配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios

// // 添加一个请求拦截器
axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

Vue.config.productionTip = false

// 注册树形表格全局组件
Vue.component('tree-table', TreeTable)

// 挂载富文本编辑器，注册文全局组件
Vue.use(VueQuillEditor)

// 全局时间过滤
Vue.filter('format', function (value, arg) {
  function dateFormat(date, format) {
    if (typeof date === 'string') {
      var mts = date.match(/(\/Date\((\d+)\)\/)/)
      if (mts && mts.length >= 3) {
        date = parseInt(mts[2])
      }
    }
    date = new Date(date)
    if (!date || date.toUTCString() === 'Invalid Date') {
      return ''
    }
    var map = {
      M: date.getMonth() + 1, // 月份
      d: date.getDate(), // 日
      h: date.getHours(), // 小时
      m: date.getMinutes(), // 分
      s: date.getSeconds(), // 秒
      q: Math.floor((date.getMonth() + 3) / 3), // 季度
      S: date.getMilliseconds() // 毫秒
    }

    format = format.replace(/([yMdhmsqS])+/g, function (all, t) {
      var v = map[t]
      if (v !== undefined) {
        if (all.length > 1) {
          v = '0' + v
          v = v.substr(v.length - 2)
        }
        return v
      } else if (t === 'y') {
        return (date.getFullYear() + '').substr(4 - all.length)
      }
      return all
    })
    return format
  }
  return dateFormat(value, arg)
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
