<template>
  <view class="wrapper">
    <!-- 订单状态 -->
    <view class="tabs">
      <text class="active">全部</text>
      <text>待付款</text>
      <text>已付款</text>
      <text>退款/退货</text>
    </view>

    <!-- 订单 -->
    <scroll-view class="orders" scroll-y>


      <view class="item" v-for="item in orders" :key="item.order_id">

        <block v-for="one in item.goods" :key="one.goods_id">
          <!-- 商品图片 -->
          <image class="pic" :src="one.goods_small_logo"></image>
          <!-- 商品信息 -->
          <view class="meta">
            <view class="name">{{one.goods_name}}</view>
            <view class="price">
              <text>￥</text>{{one.goods_price}}<text>.00</text>
            </view>
            <view class="num">x{{one.goods_number}}</view>
          </view>
        </block>



        <!-- 总价 -->
        <view class="amount">
          共{{item.total_count}}件商品 总计: ￥{{item.order_price}}(含运费0.00)
        </view>
        <!-- 其它 -->
        <view class="extra">
          订单号: {{item.order_number}}

          <button v-if="item.pay_status==0" size="mini" type="primary" @click="goPay(item.order_number)">支付</button>
          <button v-else size="mini" type="primary">已支付</button>
        </view>


      </view>



    </scroll-view>



  </view>
</template>

<script>
  export default {
    data(){
      return {
        orders:[]
      }
    },
    methods:{
      async goPay(order_number){
        // 1.支付请求
        const {message} = await this.request({
          url:"/api/public/v1/my/orders/req_unifiedorder",
          method:"POST",
          header:{Authorization:uni.getStorageSync("token")},
          data:{
            order_number
          }
        });


        // 3. 可以支付了
        uni.requestPayment(message.pay);

      },
      // 获取订单
      async getOrders(){

        const {message}  = await this.request({
          url:"/api/public/v1/my/orders/all",
          method:"GET",
          header:{"Authorization" : uni.getStorageSync("token")},
          data:{
            type:1
          }
        });


        // console.log(message);
        this.orders = message.orders;
        
      },
    },
    onLoad(){

      this.getOrders();
    },
  }
</script>

<style scoped lang="less">
  .tabs {
    display: flex;
    height: 96rpx;
    line-height: 96rpx;
    background-color: #fff;
    box-shadow: 0 4rpx 10rpx #ccc;

    text {
      flex: 1;
      text-align: center;
      font-size: 27rpx;
      color: #333;

      &.active {
        color: #ea4451;
      }
    }
  }

  .orders {
    width: 100%;
    background-color: #f4f4f4;

    position: absolute;
    top: 97rpx;
    bottom: 0;
  }

  .item {
    padding: 30rpx 20rpx 0;
    margin-top: 16rpx;
    background-color: #fff;

    .pic {
      width: 200rpx;
      height: 200rpx;
      float: left;
    }

    .meta {
      height: 200rpx;
      margin-left: 230rpx;
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

    .num {
      position: absolute;
      bottom: 0;
      right: 20rpx;
      color: #333;
    }

    .amount {
      text-align: right;
      padding: 20rpx;
      font-size: 24rpx;
      border-top: 1rpx solid #eee;
      border-bottom: 1rpx solid #eee;
      margin-top: 20rpx;
      color: #999;
    }

    .extra {
      padding: 30rpx;
      font-size: 24rpx;
      color: #999;
      position: relative;

      button {
        position: absolute;
        right: 20rpx;
        font-size: 24rpx;
        margin-top: -10rpx;
      }
    }
  }
</style>
