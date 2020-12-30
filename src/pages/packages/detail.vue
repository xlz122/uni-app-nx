<template>
  <view class="w-100 h-100">
    <image :src="packages.image" class="w-100" style="height: 50vh"></image>
    <view style="padding: 30rpx 40rpx; padding-bottom: 100rpx">
      <view
        class="d-flex justify-content-between align-items-center"
        style="margin-bottom: 20rpx"
      >
        <view class="font-size-lg">{{ packages.title }}</view>
        <view class="text-color-primary font-size-sm" @tap="purchaseRecords">购买记录</view>
      </view>
      <view class="text-color-assist font-size-sm" style="margin-bottom: 20rpx">
        共{{ couponNum }}张优惠券
      </view>
      <!-- 优惠券列表 begin -->
      <view class="d-flex flex-column w-100">
        <view
          class="coupon d-flex flex-column bg-white"
          v-for="(coupon, index) in packages.coupons"
          :key="index"
          @tap="openCouponDetailModal(coupon)"
        >
          <view
            class="d-flex flex-fill overflow-hidden"
            style="margin-bottom: 20rpx"
          >
            <image
              :src="coupon.detail.image"
              style="margin-right: 40rpx; width: 150rpx; height: 150rpx"
            ></image>
            <view
              class="flex-fill flex-column justify-content-start overflow-hidden"
            >
              <view class="text-right text-color-assist">
                x{{ coupon.coupon_num }}
              </view>
              <view
                class="text-truncate font-size-extra-lg text-color-base w-80"
              >
                {{ coupon.detail && coupon.detail.coupon_title }}
              </view>
              <view class="font-size-sm text-color-assist">
                {{ coupon.detail.expire }}
              </view>
            </view>
          </view>
          <view
            class="bottom d-flex font-size-sm justify-content-between align-items-center"
          >
            <view class="text-color-assist">
              使用时段：{{
                coupon.detail &&
                coupon.detail.coupon_use_time[0].use_time_start
              }}-{{
                coupon.detail && coupon.detail.coupon_use_time[0].use_time_end
              }}
            </view>
            <view class="text-color-primary"> 查看详情 </view>
          </view>
        </view>
      </view>
      <!-- 优惠券列表 end -->
      <view class="font-size-extra-lg" style="margin-bottom: 40rpx"
        >购买须知</view
      >
      <view class="font-size-base text-color-base">
        售卖时间：{{ packages.start_at && packages.start_at.split(" ")[0] }}~{{
          packages.end_at && packages.end_at.split(" ")[0]
        }}
      </view>
      <view class="font-size-base text-color-base" style="margin-bottom: 30rpx">
        购买限制：无限制
      </view>
      <view class="font-size-sm text-color-assist pre-line">
        {{ packages.content }}
      </view>
    </view>
    <view
      class="pay-box d-flex just-content-center align-items-center position-fixed fixed-bottom bg-white"
    >
      <button
        type="primary"
        class="pay-btn font-size-base text-color-white rounded-pill"
        style="width: 90%; height: 80rpx; line-height: 80rpx"
        @tap="pay"
      >
        ￥{{ packages.amount }}购买
      </button>
    </view>
    <modal
      custom
      :show="couponDetailModalShow"
      @cancel="closeCouponDetailModal"
    >
      <view class="d-flex flex-column">
        <view
          class="text-center font-size-extra-lg text-color-base"
          style="margin-bottom: 30rpx"
        >
          {{ coupon.detail && coupon.detail.coupon_title }}
        </view>
        <view
          class="text-center font-size-sm text-color-assist"
          style="margin-bottom: 40rpx"
        >
          {{ coupon.detail && coupon.detail.expire }}
        </view>
        <view class="text-color-assist font-size-sm pre-line">
          {{ coupon.detail && coupon.detail.desc }}
        </view>
      </view>
    </modal>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters, mapMutations } from "vuex";
import Modal from '@/components/modal/modal.vue';

interface Data {
  packages: unknown;
  coupon: unknown;
  couponDetailModalShow: boolean;
}

export default Vue.extend({
  components: {
    Modal
  },
  data() {
    return {
      packages: {}, // 优惠券列表数据
      coupon: {}, // 优惠券详情数据
      couponDetailModalShow: false // 优惠券详情弹框
    } as Data;
  },
  computed: {
    ...mapGetters(["isLogin", "userInfo", "cardVoucher"]),
    // 优惠卷数量
    couponNum() {
      if ((this as any).packages.coupons) {
        return (this as any).packages.coupons.reduce((acc: any, coupon: any) => acc + coupon.coupon_num, 0);
      }
      return 0;
    }
  },
  async onLoad() {
    // 获取本地卡券数据
    (this as any).packages = uni.getStorageSync('cardVoucher') || {};
  },
  methods: {
    ...mapMutations(['setCardVoucher', 'setCardVoucherNum', 'setSubtractBalance']),
    // 打开优惠券详情
		openCouponDetailModal(coupon: unknown): void {
			(this as any).coupon = coupon;
			(this as any).couponDetailModalShow = true;
    },
    // 关闭优惠券详情
		closeCouponDetailModal(): void {
			(this as any).couponDetailModalShow = false;
    },
    // 购买记录
    purchaseRecords(): void {
      uni.showToast({
        title: '购买记录',
        icon: 'none'
      })
    },
    // 购买
    pay(): boolean | undefined {
      // 是否登录
      if (!this.isLogin) {
        uni.navigateTo({
          url: '/pages/login/login'
        })
        return false;
      }
      // 余额是否足够
      if (Number(this.userInfo.balance) < Number((this as any).packages.amount)) {
        uni.showLoading({
          title: '购买中...'
        })
        setTimeout(() => {
          uni.showToast({
            title: '余额不足',
            icon: 'none'
          })
        }, 500);
        setTimeout(() => {
          uni.navigateTo({
            url: '/pages/balance/balance'
          })
        }, 1500);
        return false;
      }
      // 购买成功
      (this as any).setSubtractBalance(Number((this as any).packages.amount));
      uni.showLoading({
        title: '购买中...'
      })
      setTimeout(() => {
        uni.showToast({
          title: '购买成功',
          icon: 'success'
        });
        (this as any).handlePackages();
      }, 500);
      setTimeout(() => {
        uni.navigateTo({
          url: '/pages/coupons/coupons'
        })
      }, 1500);
    },
    // 处理卡券数据
    handlePackages(): void {
      const result: unknown[] = [];
      [(this as any).packages].forEach(item => {
        item.coupons.forEach((i: any) => {
          result.push({
            "couponExplain": i.detail.desc,
            "discountUnit": 1,
            "imageUrl": i.detail.image,
            "id": i.id,
            "discountAmount": null,
            "beginAt": "2020-05-10 00:00:00",
            "useTimeScope": "[{\"begin\":\"00:00:00\",\"end\":\"23:59:59\"}]",
            "endAt": item.end_at,
            "createdAt": item.created_at,
            "title": i.detail.title,
            "couponId": i.coupon_id,
            "deletedAt": item.deleted_at,
            "sellerName": "奈雪の茶",
            "updatedAt": item.updated_at,
            "couponType": i.detail.coupon_type,
            "couponNum": i.coupon_num
          })
        })
      });
      // 存储购买卡券
      const cardVoucher = JSON.parse(JSON.stringify((this as any).cardVoucher));
      result.forEach((item: any) => {
        cardVoucher.push(item);
      });
      (this as any).setCardVoucher(cardVoucher);
      // 更新卡券数量
      (this as any).setCardVoucherNum(result.length);
    }
	}
});
</script>

<style lang="scss" scoped>
.pay-box {
  padding: 10rpx 0;
  height: 100rpx;
}

.coupon {
  border-radius: 6rpx;
  padding: 20rpx 40rpx;
  margin-bottom: 40rpx;
  box-shadow: $box-shadow;
  position: relative;

  &::before {
    content: " ";
    position: absolute;
    background-color: $bg-color;
    width: 30rpx;
    height: 30rpx;
    bottom: 70rpx;
    left: -15rpx;
    border-radius: 100%;
  }

  &::after {
    content: " ";
    position: absolute;
    background-color: $bg-color;
    width: 30rpx;
    height: 30rpx;
    bottom: 70rpx;
    right: -15rpx;
    border-radius: 100%;
  }

  .bottom {
    height: 70rpx;
    position: relative;

    &::before {
      content: "";
      border-top: 2rpx dashed #e2e2e2;
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      transform: scaleY(0.2);
    }
  }
}
</style>
