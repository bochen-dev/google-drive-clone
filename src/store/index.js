import Vue from 'vue';
import Vuex from 'vuex';
import auth from './modules/auth';
import drive from './modules/drive';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    auth,
    drive,
  },
});
