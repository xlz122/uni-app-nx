import { State } from '@/store/state';
import { Getters } from '@/store/getters';

interface Store {
  state: State;
  getters: Getters<State>;
  commit(type: string, payload: any): void;
  dispatch(type: string, payload: any): void;
}

interface Actions<T> {
  [key: string]: Action<T>
}

interface Action<T> {
  (state: Store, payload: any): void;
}

const actions: Actions<Store> = {
  setMsg({ commit }, msg: string) {
    commit('setMsg', msg);
  }
}

export default actions;
