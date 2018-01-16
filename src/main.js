// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyload from 'vue-lazyload'
import {currency} from './util/currency'
import axios from 'axios'
import vuex from 'vuex'

Vue.use(vuex)
Vue.prototype.$ajax=axios

Vue.config.productionTip = false

Vue.use(VueLazyload)

Vue.use(VueLazyload,{
  loading:"/static/loading-svg/loading-bars.svg"
})
Vue.filter('currency',currency)

var store=new vuex.Store({
  state:{
    cartCount:0
  },
  mutations:{
    updateCartcount(state,num){
      state.cartCount += num
    },
    initCartcount(state,num){
      state.cartCount = num
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
