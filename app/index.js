import Vue from 'vue'
import apolloProvider from './api'

import App from './App.vue'

const vm = new Vue({
  apolloProvider,
  el: '#app',
  render: h => h(App)
});

export default vm