<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  mpType: "app",
  // 赋值：getApp().globalData.text = 'test'
  // 取值：console.log(getApp().globalData.text) // 'test'
  // 如果需要把globalData的数据绑定到页面上，可在页面的onshow声明周期里进行变量重赋值
  globalData: {
    // text: 'text'
  },
  onLaunch() {
    console.log("App Launch");
  },
  onShow() {
    console.log("App Show");
  },
  onHide() {
    console.log("App Hide");
  },
});
</script>

<style lang="scss">
/*每个页面公共css */
@import "~@/static/style/app.scss";
</style>
