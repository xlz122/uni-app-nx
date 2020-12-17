import { State } from '@/store/state';

interface Mutations<T> {
  [key: string]: Mutation<T>;
}

interface Mutation<T> {
  (state: T, payload: any): void;
}

const mutations: Mutations<State> = {
  // 用户信息
  setUserInfo(state, userInfo: unknown) {
    state.userInfo = userInfo;
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
  // 购买卡券
  setCardVoucher(state, result: unknown[]) {
    result.forEach(item => {
      state.cardVoucher.push(item);
    })
  },
  setStore(state, store: unknown) {
    state.store = store;
  },
  // 订单类型
  setOrderType(state, orderType: string) {
    state.orderType = orderType;
  },
  // 订单
  setOrder(state, order: number) {
    state.order = order;
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
