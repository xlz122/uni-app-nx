// @ts-nocheck

//打开地图
export function chooseLocation() {
  // 先判断定位权限是否开启
  uni.getLocation({
    success() {
      //定位权限开启，打开地图
      uni.chooseLocation({
        success: function (res) {
          console.log(res);
          console.log('位置名称：' + res.name);
          console.log('详细地址：' + res.address); // 移动端大部分地址不带省市区，浏览器预览出来会带上 求解决方案 ？？？？？？？？？
          // 经度
          console.log('经度：' + res.longitude);
          // 纬度
          console.log('纬度：' + res.latitude);
        } // 成功回调
      })
    },
    fail(e) {
      // 定位权限未开启，引导设置
      uni.showModal({
        title: '温馨提示',
        content: '您已拒绝定位,请开启',
        confirmText: '去设置',
        success(res) {
          if (res.confirm) {
            //打开授权设置
            openSetting()
          }
        }
      })
    }
  })
}

// 打开授权设置（必须用户点击小程序才能打开授权设置，所以前面加了showModel）
export function openSetting() {
  // 打开小程序的设置
  // #ifdef MP-WEIXIN
  uni.openSetting()
  // #endif

  // App跳转系统的设置界面
  // #ifdef APP-PLUS
  uni.getSystemInfo({
    success(res) {
      if (res.platform == 'ios') { //IOS
        plus.runtime.openURL("app-settings://");
      } else if (res.platform == 'android') { //安卓
        let main = plus.android.runtimeMainActivity();
        let Intent = plus.android.importClass("android.content.Intent");
        let mIntent = new Intent('android.settings.ACTION_SETTINGS');
        main.startActivity(mIntent);
      }
    }
  });
  // #endif
}