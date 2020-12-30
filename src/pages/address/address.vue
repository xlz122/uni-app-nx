<template>
  <view class="container">
    <view class="main">
      <view v-if="!addresses.length" class="no-address-tips">
        <view class="mb-30">暂无地址信息</view>
        <view>请点击底部按钮添加地址信息</view>
      </view>
      <template v-else>
        <swipe-action>
          <swipe-action-item
            class="address-wrapper"
            :options="swipeOption"
            @click="handleSwipeClick(address.id)"
            v-for="(address, index) in addresses"
            :key="index"
          >
            <view class="address" @tap="chooseAddress(address)">
              <view class="left flex-fill overflow-hidden mr-20">
                <view
                  class="font-size-lg font-weight-bold text-truncate"
                  style="margin-bottom: 10rpx"
                >
                  {{ address.street }}
                </view>
                <view class="font-size-sm text-color-assist">
                  {{ address.accept_name }}
                  {{ !address.gender ? "先生" : "女士" }} {{ address.mobile }}
                </view>
              </view>
              <image
                src="/static/images/edit.png"
                class="edit-icon"
                @tap.stop="edit(address)"
              ></image>
            </view>
          </swipe-action-item>
        </swipe-action>
      </template>
    </view>
    <view class="btn-box">
      <button type="primary" size="default" @tap="add">新增地址</button>
    </view>
    <view></view>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters, mapMutations } from "vuex";
import SwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue';
import SwipeActionItem from '@/components/uni-swipe-action-item/uni-swipe-action-item.vue';

interface Data {
  ischoose: boolean;
  scene: string;
  swipeOption: swipeOption[];
}

interface swipeOption {
  text: string;
  style: unknown;
}

export default Vue.extend({
	components: {
		SwipeAction,
		SwipeActionItem
	},
  data() {
    return {
      scene: "menu",
      ischoose: false, // 是否选择地址
      swipeOption: [
        {
          text: "删除",
          style: {
            backgroundColor: "#D12E32",
          },
        },
      ],
    } as Data;
  },
  computed: {
    ...mapGetters(["addresses"]),
  },
  /**
   * @param { String } scene - menu 点单进入，pay 支付进入
   */
  onLoad({ ischoose, scene }: { ischoose: boolean; scene: string }) {
    this.ischoose = ischoose || false;
    this.scene = scene || "menu";
  },
  methods: {
    ...mapMutations(["setAddress", "setOrderType", "setAddersses"]),
    // 新增地址
    add(): void {
      // 删除本地地址信息
      uni.removeStorageSync('editAddress');
      uni.navigateTo({
        url: "/pages/address/add",
      });
    },
    // 编辑地址
    edit(address: unknown): void {
      // 地址信息保存到本地
      uni.setStorageSync('editAddress', JSON.stringify(address));
      uni.navigateTo({
        url: `/pages/address/add`,
      });
		},
		// 地址删除(拖动删除)
    handleSwipeClick(id: number): void {
      uni.showModal({
        title: "提示",
        content: "确定要删除？",
        success: (res) => {
          if (res.confirm) {
            const index = this.addresses.findIndex((item: any) => item.id == id);
            const addresses = JSON.parse(JSON.stringify(this.addresses));
            addresses.splice(index, 1);
            this.setAddersses(addresses);
            uni.showToast({ title: "删除成功！", icon: "success" });
          }
        },
      });
    },
    // 地址选择
    chooseAddress(address: unknown): void {
      // 存储点餐页面用到的地址
      this.setAddress(address);
      // 点餐状态
      this.setOrderType("takeout");
      // 判断来自点餐页面还是支付页面
      if (this.scene === "menu") {
        uni.switchTab({
          url: "/pages/menu/menu",
        });
      } else {
        uni.navigateTo({
          url: "/pages/pay/pay",
        });
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
}

.main {
  width: 100%;
  padding: 30rpx;
  display: flex;
  flex-direction: column;
  padding-bottom: 100rpx;

  .address-wrapper {
    margin-bottom: 30rpx;
  }

  .address {
    width: 100%;
    padding: 40rpx 30rpx;
    background-color: #ffffff;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .right {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .edit-icon {
      width: 50rpx;
      height: 50rpx;
      flex-shrink: 0;
    }
  }
}

.btn-box {
  height: 100rpx;
  background-color: #ffffff;
  box-shadow: 0 0 20rpx rgba($color: $text-color-assist, $alpha: 0.1);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10rpx 0;
  display: flex;
  align-items: center;
  justify-content: center;

  button {
    height: 80rpx;
    width: 80%;
    border-radius: 50rem !important;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
