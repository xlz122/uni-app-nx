import Vue from 'vue';
import Vuex from 'vuex';
import state from '@/store/state';
import getters from '@/store/getters';
import mutations from '@/store/mutations';
import actions from '@/store/actions';

Vue.use(Vuex);

const store = new Vuex.Store({  
  state,
  getters,
  mutations,
  actions  
})

export default store;
