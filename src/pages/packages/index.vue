<template>
  <view class="container w-100 h-100" v-if="!loading">
    <view
      class="d-flex flex-column w-100"
      style="padding: 30rpx; padding-bottom: -34rpx; margin-bottom: 150rpx"
    >
      <view
        class="d-flex align-items-center bg-white"
        style="
          padding: 30rpx;
          height: 220rpx;
          margin-bottom: 34rpx;
          border-radius: 8rpx;
        "
        v-for="(item, index) in packages"
        :key="index"
        @tap="pay(item)"
      >
        <image
          :src="item.image"
          style="width: 200rpx; height: 160rpx; margin-right: 20rpx"
        ></image>
        <view
          class="d-flex flex-fill flex-column justify-content-between"
          style="height: 160rpx"
        >
          <view class="font-size-lg text-color-base">{{ item.title }}</view>
          <view class="d-flex justify-content-between align-items-center">
            <view class="font-size-sm">￥{{ item.amount }}</view>
            <button type="primary" size="mini" plain class="pay-btn">
              去购买
            </button>
          </view>
        </view>
      </view>
    </view>
    <view
      class="d-flex position-fixed bg-base fixed-bottom text-color-primary font-size-base align-items-center just-content-center w-100"
      style="height: 150rpx"
      @tap="purchaseRecords"
    >
      <text>购买记录</text>
    </view>
  </view>
  <loading v-else></loading>
</template>

<script lang="ts">
import Vue from "vue";
import Loading from "@/components/loading.vue";

interface Data {
  loading: boolean;
  packages: unknown[];
}

export default Vue.extend({
  components: {
    Loading,
  },
  data() {
    return {
      loading: true, // 加载loading
      packages: [], // 券包列表数据
    } as Data;
  },
  async onLoad() {
    await (this as any).getPackages();
  },
  // 上拉刷新
  async onPullDownRefresh() {
    await (this as any).getPackages();
  },
  methods: {
    // 获取券包列表
    async getPackages(): Promise<void> {
      this.loading = true;
      this.packages = await (this as any).$api("packages");
      this.loading = false;
      // 停止下拉刷新动画
      setTimeout(() => {
        uni.stopPullDownRefresh();
      }, 500);
    },
    // 购买
    pay(item: unknown): void {
      // 本地存储卡券数据
      uni.setStorageSync('cardVoucher', item);
      uni.navigateTo({
        url: '/pages/packages/detail'
      });
    },
    // 购买记录
    purchaseRecords(): void {
      uni.showToast({
        title: "购买记录",
        icon: "none",
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.container {
  padding-bottom: -150rpx;
}

.pay-btn {
  height: 50rpx;
  width: 120rpx;
  font-size: $font-size-sm;
  border-radius: 50rpx;
  padding: 0;
  line-height: 50rpx;
  text-align: center;
}
</style>
