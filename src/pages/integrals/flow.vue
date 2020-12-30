<template>
  <view class="container">
    <view
      class="masthead d-flex flex-column just-content-center align-items-center"
    >
      <view class="point-num">{{ pointNum }}</view>
      <view class="font-size-sm text-color-primary">查看积分规则</view>
    </view>
    <view>
      <list-cell
        v-for="(item, index) in pointsFlow"
        :key="index"
        :hover="false"
        bgcolor="#F5F9FB"
      >
        <view class="w-100 d-flex align-items-center">
          <view class="flex-fill d-flex flex-column">
            <view class="font-size-lg text-color-base mb-10">
              {{ item.reason }}
            </view>
            <view class="font-size-base text-color-assist">
              {{ item.createdAt }}
            </view>
          </view>
          <view class="d-flex flex-column align-items-center">
            <view class="font-size-lg text-color-base font-weight-bold">
              {{ item.changeType == 1 ? "+" : "-" }}{{ item.changeNum }}
            </view>
            <view class="font-size-sm text-color-assist">
              {{ item.sellerName }}
            </view>
          </view>
        </view>
      </list-cell>
    </view>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from 'vuex';
import ListCell from "@/components/list-cell/list-cell.vue";
import pointsFlow from "@/api/points-flow";

interface Data {
	pointNum: number;
	pointsFlow: unknown[];
}

export default {
  components: {
    ListCell,
  },
  data() {
    return {
      pointNum: 0, // 积分
      pointsFlow: [] // 积分详情数据
    };
	},
	computed: {
		...mapGetters(["userInfo"])
	},
  onLoad() {
    const userInfo = (this as any).userInfo;
    (this as any).pointNum = userInfo.pointNum;
    (this as any).pointsFlow = pointsFlow;
  },
};
</script>

<style lang="scss" scoped>
.masthead {
  height: 300rpx;
  position: relative;

  .point-num {
    font-size: 72rpx;
    color: $text-color-base;
  }

  &::after {
    content: "";
    position: absolute;
    border-bottom: 2rpx solid #e2e2e2;
    transform: scaleY(0.8);
    bottom: 0;
    right: 0;
    left: 0;
  }
}

.tui-list-cell:after {
  transform: scaleY(0.8);
}
</style>
