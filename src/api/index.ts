// 菜单
import store from './store';
import goods from './goods';
// 订单
import orders from './orders';
// 个人信息
import member from './member';
// 卡券
import customerCoupons from './customer-coupons';
// 积分商城
import customPoints from './custom-points';
// 余额
import rechargeCards from './rechargeCards';
// 礼品卡
import giftCards from './gift-cards';
// 签到
import attendance from './attendance';
// 签到积分商品
import pointsMall from './points-mall';
// 券包
import packages from './packages';
// 签到
import todayAttendance from './today-attendance';

type Json = { [key: string]: any };

const json: Json = {
  store,
  goods,
  orders,
  member,
  customerCoupons,
  customPoints,
  rechargeCards,
  giftCards,
  attendance,
  pointsMall,
  packages,
  todayAttendance
};

export default (name: string) => new Promise(resolve => resolve(json[name]));
