export default {
  data() {
    return {
      share: {
        title: '一杯好茶，一口软欧包，在奈雪遇见两种美好',  // 分享页面标题
        path: '',  // 分享页面的路径
        imageUrl: '',
        desc: '',
        content: ''
      }
    }
  },
  // 分享朋友
  onShareAppMessage(res: any): any {
    // button 页面内分享按钮
    // menu 右上角分享按钮
    if (res.from === 'button') {
      uni.showToast({
        title: '来自页面内分享按钮',
        icon: 'none'
      })
    } else {
      uni.showToast({
        title: '来自右上角分享按钮',
        icon: 'none'
      })
    }
    return {
      title: (this as any).share.title,
      path: (this as any).share.path,
      imageUrl: (this as any).share.imageUrl,
      desc: (this as any).share.desc,
      content: (this as any).share.content,
      success(res: any) {
        uni.showToast({
          title: '分享成功'
        })
      },
      fail(res: any) {
        uni.showToast({
          title: '分享失败',
          icon: 'none'
        })
      }
    }
  },
  onShareTimeline() {
    return {
      title: '一杯好茶，一口软欧包，在奈雪遇见两种美好',
      // query: 'name=xxx&age=xxx',
      // imageUrl: 'http://123.png',
    }
  }
}