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
                  class="text-right"
                  placeholder="请输入手机号码"
                  value="18666600000"
                />
              </view>
              <view class="contact-tip font-size-sm">自动填写</view>
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
          <list-cell last v-for="(item, index) in cart" :key="index">
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
                {{ item.props_text }}
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
// 订单数据，待优化，需改成数据拼接
import orders from "@/api/orders";

interface Data {
  payMode: string;
  cart: unknown[];
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
      payMode: "", // 支付方式
      cart: [], // 点餐数据
      form: {
        remark: "", // 备注
      },
      ensureAddressModalVisible: false, // 外卖地址弹框
      amountCount: 0, // 实付金额
    } as Data;
  },
  computed: {
    ...mapGetters(["userInfo", "orderType", "address", "store", "coupon"]),
    // 实际付的钱
    total() {
      return (this as any).cart.reduce(
        (acc: any, cur: any) => acc + cur.number * cur.price,
        0
      );
    },
    // 合计
    amount() {
      return (this as any).cart.reduce(
        (acc: any, cur: any) => acc + cur.number * cur.price,
        0
      );
    },
  },
  onLoad(option: any) {
    const { remark } = option;
    // 获取本地订单数据
    (this as any).cart = JSON.parse(uni.getStorageSync("cart"));
    // 备注
    remark && this.$set((this as any).form, "remark", remark);
  },
  onShow() {
    // 实付金额
    (this as any).amountCount = (this as any).cart.reduce(
      (acc: any, cur: any) => acc + cur.number * cur.price,
      0
    );
    // 支付方式
    if (this.userInfo.balance < (this as any).amountCount) {
      (this as any).payMode = "wechatPay";
    } else {
      (this as any).payMode = "balancePay";
    }
  },
  methods: {
    ...mapMutations(["setOrder"]),
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
    setPayMode(mode: string): boolean | undefined {
      if (mode === "balancePay") {
        // 余额不足，不可选择
        if (this.userInfo.balance < (this as any).amountCount) {
          return false;
        }
        (this as any).payMode = "balancePay";
      } else {
        (this as any).payMode = "wechatPay";
      }
    },
    // 付款
    submit(): void {
      if (this.orderType === "takeout") {
        (this as any).ensureAddressModalVisible = true;
      } else {
        (this as any).pay();
      }
    },
    pay(): boolean | undefined {
      // 微信支付时，跳转至充值
      if ((this as any).payMode === "wechatPay") {
        uni.showModal({
          title: "温馨提示",
          content: "暂时不支持微信支付，请前往充值",
          confirmText: "去充值",
          success(res) {
            if (res.confirm) {
              uni.navigateTo({
                url: '/pages/balance/balance'
              });
            }
          },
        });
        return false;
      } else {
        uni.showLoading({
          title: '加载中...'
        });
        setTimeout(() => {
          //测试订单
          let order = this.orderType == "takein" ? orders[0] : orders[1];
          order = Object.assign(order, { status: 1 });
          // 存储订单
          (this as any).setOrder(order);
          // 删除本地点餐数据
          uni.removeStorageSync("cart");
          // 跳转至订单
          uni.reLaunch({
            url: "/pages/take-foods/take-foods",
          });
          uni.hideLoading();
        }, 1500);
      }
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
