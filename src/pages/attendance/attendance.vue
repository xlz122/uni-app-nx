<template>
  <view class="container">
    <navbar-back-button></navbar-back-button>
    <view class="header">
      <image src="/static/images/attendance/bg.png" mode="scaleToFill"></image>
      <view class="user-box">
        <view class="avatar">
          <image :src="userInfo.avatar"></image>
        </view>
        <view class="nickname">
          {{ userInfo.nickname }}
        </view>
        <view class="rule"> 签到规则 </view>
      </view>
    </view>
    <view style="padding: 0 30rpx">
      <view class="integral-box">
        <view class="title">当前积分</view>
        <view class="value">{{ userInfo.pointNum }}</view>
        <button
          type="primary"
          class="btn"
          :class="userInfo.isAttendance ? 'attendance-active-btn' : ''"
          @tap="attendance"
        >
          {{ attendanceText }}
        </button>
      </view>
      <!-- 为了方便演示，这里设置了startDate和enddate属性 -->
      <calendar
        :show-month="false"
        :start-date="startDate"
        :selected="attendanceList"
        :continuous="todayAttendance.attendance_continuity_day"
      >
      </calendar>
    </view>
    <modal custom :show="attendanceModalVisible">
      <view class="attendance-modal">
        <view class="modal-header">
          <image
            src="/static/images/attendance/cup.png"
            mode="widthFix"
          ></image>
        </view>
        <view
          class="modal-content d-flex align-items-center just-content-center flex-column font-size-sm text-color-base"
        >
          <view>赠送的1积分已发到您的账户中</view>
          <view>连续签到1天可额外获得1积分</view>
        </view>
        <view class="d-flex align-items-center just-content-center">
          <button
            type="primary"
            class="btn"
            @tap="attendanceModalVisible = false"
          >
            我知道了
          </button>
        </view>
      </view>
    </modal>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters, mapMutations } from "vuex";
import NavbarBackButton from "@/components/navbar-back-button.vue";
import Calendar from "@/pages/attendance/uni-calendar/calendar.vue";
import Modal from "@/components/modal/modal.vue";

interface Data {
  attendanceText: string;
  customPoints: unknown;
  attendanceModalVisible: boolean;
  todayAttendance: unknown;
  startDate: string;
  endDate: string;
}

export default Vue.extend({
  components: {
    NavbarBackButton,
    Calendar,
    Modal,
  },
  data() {
    return {
      attendanceText: "签到", // 签到/已签到
      customPoints: {},
      attendanceModalVisible: false, // 签到成功弹框
      attendanceList: [], // 日期数据
      todayAttendance: {},
      startDate: "", // 开始时间
      endDate: "", // 结束时间
    } as Data;
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  async onLoad() {
    (this as any).customPoints = await (this as any).$api("customPoints"),
    (this as any).attendanceList = await (this as any).$api("attendanceList");
    (this as any).todayAttendance = await (this as any).$api("todayAttendance");
    const date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth();
    (this as any).startDate = `${year}-${month}-01`;
  },
  methods: {
    ...mapMutations(["setIsAttendance", "setAddPointNum"]),
    // 签到
    attendance():boolean | undefined {
      if (this.userInfo.isAttendance) {
        return false;
      }
      (this as any).attendanceModalVisible = true;
      this.attendanceText = "已签到";
      this.setIsAttendance(true);
      // 积分增加
      this.setAddPointNum(1);
    },
  },
});
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  height: 33.333vh;
  position: relative;

  image {
    width: 100%;
    height: 100%;
  }

  .user-box {
    position: absolute;
    width: 100%;
    top: var(--status-bar-height);
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    color: #ffffff;

    .avatar {
      margin-left: 30rpx;
      background-color: #ffffff;
      padding: 6rpx;
      border-radius: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 20rpx;

      image {
        width: 100rpx;
        height: 100rpx;
        border-radius: 100%;
      }
    }

    .nickname {
      font-size: $font-size-lg;
      flex: 1;
    }

    .rule {
      font-size: $font-size-sm;
      border-radius: 50rem 0 0 50rem;
      background-color: rgba($color: #ffffff, $alpha: 0.3);
      padding: 10rpx 30rpx;
    }
  }
}

.integral-box {
  position: relative;
  background-color: #ffffff;
  border-radius: 8rpx;
  padding: 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: -70rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 0 20rpx rgba($color: #000000, $alpha: 0.1);

  .title {
    font-size: $font-size-sm;
    color: $text-color-base;
    margin: 20rpx 0 30rpx;
  }

  .value {
    font-size: 46rpx;
    font-weight: bold;
    margin-bottom: 30rpx;
  }

  .btn {
    font-size: $font-size-lg;
    color: #ffffff;
    border-radius: 50rem !important;
    width: 70%;
  }

  .attendance-active-btn {
    opacity: 0.65;
  }
}

// /deep/
.uni-calendar {
  margin-bottom: 30rpx;
  border-radius: 8rpx;
  box-shadow: 0 0 20rpx rgba($color: #000000, $alpha: 0.1);
}

.attendance-modal {
  .modal-header {
    width: 100%;
    margin-top: -180rpx;
    position: relative;

    image {
      width: 100%;
    }
  }

  .modal-content {
    height: 200rpx;
  }

  .btn {
    width: 100%;
    border-radius: 50rem;
    font-size: $font-size-lg;
  }
}
</style>
