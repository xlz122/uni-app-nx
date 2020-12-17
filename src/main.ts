import Vue from 'vue';
import App from './App.vue';
import api from '@/api';
import * as util from '@/common/util.ts';
import store from '@/store';
// 全局分享
import share from '@/common/share';
Vue.mixin(share);

Vue.config.productionTip = false;
Vue.prototype.$api = api;
Vue.prototype.$util = util;
Vue.prototype.$store = store;

new App({
  store,
  ...App
}).$mount();
