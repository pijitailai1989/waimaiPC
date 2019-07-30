import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import qs from 'qs'
import router from '../router'
import {
  getCookie
} from '../utils'
import createPersistedState from 'vuex-persistedstate'
Vue.prototype.$http = axios

// 生产环境
// axios.defaults.baseURL = "https://loong.ph/waimai/";
// uat环境
// axios.defaults.baseURL = "https://uat.loong.ph/waimai/";
// 开发环境
axios.defaults.baseURL = "https://dev.loong.ph/waimai";
// 测试环境
// axios.defaults.baseURL = "https://sit.loong.ph/waimai/";
// 王成涛
// axios.defaults.baseURL = "192.168.0.168:8080";
// 曹骏
// axios.defaults.baseURL = "http://cao.loong.ph:8080";
// 王萌
// axios.defaults.baseURL = "http://wangmeng.loong.ph:8080";
// 曹俊
// axios.defaults.baseURL = 'http://caojun.loong.ph:8080'
axios.defaults.timeout = 5000
axios.defaults.withCredentials = true

console.log(axios.defaults.headers['Accept-Language']);
axios.interceptors.request.use((config) => {
  console.log(config.headers)
  sessionStorage.setItem('keyword', '');
  let lang = getCookie('lang')
  config.headers['Accept-Language'] = lang
  if (config.method === 'post') {
    config.data = qs.stringify(config.data)
  }
  return config
})
// http response 拦截器
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    let un_login = '';
    let re_login = '';
    if (getCookie('lang') == 'zh') {
      un_login = '您还未登录';
      re_login = '您的账号在其他设备登录'
    } else if (getCookie('lang') == 'en') {
      un_login = 'You have not logged in yet';
      re_login = 'Your account is logged in on other devices'
    }
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 返回 401 清除token信息并跳转到登录页面
          // store.commit(types.LOGOUT);
          console.log('1010210login', router.app.$store.state.user)
          if (router.app._route.name == 'home') return false
          if (router.app._route.name == 'place') return false
          if (router.app._route.name == 'search') return false
          if (router.app._route.name == 'seller-rate') return false
          if (router.app._route.name == 'seller-info') return false
          if (router.app._route.name == 'seller') return false
          Vue.prototype.$message({
            showClose: true,
            message: un_login,
            type: 'warning'
          });
          router.app.$store.state.user = null
          localStorage.removeItem('vuex')

          // {
          //   sessionStorage.setItem('isSeller', 1)
          // }
          console.log('021012', router.app)
          router.push('/account/login')
          break
        case 410:
          Vue.prototype.$message({
            showClose: true,
            message: re_login,
            type: 'warning'
          });
          router.push('/account/login');
          router.app.$store.state.user = null
          localStorage.removeItem('vuex')
      }
    }
    return Promise.reject(error.response.data) // 返回接口返回的错误信息
  });

Vue.use(Vuex)

import user from './user'
import seller from './seller'
import order from './order'
import { comment } from '../../node_modules/postcss';

export default new Vuex.Store({
  modules: {
    user,
    seller,
    order
  },
  plugins: [createPersistedState()]
})
