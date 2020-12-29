import { State } from '@/store/state';

export interface Getters<T> {
  [key: string]: (state: T) => any;
}

const getters: Getters<State> = {
  cartData: state => state.cartData,
  store: state => state.store,
  userInfo: state => state.userInfo,
  isLogin: state => Object.keys((state as any).userInfo).length > 0 ? true : false, // 是否登录
  cardVoucher: state => state.cardVoucher,
  coupon: state => state.coupon,
  orderType: state => state.orderType,
  address: state => state.address,
  addresses: state => state.addresses,
  order: state => state.order,
  orderData: state => state.orderData
}

export default getters;
