<template>
  <view class="container">
    <view class="tabbar">
      <view class="item" :class="{ active: !currentTab }" @tap="switchTab(0)"
        >购买礼品卡</view
      >
      <view class="item" :class="{ active: currentTab }" @tap="switchTab(1)"
        >我的礼品卡</view
      >
    </view>
    <swiper
      :duration="400"
      :disable-touch="true"
      class="swiper"
      :current="currentTab"
    >
      <!-- 购买礼品卡 begin -->
      <swiper-item
        class="swiper-item-1"
        @touchmove.stop="handleSwiperItemChange"
      >
        <scroll-view
          scroll-y="true"
          class="h-100"
          style="padding-bottom: 80rpx"
        >
          <image :src="giftCards.img" class="w-100" mode="widthFix" />
          <view class="pl-20 pr-20 mb-30">
            <view
              class="category-list mt-40"
              v-for="(category, index) in giftCards.category_list"
              :key="index"
            >
              <view class="font-size-lg font-weight-bold">{{
                category.name
              }}</view>
              <view class="themes-list">
                <view
                  class="theme"
                  v-for="(theme, key) in category.themesList"
                  :key="key"
                  @tap="giftCardPurchase(theme.activityName)"
                >
                  <image :src="theme.imageUrls" class="w-100" mode="widthFix" />
                  <view class="activity-name">{{ theme.activityName }}</view>
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
        <view class="footer">
          <view @tap="explain">购买须知</view>
          <view class="divider"></view>
          <view @tap="constitution">礼品卡章程</view>
        </view>
      </swiper-item>
      <!-- 购买礼品卡 end -->
      <!-- 我的礼品卡 begin -->
      <swiper-item
        class="swiper-item-2"
        @touchmove.stop="handleSwiperItemChange"
      >
        <view class="header">
          <view class="gift-card-types">
            <view
              class="item"
              :class="{ active: !giftCardType }"
              @tap="switchGiftCardType(0)"
              >可使用(0)</view
            >
            <view
              class="item"
              :class="{ active: giftCardType }"
              @tap="switchGiftCardType(1)"
              >不可使用(0)</view
            >
          </view>
          <view
            class="d-flex align-items-center text-color-primary"
            @tap="exchange"
          >
            兑换礼品卡
          </view
          >
        </view>
        <swiper
          :duration="400"
          class="flex-fill"
          :current="giftCardType"
          @change="(e) => switchGiftCardType(e.detail.current)"
        >
          <swiper-item>
            <template v-if="!myCards.length">
              <view class="d-flex flex-column align-items-center">
                <image
                  src="https://img-shop.qmimg.cn/s16/images/2020/01/11/c1214fe339279c49.png"
                  style="width: 300rpx; margin-top: 100rpx"
                  mode="widthFix"
                />
                <view class="font-size-sm text-color-assist"
                  >您暂时还没有礼品卡哦~</view
                >
              </view>
            </template>
          </swiper-item>
          <swiper-item>
            <template v-if="!myCards.length">
              <view class="d-flex flex-column align-items-center">
                <image
                  src="https://img-shop.qmimg.cn/s16/images/2020/01/11/c1214fe339279c49.png"
                  style="width: 300rpx; margin-top: 100rpx"
                  mode="widthFix"
                />
                <view class="font-size-sm text-color-assist"
                  >您暂时还没有礼品卡哦~</view
                >
              </view>
            </template>
          </swiper-item>
        </swiper>
        <view class="footer">
          <button type="primary" plain @tap="obtain">获取记录</button>
          <button type="primary" @tap="give">赠送记录</button>
        </view>
      </swiper-item>
      <!-- 我的礼品卡 end -->
    </swiper>
  </view>
</template>

<script lang="ts">
import Vue from "vue";

interface Data {
  giftCards: unknown;
  currentTab: number;
  giftCardType: number;
  myCards: never[];
}

export default Vue.extend({
  data() {
    return {
      giftCards: {}, // 礼品卡列表数据
      currentTab: 0, // 当前显示的tab
      giftCardType: 0, // 我的礼品卡 - 可用/不可用
      myCards: [] // 我的礼品卡列表数据
    } as Data;
  },
  onShow() {
    this.getListData();
  },
  onLoad({ type }: { type: string}) {
    // 结算页面进入
    if (type && type === 'pay') {
      this.currentTab = 1;
    }
  },
  methods: {
    // 获取礼品卡列表数据
    async getListData() {
      this.giftCards = await (this as any).$api('giftCards');
    },
    // tab切换
    switchTab(index: number): void {
      this.currentTab = index;
    },
    // 可使用不可使用 切换
    switchGiftCardType(index: number): void {
      this.giftCardType = index;
    },
    // 礼品卡购买
    giftCardPurchase(activityName: string) {
      uni.showToast({
        title: activityName,
        icon: 'none'
      });
    },
    // 购买须知
    explain() {
      uni.showToast({
        title: '暂无购买须知',
        icon: 'none'
      })
    },
    // 礼品卡章程
    constitution() {
      uni.showToast({
        title: '暂无礼品卡章程',
        icon: 'none'
      })
    },
    // 我的礼品卡
    handleSwiperItemChange() {
      return true;
    },
    // 兑换礼品卡
    exchange() {
      uni.showToast({
        title: '兑换礼品卡',
        icon: 'none'
      })
    },
    // 获取记录
    obtain() {
      uni.showToast({
        title: '暂时没有获取记录',
        icon: 'none'
      })
    },
    // 赠送记录
    give() {
      uni.showToast({
        title: '暂时没有赠送记录',
        icon: 'none'
      })
    }
  }
});
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
}

.tabbar {
  width: 100%;
  height: 100rpx;
  border-top: 1rpx solid $border-color;
  background-color: $text-color-white;
  display: flex;
  align-items: stretch;
  font-size: $font-size-lg;

  .item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    &.active {
      color: $color-primary;
      &:after {
        content: "";
        position: absolute;
        width: 40rpx;
        height: 10rpx;
        background-color: $color-primary;
        border-radius: 50rem !important;
        bottom: 0;
        left: calc((100% - 40rpx) / 2);
      }
    }
  }
}

.swiper {
  flex: 1;
}

.swiper-item-1 {
  height: 100%;

  .themes-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .theme {
      width: 340rpx;
      margin-top: 30rpx;
      border-radius: 24rpx;
      background-color: $text-color-white;
      display: flex;
      flex-direction: column;
      box-shadow: $box-shadow;

      image {
        border-radius: 24rpx 24rpx 0 0;
        max-height: 300rpx;
      }
    }

    .activity-name {
      font-size: $font-size-base;
      padding: 20rpx 0;
      text-align: center;
    }
  }

  .footer {
    z-index: 10;
    background-color: $bg-color;
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 80rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: $font-size-sm;
    color: $color-primary;

    .divider {
      height: 0.6rem;
      width: 4rpx;
      background-color: $color-primary;
      margin: 0 20rpx;
    }
  }
}

.swiper-item-2 {
  height: 100%;
  display: flex;
  flex-direction: column;

  .header {
    height: 110rpx;
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    padding: 30rpx;
    font-size: $font-size-sm;

    .gift-card-types {
      display: flex;
      align-items: stretch;

      .item {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 20rpx;

        &.active {
          background-color: #ffffff;
          box-shadow: $box-shadow;
          border-radius: 50rem !important;
          color: $color-primary;
        }
      }
    }
  }

  .footer {
    z-index: 10;
    background-color: $text-color-white;
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 100rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10rpx 40rpx;
    box-shadow: 0 -10rpx 10rpx rgba($color: #eee, $alpha: 0.1);

    button {
      width: 310rpx;
      height: 100%;
      line-height: 80rpx;
      border-radius: 50rem !important;
      font-size: $font-size-lg;
    }
  }
}
</style>
