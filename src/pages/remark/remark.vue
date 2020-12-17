<template>
  <view class="container w-100 h-100 overflow-hidden">
    <view class="textarea">
      <textarea
        placeholder-class="text-color-assist font-size-base"
        v-model="remark"
        class="bg-white w-100 border-box font-size-base remark"
        :class="{
          'text-color-danger': remarkLength > 50,
          'text-color-assist': remarkLength <= 50,
        }"
        placeholder="请填写备注信息"
        focus
      />
      <view
        class="tips"
        :class="{
          'text-color-danger': remarkLength > 50,
          'text-color-assist': remarkLength <= 50,
        }"
      >
        {{ remarkLength }} / 50
      </view>
    </view>
    <view
      class="d-flex font-size-base text-color-assist"
      style="margin: 40rpx 0"
    >
      快捷输入
    </view>
    <view class="quick-inputs d-flex flex-wrap justify-content-start">
      <view
        class="quick-input"
        v-for="(item, index) in quickInputs"
        :key="index"
        @tap="handleQuickInput(item)"
      >
        {{ item }}
      </view>
    </view>
    <view
      class="d-flex just-content-center align-items-center"
      style="margin-top: 60rpx"
    >
      <button type="primary" class="submit-btn font-size-base" @tap="submit">
        完成
      </button>
    </view>
  </view>
</template>

<script lang="ts">
import Vue from "vue";

interface Data {
  remark: string;
  quickInputs: Array<string>;
}

export default Vue.extend({
  data() {
    return {
      remark: "", // 备注
      // 可选词
      quickInputs: [
        "请放门把手上",
        "请放门口",
        "请放前台桌上",
        "如地址封闭管理，请电话与我联系",
      ],
    } as Data;
  },
  onLoad({ remark }: { remark: string }) {
    this.remark = remark;
  },
  computed: {
    // 获取备注长度
    remarkLength() {
      return (this as any).remark.length;
    },
  },
  methods: {
    // 备注输入
    handleQuickInput(item: string) {
      this.remark = this.remark.concat(" ", item);
    },
    // 完成
    submit(): boolean | undefined {
      if ((this as any).remark.length > 50) {
        uni.showToast({
          title: "备注超过50个字",
          icon: "none",
        });
        return false;
      }
      uni.navigateTo({
        url: "/pages/pay/pay?remark=" + this.remark,
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.container {
  padding: 30rpx 40rpx;

  .textarea {
    position: relative;

    .remark {
      border-radius: 8rpx;
      padding: 30rpx 40rpx;
      height: 320rpx;
      color: $font-size-base;
    }

    .tips {
      position: absolute;
      bottom: 30rpx;
      right: 40rpx;
    }
  }

  .quick-inputs {
    padding-right: 20rpx;

    .quick-input {
      background-color: #ffffff;
      border: 2rpx solid $color-primary;
      color: $color-primary;
      font-size: $font-size-base;
      padding: 16rpx 26rpx;
      margin-right: 20rpx;
      margin-bottom: 20rpx;
    }
  }

  .submit-btn {
    width: 90%;
    height: 80rpx;
    border-radius: 40rpx;
    line-height: 80rpx;
  }
}
</style>
