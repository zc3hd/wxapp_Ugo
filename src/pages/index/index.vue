<template>
  <view :style="{height: pageHeight, overflow: 'hidden'}">
    <search @search="disableScroll" />


    <!-- 焦点图 -->
    <swiper class="banner" indicator-dots indicator-color="rgba(255, 255, 255, 0.6)" indicator-active-color="#fff">
      <swiper-item :key="item.goods_id" v-for="item in swiper_list">
        <navigator :url="'/pages/goods/index?id='+item.goods_id">
          <image :src="item.image_src"></image>
        </navigator>
      </swiper-item>
    </swiper>


    <!-- 导航条 -->
    <view class="navs">
      <navigator 
        :key="item.name" 
        v-for="item in nav_list" 
        open-type="switchTab"
        url="/pages/category/index"> 
        <image :src="item.image_src"></image>
      </navigator>
    </view>


    <!-- 楼层 -->
    <view class="floors">
      <view class="floor" :key="index" v-for="(item,index) in floor_list">
        <view class="title">
          <image :src="item.floor_title.image_src"></image>
        </view>
        <view class="items">
          <navigator
            v-for="product in item.product_list"
            :key="product.name" 
            :url="'/pages/list/index?query='+product.name">
            <image :src="product.image_src"></image>
          </navigator>
        </view>
      </view>

    </view>


    <!-- 回到顶部 -->
    <view class="goTop icon-top" v-if="goTop_key" @tap="goTop"></view>
  </view>
</template>

<script>
  import search from '@/components/search';

  export default {

    data () {
      return {
        pageHeight: 'auto',
        // 轮播图数据
        swiper_list:[],
        // 导航数据
        nav_list:[],
        // 楼层数据
        floor_list:[],

        // 返回顶部按钮
        goTop_key:false,
      }
    },

    components: {
      search
    },
    
    methods: {
      // 不能滚动的函数
      disableScroll (ev) {
        this.pageHeight = ev.pageHeight + 'px';
      },
      // 轮播图数据
      async swiper_list_get(){

        // const res = await uni.request({
        //   url:"https://www.uinav.com/api/public/v1/home/swiperdata"
        // });

        // this.swiper_list = res[1].data.message;

        const {message} = await this.request({
          url:"/api/public/v1/home/swiperdata"
        });

        this.swiper_list = message;
      },
      // 获取导航数据
      async nav_list_get(){
        const {message} = await this.request({
          url:"/api/public/v1/home/catitems",
        });

        this.nav_list = message;
      },
      // 获取楼层数据
      async floor_list_get(){
        const {message} = await this.request({
          url:"/api/public/v1/home/floordata",
        });

        this.floor_list = message;
      },

      // 点击回到顶部
      goTop(){
        // api方法：
        uni.pageScrollTo({
          scrollTop:0,
        });
      },

    },


    // 页面加载
    onLoad(){
      // 轮播图数据
      this.swiper_list_get();

      // 导航数据
      this.nav_list_get();

      // 获取楼层数据
      this.floor_list_get();


      // 默认开启转化
      // uni.showShareMenu();
    },

    // 下拉刷新时触发
    async onPullDownRefresh(){

      // 1.下拉后加载数据
      // 轮播图数据
      await this.swiper_list_get();  // 1

      // 导航数据
      await this.nav_list_get();  //0.2

      // 获取楼层数据
      await this.floor_list_get();  // 0.5
      
      
      // 2.全部数据加载完毕后，下拉效果完成:api
      uni.stopPullDownRefresh();
    },


    // 页面滚动时
    onPageScroll(e){

      if (e.scrollTop>200) {
        this.goTop_key = true;
      }
      else {
        this.goTop_key = false;
      }
      
    },
    
    // 自定义转化页面
    onShareAppMessage(){
      return {
        title:"xxxx",
        imageUrl:"http://www.999zx.cn/adm_file/fck/images/2018/4/Image/20184386447866.jpg",
        path:"/pages/index/index"
      }
    }
  }
</script>

<style scoped lang="less">
  .banner {
    width: 100%;
    height: 340rpx;

    image {
      width: 100%;
      height: 340rpx;
    }
  }

  .navs {
    display: flex;
    justify-content: space-between;
    padding: 30rpx 44rpx;

    image {
      width: 128rpx;
      height: 140rpx;
    }
  }

  .floor {

    .title {
      width: 750rpx;
      height: 60rpx;
      padding: 20rpx 0 0 8rpx;
      background-color: #f4f4f4;
    }

    .items {
      padding: 20rpx 16rpx;
      overflow: hidden;

      navigator {
        width: 193rpx;
        height: 188rpx;
        margin-left: 10rpx;
        margin-bottom: 10rpx;
        float: left;
      }

      navigator:first-child {
        width: 232rpx;
        height: 386rpx;
        margin-left: 0rpx;
      }

      navigator:nth-child(2),
      navigator:nth-child(5) {
        width: 273rpx;
      }
    }

    &:first-child {

      .items {

        navigator {
          width: 233rpx;
        }
      }
    }
  }

  .goTop {
    position: fixed;
    bottom: 30rpx;
    /* #ifdef H5 */
    bottom: 65px;
    /* #endif */
    right: 30rpx;
  
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100rpx;
    height: 100rpx;
    font-size: 48rpx;
    color: #666;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.8);
  }
</style>