import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'


// 导入插件
import request from './utils/request';

// 插件配置,返回函数；
const plugin = request({
  baseUrl: "https://www.uinav.com"
    // baseUrl: "https://api-ugo-web.itheima.net"
});

// 插件调用
Vue.use(plugin);




const app = new Vue({
  ...App
})
app.$mount()