import addresses from '@/api/addresses.ts';

export interface State {
  cartData: unknown;
  store: unknown;
  userInfo: unknown;
  cardVoucher: unknown[];
  coupon: unknown;
  orderType: string;
  address: unknown;
  addresses: unknown;
  order: unknown;
}

const state: State = {
  cartData: [], // 购物车数据
  store: {}, // 地址数据
  userInfo: {}, // 用户信息
  cardVoucher: uni.getStorageSync("customerCoupons") || [], // 卡券
  coupon: {}, // 单张卡券数据
  orderType: 'takein', // 订单类型
  address: {}, // 点餐页面展示地址
  addresses: addresses, // 收获地址
  order: {} // 订单数据
};

export default state;
