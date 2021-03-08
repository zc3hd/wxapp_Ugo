<template>
  <view>
    <!-- 筛选 -->
    <view class="filter">
      <text class="active">综合</text>
      <text>销量</text>
      <text>价格</text>
    </view>
    <!-- 商品列表 -->
    <scroll-view class="goods" scroll-y @scrolltolower="getMore">



      <view class="item" @click="goDetail(one.goods_id)" :key="one.goods_id" v-for="one in list">
        <!-- 商品图片 -->
        <image class="pic" :src="one.goods_small_logo"></image>
        <!-- 商品信息 -->
        <view class="meta">
          <view class="name">{{one.goods_name}}</view>
          <view class="price">
            <text>￥</text>{{one.goods_price}}<text>.00</text>
          </view>
        </view>
      </view>



    </scroll-view>
  </view>
</template>

<script>
  export default {
    data(){
      return {
        query:"",
        list:[],
        // 请求的页码：
        pagenum:1,
        // 条数
        pagesize:10,

        // 请求的状态
        zt:"加载完",
      }
    },
    // 方法
    methods: {
      // JS跳转页面
      goDetail (id) {
        uni.navigateTo({
          url: `/pages/goods/index?id=${id}`
        })
      },
      // 获取列表数据
      async getList(){
        // 
        const {message} = await this.request({
          url:"/api/public/v1/goods/search",
          data:{
            query:this.query,
            pagenum:this.pagenum,
            pagesize:this.pagesize,
          }
        });

        // 覆盖原数组
        this.list = this.list.concat(message.goods);
      },
      // 获取更多的数据
      async getMore(){
        
        // 加载完的时候，可以继续加载。
        if (this.zt=="加载完") {

          // 一开始设置状态改变，防止多次加载；
          this.zt = "加载中";

          // 1.请求下一页数据
          this.pagenum++;

          // 2.请求数据；
          await this.getList();
          
          // 请求数据完成后，就是数据加载完；
          this.zt = "加载完";
        }

      }
    },

    // 数据通过
    onLoad(opts){
      // 
      this.query = opts.query;

      this.getList();
    }
  }
</script>

<style scoped lang="less">
  .filter {
    display: flex;
    height: 96rpx;
    line-height: 96rpx;
    border-bottom: 1rpx solid #ddd;

    /* #ifdef H5 */
    position: relative;
    z-index: 99;
    /* #endif */

    text {
      flex: 1;
      text-align: center;
      font-size: 30rpx;
      color: #333;

      &.active {
        color: #ea4451;
      }
    }
  }
  
  .goods {
    position: absolute;
    width: 100%;
    top: 97rpx;
    bottom: 0;
  }

  .item {
    display: flex;
    padding: 30rpx 20rpx 30rpx 0;
    margin-left: 20rpx;
    border-bottom: 1rpx solid #eee;

    &:last-child {
      border-bottom: none;
    }

    .pic {
      width: 200rpx;
      height: 200rpx;
      margin-right: 30rpx;
    }

    .meta {
      flex: 1;
      font-size: 27rpx;
      color: #333;
      position: relative;
    }

    .name {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .price {
      position: absolute;
      bottom: 0;

      color: #ea4451;
      font-size: 33rpx;

      text {
        font-size: 22rpx;
      }
    }
  }
</style>
