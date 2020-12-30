<template>
  <view class="container" v-if="!loading">
    <view class="main" v-if="goods.length">
      <view class="nav">
        <view class="header">
          <view class="left" v-if="orderType == 'takein'" @tap="getPosition">
            <view class="store-name">
              <text>{{ store.name }}</text>
              <view class="iconfont iconarrow-right"></view>
            </view>
            <view class="store-location">
              <image
                src="/static/images/order/location.png"
                style="width: 30rpx; height: 30rpx"
                class="mr-10"
              ></image>
              <text>距离您 {{ store.distance_text }}</text>
            </view>
          </view>
          <view class="left overflow-hidden" v-else @tap="getPosition">
            <view class="d-flex align-items-center overflow-hidden">
              <image
                src="/static/images/order/location.png"
                style="width: 30rpx; height: 30rpx"
                class="mr-10"
              ></image>
              <view
                class="font-size-extra-lg text-color-base font-weight-bold text-truncate"
              >
                {{ address.street }}
              </view>
            </view>
            <view
              class="font-size-sm text-color-assist overflow-hidden text-truncate"
            >
              由
              <text
                class="text-color-base"
                style="margin: 0 10rpx"
                :selectable="false"
              >
                {{ store.name }}
              </text
              >配送
            </view>
          </view>
          <view class="right">
            <view
              class="dinein"
              :class="{ active: orderType == 'takein' }"
              @tap="setOrderType('takein')"
            >
              <text>自取</text>
            </view>
            <view
              class="takeout"
              :class="{ active: orderType == 'takeout' }"
              @tap="takout"
            >
              <text>外卖</text>
            </view>
          </view>
        </view>
        <view class="coupon">
          <text class="title" :selectable="false">
            "霸气mini卡"超级购券活动，赶紧去购买
          </text>
          <view class="iconfont iconarrow-right"></view>
        </view>
      </view>
      <!-- content begin -->
      <scroll-menu :goods="goods" />
      <!-- content end -->
      <!-- 购物车栏 begin -->
      <view class="cart-box" v-if="cartData.length > 0">
        <view class="mark">
          <image
            src="/static/images/menu/cart.png"
            class="cart-img"
            @tap="openCartPopup"
          ></image>
          <view class="tag">{{ getCartGoodsNumber }}</view>
        </view>
        <view class="price">￥{{ getCartGoodsPrice }}</view>
        <button
          type="primary"
          class="pay-btn"
          @tap="toPay"
          :disabled="disabledPay"
        >
          {{ disabledPay ? `差${spread}元起送` : "去结算" }}
        </button>
      </view>
      <!-- 购物车栏 end -->
    </view>
    <!-- 购物车详情popup -->
    <popup-layer
      direction="top"
      :show-pop="cartPopupVisible"
      class="cart-popup"
    >
      <template slot="content">
        <view class="top">
          <text @tap="handleCartClear">清空</text>
        </view>
        <scroll-view class="cart-list" scroll-y>
          <view class="wrapper">
            <view class="item" v-for="(item, index) in cartData" :key="index">
              <view class="left">
                <view class="name">{{ item.name }}</view>
                <view class="props">{{ item.props_text }}</view>
              </view>
              <view class="center">
                <text>￥{{ item.price }}</text>
              </view>
              <view class="right">
                <button
                  type="default"
                  plain
                  size="mini"
                  class="btn"
                  hover-class="none"
                  @tap="handleCartItemReduce(index)"
                >
                  <view class="iconfont iconsami-select"></view>
                </button>
                <view class="number">{{ item.number }}</view>
                <button
                  type="primary"
                  class="btn"
                  size="min"
                  hover-class="none"
                  @tap="handleCartItemAdd(index)"
                >
                  <view class="iconfont iconadd-select"></view>
                </button>
              </view>
            </view>
            <view
              class="item"
              v-if="orderType == 'takeout' && store.packing_fee"
            >
              <view class="left">
                <view class="name">包装费</view>
              </view>
              <view class="center">
                <text>￥{{ parseFloat(store.packing_fee) }}</text>
              </view>
              <view class="right invisible">
                <button
                  type="default"
                  plain
                  class="btn"
                  hover-class="none"
                >
                  <view class="iconfont iconsami-select"></view>
                </button>
                <view class="number">1</view>
                <button
                  type="primary"
                  class="btn"
                  hover-class="none"
                >
                  <view class="iconfont iconadd-select"></view>
                </button>
              </view>
            </view>
          </view>
        </scroll-view>
      </template>
    </popup-layer>
    <!-- 购物车详情popup -->
  </view>
  <view class="loading" v-else>
    <image src="/static/images/loading.gif"></image>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import { chooseLocation } from "@/common/map";
import ScrollMenu from "./scrollMenu.vue";
import Modal from "@/components/modal/modal.vue";
import PopupLayer from "@/components/popup-layer/popup-layer.vue";

interface Data {
  loading: boolean;
  goods: unknown[];
  cartPopupVisible: boolean;
}

export default Vue.extend({
  components: {
    ScrollMenu,
    Modal,
    PopupLayer,
  },
  data() {
    return {
      loading: true,
      goods: [], // 商品数据
      cartPopupVisible: false, // 购物车列表
    } as Data;
  },
  computed: {
    ...mapGetters(["isLogin", "orderType", "address", "store", "cartData"]),
    //计算购物车总数
    getCartGoodsNumber() {
      return this.cartData.reduce((acc: any, cur: any) => acc + cur.number, 0);
    },
    //计算购物车总价
    getCartGoodsPrice() {
      return this.cartData.reduce(
        (acc: any, cur: any) => acc + cur.number * cur.price,
        0
      );
    },
    //是否达到起送价
    disabledPay() {
      return this.orderType == "takeout" &&
        (this as any).getCartGoodsPrice < this.store.min_price
        ? true
        : false;
    },
    // 差多少元起送
    spread() {
      if (this.orderType != "takeout") return;
      return parseFloat(
        (this.store.min_price - (this as any).getCartGoodsPrice).toFixed(2)
      );
    },
  },
  async onLoad() {
    await (this as any).init();
  },
  methods: {
    ...mapMutations(["setStore", "setOrderType", "setCartData"]),
    // 页面初始化
    async init(): Promise<void> {
      (this as any).loading = true;
      // 存储地址
      const store = await (this as any).$api("store");
      (this as any).setStore(store);
      // 获取商品数据
      (this as any).goods = await (this as any).$api("goods");
      (this as any).loading = false;
    },
    // 获取位置
    getPosition() {
      chooseLocation();
    },
    // 自取/外卖切换
    takout(): boolean | undefined {
      // 自取不跳转地址选择
      if (this.orderType == "takeout") return false;

      if (!this.isLogin) {
        uni.navigateTo({ url: "/pages/login/login" });
        return false;
      }

      uni.navigateTo({
        url: "/pages/address/address?is_choose=true",
      });
    },
    // 打开/关闭购物车列表popup
    openCartPopup() {
      (this as any).cartPopupVisible = !(this as any).cartPopupVisible;
    },
    // 购物车单个商品数量增加
    handleCartItemAdd(index: number) {
      const cartData = JSON.parse(JSON.stringify(this.cartData));
      cartData[index].number += 1;
      (this as any).setCartData(cartData);
    },
    // 购物车单个商品数量减少
    handleCartItemReduce(index: number) {
      const cartData = JSON.parse(JSON.stringify(this.cartData));
      if (cartData[index].number === 1) {
        cartData.splice(index, 1);
      } else {
        cartData[index].number -= 1;
      }
      if (!cartData.length) {
        (this as any).cartPopupVisible = false;
      }
      (this as any).setCartData(cartData);
    },
    // 清空购物车
    handleCartClear() {
      uni.showModal({
        title: "提示",
        content: "确定清空购物车么",
        success: ({ confirm }) => {
          if (confirm) {
            (this as any).cartPopupVisible = false;
            (this as any).setCartData([]);
          }
        },
      });
    },
    // 去结算
    toPay(): boolean | undefined {
      if (!this.isLogin) {
        uni.navigateTo({ url: "/pages/login/login" });
        return false;
      }

      uni.navigateTo({
        url: "/pages/pay/pay",
      });
    },
  },
});
</script>

<style lang="scss" scoped>
@import "~@/pages/menu/menu.scss";
// 支付宝小程序，ui组件作为父class，样式会失效
.top {
  background-color: $bg-color-primary;
  color: $color-primary;
  padding: 10rpx 30rpx;
  font-size: 24rpx;
  text-align: right;
}
.cart-list {
  background-color: #FFFFFF;
  width: 100%;
  overflow: hidden;
  min-height: 1vh;
  max-height: 60vh;
  .wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 0 30rpx;
    margin-bottom: 156rpx;
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 30rpx 0;
      position: relative;
      &::after {
        content: ' ';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        background-color: $border-color;
        height: 2rpx;
        transform: scaleY(.6);
      }
      .left {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        margin-right: 30rpx;
        .name {
          font-size: $font-size-sm;
          color: $text-color-base;
        }
        .props {
          color: $text-color-assist;
          font-size: 24rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .center {
        margin-right: 120rpx;
        font-size: $font-size-base;
      }
      .right {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .btn {
          width: 46rpx;
          height: 46rpx;
          border-radius: 100%;
          padding: 0;
          text-align: center;
          line-height: 46rpx;
        }
        .number {
          font-size: $font-size-base;
          width: 46rpx;
          height: 46rpx;
          text-align: center;
          line-height: 46rpx;
        }
      }
    }
  }
}
</style>
