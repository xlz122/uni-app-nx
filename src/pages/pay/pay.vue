<template>
  <view class="container position-relative">
    <view style="padding-bottom: 70rpx; margin-bottom: 130rpx">
      <view class="section-1">
        <template v-if="orderType === 'takein'">
          <list-cell class="location">
            <view
              class="flex-fill d-flex justify-content-between align-items-center"
            >
              <view class="store-name flex-fill">
                {{ store.name }}
              </view>
              <image src="/static/images/navigator-1.png" class="arrow"></image>
            </view>
          </list-cell>
        </template>
        <template v-else>
          <list-cell @click="chooseAddress">
            <view class="w-100 d-flex flex-column">
              <view
                class="d-flex align-items-center justify-content-between mb-10"
              >
                <view class="font-size-extra-lg text-color-base">{{
                  address.street
                }}</view>
                <image
                  src="/static/images/navigator-1.png"
                  class="arrow"
                ></image>
              </view>
              <view
                class="d-flex text-color-assist font-size-sm align-items-center"
              >
                <view class="mr-10">{{ address.accept_name }}</view>
                <view class="mr-10">{{ !address.sex ? "先生" : "女士" }}</view>
                <view>{{ address.mobile }}</view>
              </view>
            </view>
          </list-cell>
        </template>
        <template v-if="orderType == 'takein'">
          <list-cell arrow class="meal-time">
            <view
              class="flex-fill d-flex justify-content-between align-items-center"
            >
              <view class="title">取餐时间</view>
              <view class="time">立即用餐</view>
            </view>
          </list-cell>
          <list-cell class="contact" last :hover="false">
            <view
              class="flex-fill d-flex justify-content-between align-items-center"
            >
              <view class="title flex-fill">联系电话</view>
              <view class="time">
                <input
                  v-model="form.mobilePhone"
                  class="text-right"
                  placeholder="请输入手机号码"
                />
              </view>
              <view class="contact-tip font-size-sm" @tap="fillInPhone"
                >自动填写</view
              >
            </view>
          </list-cell>
        </template>
        <template v-else>
          <list-cell>
            <view class="w-100 d-flex flex-column">
              <view
                class="d-flex align-items-center font-size-base text-color-base"
              >
                <view class="flex-fill">预计送达时间</view>
                <view class="mr-10">15:18</view>
                <image
                  src="/static/images/navigator-1.png"
                  class="arrow"
                ></image>
              </view>
              <view class="font-size-base text-color-primary">
                特殊时期减少接触，请修改下方订单备注
              </view>
            </view>
          </list-cell>
        </template>
      </view>
      <!-- 购物车列表 begin -->
      <view class="section-2">
        <view class="cart d-flex flex-column">
          <list-cell last v-for="(item, index) in cartData" :key="index">
            <view class="w-100 d-flex flex-column">
              <view class="d-flex align-items-center mb-10">
                <view class="name-and-props overflow-hidden">
                  <view class="text-color-base font-size-lg">
                    {{ item.name }}
                  </view>
                </view>
                <view
                  class="d-flex flex-fill justify-content-between align-items-center text-color-base font-size-lg"
                >
                  <view>x{{ item.number }}</view>
                  <view>￥{{ item.price }}</view>
                </view>
              </view>
              <view class="text-truncate font-size-base text-color-assist">
                {{ item.props_text || "" }}
              </view>
            </view>
          </list-cell>
          <template v-if="orderType == 'takeout'">
            <list-cell last v-if="store.packing_fee > 0">
              <view
                class="w-100 d-flex font-size-base align-items-center justify-content-between"
              >
                <view>包装费</view>
                <view>￥{{ parseFloat(store.packing_fee) }}</view>
              </view>
            </list-cell>
            <list-cell last v-if="store.delivery_cost > 0">
              <view
                class="w-100 d-flex font-size-base align-items-center justify-content-between"
              >
                <view>配送费</view>
                <view>￥{{ parseFloat(store.delivery_cost) }}</view>
              </view>
            </list-cell>
          </template>
        </view>
        <list-cell arrow @click="goToPackages">
          <view
            class="flex-fill d-flex justify-content-between align-items-center"
          >
            <view class="text-color-base">奈雪券</view>
            <view class="text-color-primary">{{
              coupon.title || "超值购买优惠券大礼包"
            }}</view>
          </view>
        </list-cell>
        <list-cell arrow @click="goToGiftCard">
          <view
            class="flex-fill d-flex justify-content-between align-items-center"
          >
            <view class="text-color-base">礼品卡</view>
            <view class="text-color-primary">请选择</view>
          </view>
        </list-cell>
        <list-cell last>
          <view class="flex-fill d-flex justify-content-end align-items-center">
            <view>总计￥{{ total }}，实付</view>
            <view class="font-size-extra-lg font-weight-bold"
              >￥{{ amount }}</view
            >
          </view>
        </list-cell>
      </view>
      <!-- 购物车列表 end -->
      <view
        class="d-flex align-items-center justify-content-start font-size-sm text-color-warning"
        style="padding: 20rpx 0"
      >
        <view class="iconfont iconhelp line-height-100"></view>
        <view>优惠券不与满赠、满减活动共享</view>
      </view>
      <!-- 支付方式 begin -->
      <view class="payment">
        <list-cell last :hover="false">
          <text>支付方式</text>
        </list-cell>
        <list-cell @tap="setPayMode('balancePay')">
          <view
            class="d-flex align-items-center justify-content-between w-100 disabled"
          >
            <view
              class="iconfont iconbalance line-height-100 payment-icon"
            ></view>
            <view class="flex-fill"
              >余额支付（余额{{
                userInfo.balance > 0 ? userInfo.balance : 0
              }}）</view
            >
            <view class="font-size-sm">{{
              userInfo.balance > amount ? "" : "余额不足"
            }}</view>
            <view
              class="iconfont line-height-100 checkbox"
              :class="[
                payMode === 'balancePay'
                  ? 'iconradio-button-on checked'
                  : 'iconradio-button-off',
              ]"
            ></view>
          </view>
        </list-cell>
        <list-cell last @tap="setPayMode('wechatPay')">
          <view class="d-flex align-items-center justify-content-between w-100">
            <view
              class="iconfont iconwxpay line-height-100 payment-icon"
              style="color: #7eb73a"
            ></view>
            <view class="flex-fill">微信支付</view>
            <view
              class="iconfont line-height-100 checkbox"
              :class="[
                payMode === 'wechatPay'
                  ? 'iconradio-button-on checked'
                  : 'iconradio-button-off',
              ]"
            ></view>
          </view>
        </list-cell>
      </view>
      <!-- 支付方式 end -->
      <!-- 备注 begin -->
      <list-cell arrow last @click="goToRemark" style="margin-bottom: 25px">
        <view
          class="d-flex flex-fill align-items-center justify-content-between overflow-hidden"
        >
          <view class="flex-shrink-0 mr-20">备注</view>
          <view class="text-color-primary flex-fill text-truncate text-right">{{
            form.remark || "点击填写备注"
          }}</view>
        </view>
      </list-cell>
      <!-- 备注 end -->
    </view>
    <!-- 付款栏 begin -->
    <view
      class="w-100 pay-box position-fixed fixed-bottom d-flex align-items-center justify-content-between bg-white"
    >
      <view class="font-size-sm" style="margin-left: 20rpx">合计：</view>
      <view class="font-size-lg flex-fill">￥{{ amount }}</view>
      <view
        class="bg-primary h-100 d-flex align-items-center just-content-center text-color-white font-size-base"
        style="padding: 0 60rpx"
        @tap="submit"
      >
        付款
      </view>
    </view>
    <!-- 付款栏 end -->
    <modal
      :show="ensureAddressModalVisible"
      custom
      :mask-closable="false"
      :radius="'0'"
      width="90%"
    >
      <view class="modal-content">
        <view class="d-flex justify-content-end">
          <image
            src="/static/images/pay/close.png"
            style="width: 40rpx; height: 40rpx"
            @tap="ensureAddressModalVisible = false"
          ></image>
        </view>
        <view
          class="d-flex just-content-center align-items-center"
          style="margin-bottom: 40px"
        >
          <view class="font-size-extra-lg text-color-base"
            >请再次确认下单地址</view
          >
        </view>
        <view
          class="d-flex font-size-base text-color-base font-weight-bold align-items-center justify-content-between mb-20"
        >
          <view
            >{{ address.accept_name }} {{ address.sex ? "女士" : "先生" }}</view
          >
          <view>{{ address.mobile }}</view>
        </view>
        <view
          class="d-flex font-size-sm text-color-assist align-items-center justify-content-between mb-40"
          @tap="changeTakeoutAddress"
        >
          <view>{{ address.street + address.door_number }}</view>
          <button type="primary" size="mini" plain class="change-address-btn">
            修改地址
          </button>
        </view>
        <button type="primary" class="pay_btn" @tap="pay">确认并付款</button>
      </view>
    </modal>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters, mapMutations } from "vuex";
import ListCell from "@/components/list-cell/list-cell.vue";
import Modal from "@/components/modal/modal.vue";

interface Data {
  payMode: string;
  form: unknown;
  ensureAddressModalVisible: boolean;
  amountCount: number;
}

export default Vue.extend({
  components: {
    ListCell,
    Modal,
  },
  data() {
    return {
      payMode: "balancePay", // 支付方式
      form: {
        mobilePhone: "", // 手机号
        remark: "", // 备注
      },
      ensureAddressModalVisible: false, // 外卖地址弹框
      amountCount: 0, // 实付金额
    } as Data;
  },
  computed: {
    ...mapGetters([
      "userInfo",
      "orderType",
      "address",
      "store",
      "coupon",
      "cartData",
      "orderData"
    ]),
    // 实际付的钱
    total() {
      return (this as any).cartData.reduce(
        (acc: any, cur: any) => acc + cur.number * cur.price,
        0
      );
    },
    // 合计
    amount() {
      return (this as any).cartData.reduce(
        (acc: any, cur: any) => acc + cur.number * cur.price,
        0
      );
    },
  },
  onLoad(option: any) {
    // 手机号
    (this as any).form.mobilePhone = (this as any).userInfo.mobilePhone;
    // 备注
    const { remark } = option;
    remark && this.$set((this as any).form, "remark", remark);
  },
  onShow() {
    // 实付金额
    (this as any).amountCount = (this as any).cartData.reduce(
      (acc: any, cur: any) => acc + cur.number * cur.price,
      0
    );
  },
  methods: {
    ...mapMutations(["setSubtractBalance", "setOrder", "setOrderData", "setCartData"]),
    // 手机号 - 自动填写
    fillInPhone(): void {
      (this as any).form.mobilePhone = (this as any).userInfo.mobilePhone;
    },
    // 填写备注
    goToRemark(): void {
      uni.navigateTo({
        url: "/pages/remark/remark?remark=" + (this as any).form.remark,
      });
    },
    // 选择地址
    chooseAddress(): void {
      uni.navigateTo({
        url: "/pages/address/address?is_choose=true&scene=pay",
      });
    },
    // 修改外卖地址
    changeTakeoutAddress(): void {
      uni.navigateTo({
        url: "/pages/address/address?is_choose=true&scene=pay",
      });
    },
    // 选择奈雪券
    goToPackages(): void {
      uni.navigateTo({
        url: "/pages/coupons/coupons?scene=pay",
      });
    },
    // 选择礼品卡
    goToGiftCard(): void {
      uni.navigateTo({
        url: "/pages/giftcard/giftcard?type=pay",
      });
    },
    // 支付方式
    setPayMode(mode: string): void {
      if (mode === "balancePay") {
        (this as any).payMode = "balancePay";
      } else {
        (this as any).payMode = "wechatPay";
      }
    },
    // 付款
    submit(): boolean | undefined {
      // 验证手机号
      const reg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
      if (
        (this as any).form.mobilePhone &&
        !reg.test((this as any).form.mobilePhone)
      ) {
        uni.showToast({
          title: "请输入正确的手机号",
          icon: "none",
        });
        return false;
      }
      // 不可使用微信支付
      if ((this as any).payMode === "wechatPay") {
        uni.showModal({
          title: "温馨提示",
          content: "暂时不支持微信支付，请使用余额",
          showCancel: false,
        });
        return false;
      }
      // 余额不足，跳转至充值
      if (this.userInfo.balance < (this as any).amountCount) {
        uni.showModal({
          title: "温馨提示",
          content: "余额不足，请前往充值",
          confirmText: "去充值",
          success(res) {
            if (res.confirm) {
              uni.navigateTo({
                url: "/pages/balance/balance",
              });
            }
          },
        });
        return false;
      }
      // 堂食/外卖
      if (this.orderType === "takeout") {
        (this as any).ensureAddressModalVisible = true;
      } else {
        (this as any).pay();
      }
    },
    pay(): void {
      uni.showLoading({
        title: "加载中...",
      });
      setTimeout(() => {
        // 支付成功
        (this as any).setSubtractBalance(Number((this as any).amountCount));
        // 获取订单数据
        const order = (this as any).handleOrderData();
        // 存储订单
        (this as any).setOrder(order);
        // 添加到订单数据
        const orderData = JSON.parse(JSON.stringify((this as any).orderData));
        orderData.unshift(order);
        (this as any).setOrderData(orderData);
        uni.setStorageSync("orderData", orderData);
        // 删除点餐数据
        (this as any).setCartData([]);
        // 跳转至订单
        uni.reLaunch({
          url: "/pages/take-foods/take-foods",
        });
        uni.hideLoading();
      }, 1500);
    },
    // 订单数据
    handleOrderData(): unknown {
      const str = new Date().getTime().toString();

      // 订单号
      const order_no = `ABCDEFGHIJKLMN${str.substring(0, 4)}`;

      // 取餐号
      const sort_num = str.substring(str.length - 4);

      // 商品数量
      let goods_num = 0;

      // 点餐数据
      const goods = JSON.parse(JSON.stringify((this as any).cartData));
      goods.forEach((item: any) => {
        item.amount = (this as any).amountCount;
        item.originAmount = (this as any).amountCount;
        goods_num++;
      });

      return {
        amount: (this as any).amountCount, // 实付金额
        completed_at: 1588937139,
        completed_time: (this as any).formatDate(), // 下单时间
        coupon_amount: 0,
        coupon_name: "",
        created_at: 1608275942,
        discount: [],
        goods,
        goods_num,
        id: 1,
        invoice_status: 1,
        mobile: (this as any).form.mobilePhone, // 手机号
        multi_store: (this as any).store.name, // 店铺名
        order_no, // 订单号
        pay_mode:
          (this as any).payMode === "wechatPay" ? "微信支付" : "余额支付",
        pay_user_name: (this as any).userInfo.nickname, // 昵称
        payed_at: 1588936805,
        postscript: (this as any).orderType == "takein" ? "堂食" : "打包",
        productioned_time: (this as any).formatDate({ date: new Date().getTime() + 750000 }), // 制作完成时间
        receive_at: 0,
        remark: "",
        send_status: 0,
        sended_time: 0,
        sort_num, // 取餐号
        status: 1, // 制作进度
        status_text: "制作中",
        store: {
          address:
            "广东省深圳市宝安区深圳市宝安区福海街道宝安大道6259号 L1 层55/56号商铺",
          longitude: "113.804601",
          latitude: "22.678654",
          mobile: "075523224859",
          name: (this as any).store.name, // 店铺名
        },
        total_amount: "50.00",
        typeCate: 1,
        updated_at: 1588937139,
        user_name: (this as any).userInfo.nickname,
      };
    },
    /**
     * @desc 格式化日期字符串
     * @param { String } - [date = new Date()] 日期字符串：2020-01-14 13:43:23
     * @param { String } - [formatStr = 'yyyy-MM-dd HH:mm:ss'] 日期格式
     * @returns { String } 格式化后的日期字符串
     */
    formatDate(params: { date: any; formatStr: string }) {
      let defalutParams = {
        date: new Date(),
        formatStr: "yyyy-MM-dd HH:mm:ss",
      };
      params = { ...defalutParams, ...params };
      let date = params.date;
      let formatStr = params.formatStr;
      // 传入日期字符串 - 转成时间戳 - 转成标准时间
      let timeStamp = new Date(date).getTime();
      date = new Date(timeStamp);
      formatStr = formatStr.replace(
        new RegExp("yyyy"),
        `${date.getFullYear()}`
      );
      const month = date.getMonth() + 1;
      formatStr = formatStr.replace(
        new RegExp("MM"),
        `${month > 9 ? month : "0" + month}`
      );
      const day = date.getDate();
      formatStr = formatStr.replace(
        new RegExp("dd"),
        `${day > 9 ? day : "0" + day}`
      );
      const hour = date.getHours();
      formatStr = formatStr.replace(
        new RegExp("HH"),
        `${hour > 9 ? hour : "0" + hour}`
      );
      const min = date.getMinutes();
      formatStr = formatStr.replace(
        new RegExp("mm"),
        `${min > 9 ? min : "0" + min}`
      );
      const sec = date.getSeconds();
      formatStr = formatStr.replace(
        new RegExp("ss"),
        `${sec > 9 ? sec : "0" + sec}`
      );
      return formatStr;
    },
  },
});
</script>

<style lang="scss" scoped>
.container {
  padding: 30rpx;
}

.arrow {
  width: 50rpx;
  height: 50rpx;
  position: relative;
  margin-right: -10rpx;
}

.location {
  .store-name {
    font-size: $font-size-lg;
  }

  .iconfont {
    font-size: 50rpx;
    line-height: 100%;
    color: $color-primary;
  }
}

.section-1 {
  margin-bottom: 30rpx;
  .contact {
    .contact-tip {
      margin-left: 10rpx;
      border: 2rpx solid $color-primary;
      padding: 6rpx 10rpx;
      color: $color-primary;
    }
  }
}

.section-2 {
  .name-and-props {
    width: 65%;
  }
}

.payment {
  margin-bottom: 30rpx;

  .disabled {
    color: $text-color-grey;
  }

  .payment-icon {
    font-size: 44rpx;
    margin-right: 10rpx;
  }

  .checkbox {
    font-size: 36rpx;
    margin-left: 10rpx;
  }

  .checked {
    color: $color-primary;
  }
}

.pay-box {
  box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.1);
  height: 100rpx;
}

.modal-content {
  .change-address-btn {
    line-height: 2;
    padding: 0 1em;
  }
  .pay_btn {
    width: 100%;
    border-radius: 50rem !important;
    line-height: 3;
  }
}
</style>
