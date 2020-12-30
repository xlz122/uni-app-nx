<template>
  <view class="container d-flex flex-column">
    <view class="flex-fill form">
      <list-cell :hover="false">
        <view class="form-input w-100 d-flex align-items-center">
          <view class="label">昵称</view>
          <view class="input flex-fill">
            <input
              type="text"
              placeholder="请填写昵称"
              placeholder-class="text-color-assist font-size-base"
              v-model="userInfo.nickname"
            />
          </view>
        </view>
      </list-cell>
      <list-cell :hover="false">
        <view class="form-input w-100 d-flex align-items-center">
          <view class="label">手机号码</view>
          <view class="input flex-fill">
            <input type="text" v-model="userInfo.mobilePhone" disabled />
          </view>
        </view>
      </list-cell>
      <list-cell :hover="false">
        <view class="form-input w-100 d-flex align-items-center">
          <view class="label">性别</view>
          <view class="input flex-fill">
            <view class="radio-group">
              <view
                class="radio"
                :class="{ checked: userInfo.gender == '1' }"
                style="margin-right: 10rpx"
                @tap="userInfo.gender = 1"
              >
                先生
              </view>
              <view
                class="radio"
                :class="{ checked: userInfo.gender == '2' }"
                @tap="userInfo.gender = 2"
              >
                女士
              </view>
            </view>
          </view>
        </view>
      </list-cell>
      <list-cell :hover="false" :arrow="!userInfo.birthday">
        <view class="form-input w-100 d-flex align-items-center">
          <view class="label">生日</view>
          <view class="input flex-fill">
            <picker
              mode="date"
              :value="date"
              :start="startDate"
              :end="endDate"
              v-if="!userInfo.birthday"
              @change="handleDateChange"
            >
              生日当天有惊喜
            </picker>
            <input type="text" v-else :value="userInfo.birthday" disabled />
          </view>
        </view>
      </list-cell>
      <list-cell :hover="false" last>
        <view class="form-input w-100 d-flex align-items-center">
          <view class="label">入会时间</view>
          <view class="input flex-fill">
            <input type="text" v-model="userInfo.openingCardDate" disabled />
          </view>
        </view>
      </list-cell>
    </view>
    <view class="btn-box d-flex align-items-center just-content-center">
      <button type="primary" class="save-btn" @tap="save">保存</button>
    </view>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import ListCell from "@/components/list-cell/list-cell.vue";

export default Vue.extend({
  components: {
    ListCell,
  },
  data() {
    return {
      date: (this as any).getDate({ format: true }),
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
    startDate() {
      return (this as any).getDate("start");
    },
    endDate() {
      return (this as any).getDate("end");
    },
  },
  methods: {
    // 获取格式化后的时间
    getDate(type: string): string {
      const date = new Date();
      let year: number | string = date.getFullYear();
      let month: number | string = date.getMonth() + 1;
      let day: number | string = date.getDate();

      if (type === "start") {
        year = year - 60;
      } else if (type === "end") {
        year = year + 2;
      }
      month = month > 9 ? month : "0" + month;
      day = day > 9 ? day : "0" + day;
      return `${year}-${month}-${day}`;
    },
    // 生日选择
    handleDateChange(e: any): void {
      this.userInfo.birthday = e.target.value;
    },
    // 保存
    save(): void {
      const userInfo = Object.assign(this.$store.state.userInfo, this.userInfo);
      this.$store.commit("setUserInfo", userInfo);
      uni.navigateBack({
        delta: 1
      });
    },
  },
});
</script>

<style lang="scss" scoped>
page {
  height: 100%;
}

.container {
  padding: 20rpx 30rpx;
}

.form {
  border-radius: 8rpx;
}

.form-input {
  .label {
    width: 160rpx;
    font-size: $font-size-base;
    color: $text-color-base;
  }

  .radio-group {
    display: flex;
    justify-content: flex-start;

    .radio {
      padding: 10rpx 30rpx;
      border-radius: 6rpx;
      border: 2rpx solid $text-color-assist;
      color: $text-color-assist;
      font-size: $font-size-base;

      &.checked {
        background-color: $color-primary;
        color: $text-color-white;
        border: 2rpx solid $color-primary;
      }
    }
  }
}

.btn-box {
  height: calc((100vh - 40rpx) / 2);
}

.save-btn {
  width: 90%;
  border-radius: 50rem !important;
  font-size: $font-size-lg;
}
</style>
