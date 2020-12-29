import { State } from '@/store/state';

interface Mutations<T> {
  [key: string]: Mutation<T>;
}

interface Mutation<T> {
  (state: T, payload: any): void;
}

const mutations: Mutations<State> = {
  // 购物车数据
  setCartData(state, cartData: string) {
    state.cartData = cartData;
  },
  setStore(state, store: unknown) {
    state.store = store;
  },
  // 用户信息
  setUserInfo(state, userInfo: unknown) {
    state.userInfo = userInfo;
  },
  // 更换头像
  setAvatar(state, avatar: string) {
    (state.userInfo as any).avatar = avatar;
  },
  // 是否签到
  setIsAttendance(state, isAttendance: boolean) {
    (state.userInfo as any).isAttendance = isAttendance;
  },
  // 我的 - 卡券数量
  setCardVoucherNum(state, couponNum: number) {
    (state.userInfo as any).couponNum += couponNum;
  },
  // 我的 - 增加积分
  setAddPointNum(state, pointNum: number) {
    (state.userInfo as any).pointNum += pointNum;
  },
  // 我的 - 减少积分
  setReducePointNum(state, pointNum: number) {
    (state.userInfo as any).pointNum -= pointNum;
  },
  // 卡券
  setCardVoucher(state, cardVoucher: unknown[]) {
    state.cardVoucher = cardVoucher;
  },
  // 单张卡券
  setCoupon(state, coupon: unknown[]) {
    state.coupon = coupon;
  },
  // 订单类型
  setOrderType(state, orderType: string) {
    state.orderType = orderType;
  },
  // 订单
  setOrder(state, order: number) {
    state.order = order;
  },
  // 订单添加
  setOrderData(state, orderData: unknown) {
    state.orderData = orderData;
  },
  // 点餐页面地址
  setAddress(state, address: unknown) {
    state.address = address;
  },
  // 收获地址
  setAddersses(state, addresses: unknown) {
    state.addresses = addresses;
  },
  // 账户余额充值
  setAddBalance(state, balance: number) {
    (state.userInfo as any).balance += balance;
  },
  // 账户余额消费
  setSubtractBalance(state, balance: number) {
    (state.userInfo as any).balance -= balance;
  }
}

export default mutations;
