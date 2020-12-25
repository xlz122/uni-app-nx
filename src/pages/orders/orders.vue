<template>
	<view class="container">
		<view class="orders-list d-flex flex-column w-100" style="padding: 20rpx; padding-bottom: 0;">
			<view class="order-item" v-for="(item, index) in orders" :key="index" style="margin-bottom: 30rpx;" @tap="detail(item.id)">
				<list-cell :hover="false">
					<view class="w-100 d-flex align-items-center">
						<view class="flex-fill d-flex flex-column">
							<view class="font-size-lg text-color-base" style="margin-bottom: 20rpx;">
								{{ item.store.name }}
							</view>
							<view class="font-size-sm text-color-assist">订单编号：{{ item.order_no }}</view>
						</view>
						<view class="font-size-lg text-color-primary">
							{{ item.status_text }}
						</view>
					</view>
				</list-cell>
				<list-cell :hover="false" last>
					<view class="w-100 d-flex flex-column">
						<view class="w-100 text-truncate font-size-lg text-color-base" style="margin-bottom: 20rpx;">
							{{ orderGoodsName(item.goods) }}
						</view>
						<view class="d-flex justify-content-between align-items-center" style="margin-bottom: 30rpx;">
							<view class="font-size-sm text-color-assist">
								{{ $util.formatDateTime(item.created_at) }}
							</view>
							<view class="d-flex font-size-sm text-color-base align-items-center">
								<view style="margin-right: 10rpx;">共{{ item.goods_num }}件商品，实付</view>
								<view class="font-size-lg">￥{{ item.amount }}</view>
							</view>
						</view>
						<view class="d-flex align-items-center justify-content-end">
							<view style="margin-right: 10rpx;">
								<button type="primary" plain size="mini" v-if="item.invoice_status > 0">查看发票</button>
								<button type="primary" plain size="mini" v-else @tap.stop="goToInvoice">开发票</button>
							</view>
							<view>
								<button type="primary" plain size="mini" @tap.stop="review(item)">去评价</button>
							</view>
						</view>
					</view>
				</list-cell>
			</view>
		</view>
	</view>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import listCell from "@/components/list-cell/list-cell.vue";

interface Data {
  page: number;
  pageSize: number;
  orders: unknown[];
}

export default Vue.extend({
  components: {
    listCell,
  },
  data() {
    return {
      page: 1, // 页数
      pageSize: 5, // 条数
      orders: [] // 订单数据
    } as Data;
  },
  computed: {
    ...mapGetters(['isLogin']),
    orderGoodsName() {
			return (goods: any) => {
				let arr: unknown[] = []
				goods.forEach((good: any) => arr.push(good.name + '*' + good.number))
				return arr.join('，')
			}
		}
  },
  async onLoad() {
    if (!this.isLogin) {
      uni.navigateTo({
        url: '/pages/login/login'
      })
    } else {
      await (this as any).getOrders(false);
    }
  },
  async onShow() {
    if (this.isLogin) {
      await (this as any).getOrders(false);
    }
  },
  // 上拉加载
  async onReachBottom() {
		await (this as any).getOrders(false)
  },
  // 下拉刷新
  async onPullDownRefresh() {
    await (this as any).getOrders(true)
  },
  methods: {
    // 订单数据处理
    async getOrders(isRefresh: boolean = false): Promise<void> {
      uni.showLoading({
        title: '加载中'
      })
      let orders = await (this as any).$api('orders');

      // 刷新重置
      if (isRefresh) {
        this.page = 1;
        this.orders = []; 
      }

      // 订单条数处理
      orders = orders.slice(this.pageSize * (this.page - 1), this.pageSize * this.page);
      if (orders.length) {
        this.orders = this.orders.concat(orders);
        this.page += 1;
      }

      setTimeout(() => {
        uni.hideLoading()
      }, 500);
    },
    // 详情
    detail(id: number): void {
			uni.navigateTo({
				url: `/pages/orders/detail?id=${id}`
      })
    },
    // 查看发票
    goToInvoice() {},
    // 评价
    review(order: any) {
      const date = order.completed_time.split(' ')[0];
      const url = `/pages/review/review?storename=${order.store.nam}&typeCate=${order.typeCate}&date=${date}`
      uni.navigateTo({
				url
			})
    }
  }
});
</script>
