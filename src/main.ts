import Vue from 'vue';
import App from './App.vue';
import router from './router';
import Vuex from 'vuex';
import store from './store';
import VueSocketIOExt from 'vue-socket.io-extended';
import io from 'socket.io-client';
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUser, faUserGraduate, faCrown, faUserCircle, faCircleNotch, faChevronCircleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VueRx from 'vue-rx'

Vue.config.productionTip = false;
Vue.use(Vuex);

const socket = io.connect('https://the-quiz-flask-be.herokuapp.com/');

Vue.use(VueSocketIOExt, socket);

Vue.use(VueRx);

library.add(faUser, faUserGraduate, faCrown, faUserCircle, faCircleNotch, faChevronCircleRight)
 
Vue.component('font-awesome-icon', FontAwesomeIcon)

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
