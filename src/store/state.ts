import addresses from '@/api/addresses.ts';

export interface State {
  userInfo: unknown;
  cardVoucher: unknown[];
  store: unknown;
  orderType: string;
  address: unknown;
  addresses: unknown;
  order: unknown;
}

const state: State = {
  userInfo: {}, // 用户信息
  cardVoucher: [], // 卡券
  store: {}, // 菜单数据
  orderType: 'takein', // 订单类型
  address: {}, // 点餐页面展示地址
  addresses: addresses, // 收获地址
  order: {} // 订单数据
};

export default state;
