<template>
  <!-- 商品详情模态框 begin -->
  <modal
    :show="true"
    class="good-detail-modal"
    color="#5A5B5C"
    width="90%"
    custom
    padding="0rpx"
    radius="12rpx"
  >
    <view class="cover">
      <image v-if="good.images" :src="good.images" class="image"></image>
      <view class="btn-group">
        <image src="/static/images/menu/share-good.png"></image>
        <image
          src="/static/images/menu/close.png"
          @tap="closeGoodDetailModal"
        ></image>
      </view>
    </view>
    <scroll-view class="detail" scroll-y>
      <view class="wrapper">
        <view class="basic">
          <view class="name">{{ good.name }}</view>
          <view class="tips">{{ good.content }}</view>
        </view>
        <view class="properties" v-if="good.use_property">
          <view
            class="property"
            v-for="(item, index) in good.property"
            :key="index"
          >
            <view class="title">
              <text class="name">{{ item.name }}</text>
              <view class="desc" v-if="item.desc">({{ item.desc }})</view>
            </view>
            <view class="values">
              <view
                class="value"
                v-for="(value, key) in item.values"
                :key="key"
                :class="{ default: value.is_default }"
                @tap="changePropertyDefault(index, key)"
              >
                {{ value.value }}
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
    <view class="action">
      <view class="left">
        <view class="price">￥{{ good.price }}</view>
        <view class="props" v-if="getGoodSelectedProps(good)">
          {{ getGoodSelectedProps(good) }}
        </view>
      </view>
      <view class="btn-group">
        <button
          type="default"
          plain
          class="btn"
          size="mini"
          hover-class="none"
          @tap="handlePropertyReduce"
        >
          <view class="iconfont iconsami-select"></view>
        </button>
        <view class="number">{{ good.number }}</view>
        <button
          type="primary"
          class="btn"
          size="min"
          hover-class="none"
          @tap="handlePropertyAdd"
        >
          <view class="iconfont iconadd-select"></view>
        </button>
      </view>
    </view>
    <view class="add-to-cart-btn" @tap="handleAddToCartInModal">
      <view>加入购物车</view>
    </view>
  </modal>
  <!-- 商品详情模态框 end -->
</template>

<script lang="ts">
import Vue from "vue";
import Modal from "@/components/modal/modal.vue";
import { mapGetters, mapMutations } from "vuex";
export default Vue.extend({
  components: {
    Modal
  },
  props: ({
    // 当前分类数据
    category: {
      type: Object,
      default: {}
    },
    // 单个商品详情数据
    good: {
      type: Object,
      default: {}
    }
  } as unknown) as undefined,
  computed: {
    ...mapGetters(["cartData"])
  },
  methods: {
    ...mapMutations(["setCartData"]),
    // 关闭商品详情模态框
    closeGoodDetailModal(): void {
      this.$emit('closeGoodDetailModal');
    },
    // 商品详情配置规则修改
    changePropertyDefault(index: number, key: number) {
      (this as any).good.property[index].values.forEach((value: any) =>{
        this.$set(value, "is_default", 0)
      });
      (this as any).good.property[index].values[key].is_default = 1;
      (this as any).good.number = 1;
    },
    // 商品数量减少
    handlePropertyReduce(): boolean | undefined {
      if ((this as any).good.number === 1) {
        return false;
      };
      (this as any).good.number -= 1;
    },
    // 商品数量增加
    handlePropertyAdd() {
      (this as any).good.number += 1;
    },
    // 加入购物车
    handleAddToCartInModal() {
      const product = Object.assign({}, (this as any).good, {
        props_text: this.getGoodSelectedProps((this as any).good),
        props: this.getGoodSelectedProps((this as any).good, "id"),
      });
      this.handleAddToCart((this as any).category, product, (this as any).good.number);
      this.$emit('handleAddToCartInModal');
    },
    // 计算当前饮品所选属性
    getGoodSelectedProps(good: any, type = "text") {
      if (good.use_property) {
        let props:unknown[] = [];
        good.property.forEach(({ values }: { values: any }) => {
          values.forEach((value: any) => {
            if (value.is_default) {
              props.push(type === "text" ? value.value : value.id);
            }
          });
        });
        return type === "text" ? props.join("，") : props;
      }
      return "";
    },
    // 添加到购物车数据
    handleAddToCart(cate: any, good: any, num: number) {
      const cartData = JSON.parse(JSON.stringify(this.cartData));
      const index = cartData.findIndex((item: any) => {
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
  }
});
</script>

<style lang="scss" scoped>
@import "~@/pages/menu/menu.scss";
</style>
