<template>
  <view class="container">
    <view class="form-box">
      <view class="form">
        <list-cell :hover="false">
          <view class="form-input">
            <view class="label">收货人</view>
            <input
              class="input"
              placeholder="请输入收货人"
              v-model="form.accept_name"
              placeholder-class="text-color-assist"
            />
          </view>
        </list-cell>
        <list-cell :hover="false">
          <view class="form-input">
            <view class="label">性别</view>
            <view class="radio-group">
              <view
                class="radio"
                :class="{ checked: !form.sex }"
                style="margin-right: 10rpx"
                @tap="form.sex = 0"
                >先生</view
              >
              <view
                class="radio"
                :class="{ checked: form.sex }"
                @tap="form.sex = 1"
                >女士</view
              >
            </view>
          </view>
        </list-cell>
        <list-cell :hover="false">
          <view class="form-input">
            <view class="label">联系方式</view>
            <input
              class="input"
              placeholder="请输入收货人联系方式"
              v-model="form.mobile"
              placeholder-class="text-color-assist"
            />
          </view>
        </list-cell>
        <list-cell :hover="false">
          <view class="form-input">
            <view class="label">收货地址</view>
            <input
              class="input"
              placeholder="请选择收货地址"
              v-model="form.district.districts"
              @focus="openAddres"
              placeholder-class="text-color-assist"
            />
        <simple-address
          ref="simpleAddress"
          :pickerValueDefault="form.value"
          @onConfirm="onConfirm"
          themeColor="#007AFF"
        >
        </simple-address>
          </view>
        </list-cell>
        <list-cell :hover="false">
          <view class="form-input">
            <view class="label">详细地址</view>
            <input
              class="input"
              placeholder="请输入详细地址"
              v-model="form.street"
              placeholder-class="text-color-assist"
            />
          </view>
        </list-cell>
      </view>
      <view class="btn-section">
        <button type="primary" size="default" @tap="save">保存</button> 
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import ListCell from "@/components/list-cell/list-cell.vue";
import SimpleAddress from "@/components/simple-address/simple-address.vue";
import { mapGetters, mapMutations } from "vuex";

export default Vue.extend({
  components: {
    ListCell,
    SimpleAddress
  },
  data() {
    return {
      editAddress: {}, // 编辑数据
      form: {
        accept_name: "", // 收货人
        sex: 0, // 性别
        mobile: "", // 联系方式
        street: "", // 详细地址
        province_name: "", // 省
        city_name: "", // 市
        area_name: "", // 区/县
        province: 0, // 省编号
        city: 0, // 市编号
        area: 0, // 区/县编号
        district: {
          districts: "", // 省市区
          province: "", // 省
          city: "", // 市
          area: "" // 区/县
        },
        value: [0, 0, 0] // 省市区默认值
      },
    };
  },
  computed: {
    ...mapGetters(["addresses"]),
  },
  onLoad() {
    // 获取本地的编辑地址信息
    if (uni.getStorageSync("editAddress")) {
      this.editAddress = JSON.parse(uni.getStorageSync("editAddress") || '');
      this.form = Object.assign(this.form, this.editAddress);
    }
  },
  methods: {
    ...mapMutations(["setAddersses"]),
    // 根据 value 获取
    openAddres() {
      (this as any).$refs.simpleAddress.open();
    },
    // 地址选择确认
    onConfirm(e: any): void {
      // value
      this.form.value = e.value;
      // 用于编辑展示
      (this as any).form.district.districts = `${e.labelArr[0]} ${e.labelArr[1]} ${e.labelArr[2]}`;
      (this as any).form.district.province = e.labelArr[0];
      (this as any).form.district.city = e.labelArr[1];
      (this as any).form.district.area = e.labelArr[2];
      (this as any).form.province_name = e.labelArr[0];
      (this as any).form.city_name = e.labelArr[1];
      (this as any).form.area_name = e.labelArr[2];
      // 编码.form
      (this as any).form.province = e.provinceCode;
      (this as any).form.city = e.cityCode;
      (this as any).form.area = e.areaCode;
    },
    // 保存
    save(): boolean | undefined {
      const reg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
      if (!this.form.accept_name) {
        uni.showToast({
          title: "请输入收货人",
          icon: "none"
        });
        return false;
      } else if (!this.form.mobile) {
        uni.showToast({
          title: "请输入手机号",
          icon: "none" 
        });
        return false;
      } else if (this.form.mobile && !reg.test(this.form.mobile)) {
        uni.showToast({
          title: "请输入正确的手机号",
          icon: "none"
        });
        return false;
      } else if (!this.form.district.districts) {
        uni.showToast({
          title: "请选择收获地址",
          icon: "none"
        })
        return false;
      } else if (!this.form.street) {
        uni.showToast({
          title: "请输入详细地址",
          icon: "none"
        })
        return false;
      }
      if (Object.keys(this.editAddress).length === 0) {
        // 新增
        const addAddress = Object.assign(
          {
            id: new Date().getTime(),
            accept_name: "",
            mobile: "",
            province_name: "",
            city_name: "",
            area_name: "",
            area: 0,
            city: 0,
            sex: 0,
            district: {
              districts: "",
              area: "",
              city: "",
              province: "",
            },
            street: "",
            inner: false,
            lat: "",
            is_default: 0,
            province: 0,
            poiname: "",
            value: []
          },
          this.form
        );
        const addresses = JSON.parse(JSON.stringify(this.addresses));
        addresses.push(addAddress);
        this.setAddersses(addresses);
        uni.navigateBack({
          delta: 1
        });
      } else {
        // 编辑
        const editAddress = Object.assign(this.editAddress, this.form);
        const addresses = JSON.parse(JSON.stringify(this.addresses));
        addresses.forEach((item: any) => {
          if (item.id === (this.editAddress as any).id) {
            Object.assign(item, editAddress);
          }
        });
        console.log(editAddress);
        console.log(addresses);
        this.setAddersses(addresses);
        uni.navigateBack({
          delta: 1
        });
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.form-box {
  width: 100%;
  height: 100%;
  padding: 30rpx;
  display: flex;
  flex-direction: column;
  color: $text-color-base;

  .form-input {
    display: flex;
    align-items: center;
    width: 100%;
  }

  .label {
    width: 200rpx;
    font-size: $font-size-lg;
    color: $text-color-base;
    font-weight: 500;
  }

  .input {
    flex: 1;
    display: flex;
    align-items: center;
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

  .btn-section {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;

    button {
      font-size: $font-size-base;
      height: 90rpx;
      border-radius: 50rem !important;
      width: 85%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
