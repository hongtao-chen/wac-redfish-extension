import Vue from 'vue'
import VueRouter from 'vue-router'

import DeviceOverview from './components/device-overview.vue'
import AddConnection from './components/add-connection.vue'

import wac from './wac'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '', component: DeviceOverview, props: { shell: wac } },
    { path: '/add', component: AddConnection, props: { shell: wac } }
  ]
})

new Vue({
  el: '#app',
  router,
  mounted () {
    wac.register(data => router.push(data.path))
  },

  destroyed () {
    wac.unregister()
  }
})