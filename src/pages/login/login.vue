<template>
  <view class="container">
    <view class="intro">
      <image src="/static/images/logo.png"></image>
      <view class="tips">
        一杯好茶，一口软欧包
        <br />
        在奈雪遇见两种美好
      </view>
    </view>
    <view class="bottom">
      <!-- #ifdef H5 -->
      <button type="primary" size="default" class="login-btn" @tap="login">
        登录
      </button>
      <!-- #endif -->
      <!-- #ifdef APP-PLUS -->
      <button type="primary" size="default" class="login-btn" @tap="login">
        登录
      </button>
      <!-- #endif -->
      <!-- #ifdef MP-WEIXIN -->
      <button
        type="primary"
        size="default"
        class="login-btn"
        open-type="getUserInfo"
        lang="zh_CN"
        @getuserinfo="getUserInfo"
      >
        <image src="/static/images/mine/wechat.png"></image>
        微信一键登录
      </button>
      <!-- #endif -->
      <!-- #ifdef MP-ALIPAY -->
      <button
        type="primary"
        size="default"
        class="login-btn"
        @getAuthorize="onGetAuthorize"
        @error="onAuthError" 
        scope="userInfo"
        open-type="getAuthorize"
      >
        支付宝一键登录
      </button>
      <!-- #endif -->
      <view
        class="d-flex flex-column justify-content-evenly align-items-center text-center"
        style="height: 30vh"
      >
        <view class="w-100 font-size-base text-color-assist"
          >新用户登录即加入会员，享会员权益</view
        >
        <view
          class="w-100 row d-flex just-content-around align-items-center font-size-sm text-color-assist"
        >
          <view class="grid">
            <image src="/static/images/mine/rhyl.png"></image>
            <view>入会有礼</view>
          </view>
          <view class="grid">
            <image src="/static/images/mine/jfdh.png"></image>
            <view>积分兑换</view>
          </view>
          <view class="grid">
            <image src="/static/images/mine/sjtq.png"></image>
            <view>升级特权</view>
          </view>
          <view class="grid">
            <image src="/static/images/mine/srtq.png"></image>
            <view>生日特权</view>
          </view>
          <view class="grid">
            <image src="/static/images/mine/nxbz.png"></image>
            <view>奈雪宝藏</view>
          </view>
        </view>
        <view class="font-size-base text-color-primary">会员权益说明</view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters, mapMutations } from "vuex";
import Member from "@/api/member";

export default Vue.extend({
  computed: {
    ...mapGetters(["isLogin", "userInfo"]),
  },
  methods: {
    ...mapMutations(["setUserInfo"]),
    // H5登录
    login(): void {
      uni.showModal({
        title: "提示",
        content: "登录成功",
        showCancel: false,
      });
      // 存储用户信息
      this.setUserInfo(Member);
      // 关闭当前页面，返回上一页
      uni.navigateBack({
        delta: 1,
      });
    },
    // 微信登录
    async getUserInfo(e: any): Promise<void> {
      const { errMsg, userInfo } = e.detail;
      if (errMsg !== "getUserInfo:ok") {
        uni.showModal({
          title: "提示",
          content: "您取消了授权登录，请重新授权",
          showCancel: false,
        });

        //没有授权登录就用默认的用户信息
        this.setUserInfo(Member);
        uni.navigateBack({
          delta: 1,
        });
      } else {
        const {
          avatarUrl: avatar,
          city,
          country,
          gender,
          nickName: nickname,
          province,
        } = userInfo;
        const member = Object.assign(Member, {
          avatar,
          city,
          country,
          gender,
          nickname,
          province,
        });
        this.setUserInfo(member);
        uni.navigateBack({
          delta: 1,
        });
      }
    },
    // 支付宝 - 授权登录
    onGetAuthorize(): void {
      (my as any).getOpenUserInfo({
        fail: (res: any) => {
          console.log(res);
        },
        success: (res: any) => {
          const userInfo = JSON.parse(res.response).response; // 以下方的报文格式解析两层 response
          const {
            avatar,
            city,
            countryCode: country,
            gender,
            nickName: nickname,
            province,
          } = userInfo;
          const member = Object.assign(Member, {
            avatar,
            city,
            country,
            gender,
            nickname: nickname || "未设置昵称",
            province,
          });
          this.setUserInfo(member);
          uni.navigateBack({
            delta: 1,
          });
        },
      });
    },
    // 支付宝 - 取消授权
    onAuthError(): void {
      uni.showModal({
        title: "提示",
        content: "您取消了授权登录，请重新授权",
        showCancel: false,
      });
    }
  }
});
</script>

<style lang="scss" scoped>
.intro {
  width: 100%;
  height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  font-size: $font-size-base;
  color: $text-color-assist;

  image {
    width: 165rpx;
    height: 165rpx;
  }

  .tips {
    line-height: 72rpx;
    text-align: center;
  }
}

.bottom {
  height: 40vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 40rpx;

  .login-btn {
    width: 100%;
    border-radius: 50rem !important;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10rpx 0;

    image {
      width: 36rpx;
      height: 30rpx;
      margin-right: 10rpx;
    }
  }

  .row {
    .grid {
      width: 20%;
      image {
        width: 60rpx;
        height: 60rpx;
        margin-bottom: 10rpx;
      }
    }
  }
}
</style>
