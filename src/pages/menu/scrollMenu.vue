<template>
  <view class="content" :style="{ height: scrollHeight }">
    <scroll-view
      class="menus"
      :scroll-into-view="menuScrollIntoView"
      scroll-with-animation
      scroll-y
    >
      <view class="wrapper">
        <view class="list">
          <view
            class="menu"
            :id="`menu-${item.id}`"
            :class="{ current: item.id === currentCateId }"
            v-for="(item, index) in goods"
            :key="index"
            @tap="handleMenuTap(item.id)"
          >
            <text>{{ item.name }}</text>
            <view class="dot" v-show="cartNum(item.id)">{{
              cartNum(item.id)
            }}</view>
          </view>
        </view>
      </view>
    </scroll-view>
    <!-- goods list begin -->
    <scroll-view
      class="goods"
      scroll-with-animation
      scroll-y
      :scroll-top="cateScrollTop"
      :lower-threshold="100"
      @scroll="handleGoodsScroll"
      @scrolltoupper="handleGoodsScrollToupper"
      @scrolltolower="handleGoodsScrollTolower"
    >
      <view class="wrapper">
        <swiper class="ads" id="ads" autoplay :interval="3000" indicator-dots>
          <swiper-item v-for="(item, index) in ads" :key="index">
            <image :src="item.image"></image>
          </swiper-item>
        </swiper>
        <view class="list">
          <!-- category begin -->
          <view
            class="category"
            v-for="(item, index) in goods"
            :key="index"
            :id="`cate-${item.id}`"
          >
            <view class="title">
              <text>{{ item.name }}</text>
              <image :src="item.icon" class="icon"></image>
            </view>
            <view class="items">
              <!-- 商品 begin -->
              <view
                class="good"
                v-for="(good, key) in item.goods_list"
                :key="key"
              >
                <image
                  :src="good.images"
                  class="image"
                  @tap="showGoodDetailModal(item, good)"
                ></image>
                <view class="right">
                  <text class="name">{{ good.name }}</text>
                  <text class="tips">{{ good.content }}</text>
                  <view class="price_and_action">
                    <text class="price">￥{{ good.price }}</text>
                    <view class="btn-group" v-if="good.use_property">
                      <button
                        type="primary"
                        class="btn property_btn"
                        hover-class="none"
                        size="mini"
                        @tap="showGoodDetailModal(item, good)"
                      >
                        选规格
                      </button>
                      <view class="dot" v-show="cartNum(good.id)">{{
                        cartNum(good.id)
                      }}</view>
                    </view>
                    <view class="btn-group" v-else>
                      <button
                        type="default"
                        v-if="cartNum(good.id)"
                        plain
                        class="btn reduce_btn"
                        size="mini"
                        hover-class="none"
                        @tap="handleReduceFromCart(item, good)"
                      >
                        <view class="iconfont iconsami-select"></view>
                      </button>
                      <view class="number" v-if="cartNum(good.id)">{{
                        cartNum(good.id)
                      }}</view>
                      <button
                        type="primary"
                        class="btn add_btn"
                        size="mini"
                        hover-class="none"
                        @tap="handleAddToCart(item, good, 1)"
                      >
                        <view class="iconfont iconadd-select"></view>
                      </button>
                    </view>
                  </view>
                </view>
              </view>
              <!-- 商品 end -->
            </view>
          </view>
          <!-- category end -->
        </view>
      </view>
    </scroll-view>
    <!-- goods list end -->
    <!-- 商品详情模态框 begin -->
    <good-detail-modal
      v-show="goodDetailModalVisible"
      :category="category"
      :good="good"
      @closeGoodDetailModal="closeGoodDetailModal"
      @handleAddToCartInModal="handleAddToCartInModal"
    />
    <!-- 商品详情模态框 end -->
  </view>
</template>

<script lang="ts">
// @ts-nocheck
import Vue from "vue";
import { mapGetters, mapMutations } from "vuex";
import GoodDetailModal from "./GoodDetailModal.vue";

interface Data {
  goods: never[];
  menuScrollIntoView: string;
  currentCateId: number;
  ads: unknown[];
  cateScrollTop: number;
  sizeCalcState: boolean;
  category: unknown;
  good: unknown;
  goodDetailModalVisible: boolean;
}

export default Vue.extend({
  components: {
    GoodDetailModal,
  },
  props: ({
    // 商品数据
    goods: {
      type: Array,
      default: [],
    },
  } as unknown) as undefined,
  data() {
    return {
      scrollHeight: 0, // 滚动区域高度
      menuScrollIntoView: "",
      currentCateId: 0, // 左侧当前选中id
      ads: [
        // 商品列表轮播图片
        {
          image:
            "https://img-shop.qmimg.cn/s23107/2020/04/27/4ebdb582a5185358c4.jpg?imageView2/2/w/600/h/600",
        },
        {
          image:
            "https://images.qmai.cn/s23107/2020/05/08/c25de6ef72d2890630.png?imageView2/2/w/600/h/600",
        },
        {
          image:
            "https://img-shop.qmimg.cn/s23107/2020/04/10/add546c1b1561f880d.jpg?imageView2/2/w/600/h/600",
        },
        {
          image:
            "https://images.qmai.cn/s23107/2020/04/30/b3af19e0de8ed42f61.jpg?imageView2/2/w/600/h/600",
        },
        {
          image:
            "https://img-shop.qmimg.cn/s23107/2020/04/17/8aeb78516d63864420.jpg?imageView2/2/w/600/h/600",
        },
      ],
      goodFromCartVisible: false, // 商品减少显隐
      cateScrollTop: 0, // 右侧商品列表滚动高度
      sizeCalcState: false, // 是否滚动到底部
      category: {}, // 当前分类数据
      good: {}, // 单条商品数据
      goodDetailModalVisible: false, // 商品详情模态框
    } as Data;
  },
  computed: {
    ...mapGetters(["cartData"]),
    // 计算单个饮品添加到购物车的数量
    cartNum() {
      return (id: number) => {
        let result = 0;
        this.cartData.map((item: any) => {
          if (item.id === id) {
            result = item.number;
          }
        });
        return result;
      };
    },
  },
  watch: {
    // 数据更新获取容器高度
    goods(cur) {
      if (cur) {
        this.getContentHeight();
      }
    }
  },
  mounted() {
    this.init();
    this.getContentHeight();
  },
  methods: {
    ...mapMutations(["setCartData"]),
    init(): void {
      // 左侧菜单，默认选中第一项
      if (this.goods.length >= 1) {
        this.currentCateId = (this as any).goods[0].id;
      }
    },
    // 获取屏幕高度及比例
    getContentHeight() {
      uni.getSystemInfo({
        success: (res) => {
          // 获取屏幕高度
          let windowHeight = res.windowHeight;
          // 获取其他容器高度
          let dom = uni.createSelectorQuery().select(".nav");
          dom
            .fields({ size: true }, (res2) => {
              if (!res2) {
                return;
              }
              // 计算得出滚动区域的高度
              // this.scrollHeight = uni.upx2px(windowHeight - res2.height);
              this.scrollHeight = windowHeight - res2.height + "px";
            })
            .exec();
        },
      });
    },
    // 左侧菜单项点击
    handleMenuTap(id: number): void {
      // 计算每一个分类的到顶部高度
      if (!this.sizeCalcState) {
        this.calcSize();
      }
      // 解决数据（goods）异步问题
      this.$nextTick(() => {
        this.currentCateId = id;
        // 第一项定位到顶部
        if (id === this.goods[0].id) {
          this.cateScrollTop = 0;
        } else {
          this.cateScrollTop = this.goods.find((item) => item.id == id).top;
        }
      });
    },
    // 商品列表滚动
    handleGoodsScroll({ detail }: { detail: any }) {
      // 计算每一个分类的到顶部高度
      if (!this.sizeCalcState) {
        this.calcSize();
      }
      // 左侧菜单跳至选中项
      const { scrollTop } = detail;
      // +8，解决左侧菜单回跳上一分类问题
      // 高度偏差引起，top比scrollTop稍微大一点点
      const tabs = this.goods.filter((item) => item.top <= scrollTop + 8);
      if (tabs.length > 0) {
        this.currentCateId = tabs[tabs.length - 1].id;
      }
    },
    // 商品列表 - 滚动到顶部
    handleGoodsScrollToupper() {
      this.currentCateId = this.goods[0].id;
    },
    // 商品列表 - 滚动到底部
    handleGoodsScrollTolower() {
      this.currentCateId = this.goods[this.goods.length - 1].id;
    },
    // 计算每一个分类的到顶部高度
    calcSize() {
      let h = 10;

      // 支付宝小程序不支持in(component)，子组件使用无效果，只能把放在最外层组件获取
      let view = uni.createSelectorQuery().in(this).select("#ads");
      view
        .fields(
          {
            size: true,
          },
          (data) => {
            h += Math.floor(data.height);
          }
        )
        .exec();
      this.goods.forEach((item) => {
        let view = uni
          .createSelectorQuery()
          .in(this)
          .select(`#cate-${item.id}`);
        view
          .fields(
            {
              size: true,
            },
            (data) => {
              item.top = h;
              h += data.height;
              item.bottom = h;
            }
          )
          .exec();
      });
      this.sizeCalcState = true;
    },
    // 打开商品详情模态框
    showGoodDetailModal(item: any, good: any) {
      this.category = JSON.parse(JSON.stringify(item));
      this.good = JSON.parse(JSON.stringify({ ...good, number: 1 }));
      this.goodDetailModalVisible = true;
    },
    // 关闭商品详情模态框
    closeGoodDetailModal() {
      this.category = {};
      this.good = {};
      this.goodDetailModalVisible = false;
    },
    // 商品详情模态框 - 加入购物车
    handleAddToCartInModal() {
      this.category = {};
      this.good = {};
      this.goodDetailModalVisible = false;
    },
    // 没有规格商品 - 减少
    handleReduceFromCart(item, good) {
      const cartData = JSON.parse(JSON.stringify(this.cartData));
      const index = cartData.findIndex((item) => item.id === good.id);
      cartData[index].number -= 1;
      if (cartData[index].number <= 0) {
        cartData.splice(index, 1);
      }
      this.setCartData(cartData);
    },
    // 没有规格商品 - 增加
    handleAddToCart(cate: any, good: any, num: any) {
      const cartData = JSON.parse(JSON.stringify(this.cartData));
      const index = cartData.findIndex((item) => {
        if (good.use_property) {
          return item.id === good.id && item.props_text === good.props_text;
        } else {
          return item.id === good.id;
        }
      });
      if (index > -1) {
        cartData[index].number += num;
      } else {
        cartData.push({
          id: good.id,
          cate_id: cate.id,
          name: good.name,
          price: good.price,
          number: num,
          image: good.images,
          use_property: good.use_property,
          props_text: good.props_text,
          props: good.props,
        });
      }
      this.setCartData(cartData);
    },
  },
});
</script>

<style lang="scss" scoped>
@import "~@/pages/menu/menu.scss";
</style>
