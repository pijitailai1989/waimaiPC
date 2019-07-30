import Vue from 'vue'
import App from './app'
import router from './router'
import store from './store'
import './global'
import VueI18n from 'vue-i18n'
import Vuelazyload from 'vue-lazyload'
import { setCookie, getCookie } from './utils';

Vue.use(VueI18n)
Vue.use(Vuelazyload, {
  loading: require('./assets/img/lazy_default.jpg')
})

Vue.config.productionTip = false
//i18n
let language = null, lang = null, messages = null;

if (getCookie('lang') === null) {

  if (navigator.appName == 'Netscape') {
    language = navigator.language;
  }
  else {
    language = navigator.browserLanguage;
  }
  if (language.indexOf('en') > -1) {
    setCookie('lang', 'en', 365);
  }
  else if (language.indexOf('zh') > -1) {
    setCookie('lang', 'zh', 365);
  }
  else {
    setCookie('lang', 'en', 365);
  }

  lang = getCookie('lang');
} else {
  lang = getCookie('lang');
}
switch (lang) {
  case 'zh':
    messages = require('@/assets/json/lang/zh.json')
    break;
  case 'en':
    messages = require('@/assets/json/lang/en.json')
    break;
}

const i18n = new VueI18n({
  locale: lang,
  messages: messages,
});
new Vue({
  router,
  store,
  template: '<App/>',
  components: { App },
  i18n
}).$mount('#app');
