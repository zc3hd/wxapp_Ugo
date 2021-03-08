<template>
  <view class="wrapper">
    <!-- 商品图片 -->
    <swiper class="pics" indicator-dots indicator-color="rgba(255, 255, 255, 0.6)" indicator-active-color="#fff">

      <swiper-item :key="item.pics_id" v-for="item in one.pics">
        <image :src="item.pics_big"></image>
      </swiper-item>


    </swiper>
    <!-- 基本信息 -->
    <view class="meta">
      <view class="price">￥{{one.goods_price}}</view>
      <view class="name">{{one.goods_name}}</view>
      <view class="shipment">快递: 免运费</view>
      <text class="collect icon-star">收藏</text>
    </view>
    <!-- 商品详情 -->
    <view class="detail">
      <rich-text :nodes="one.goods_introduce"></rich-text>
    </view>
    <!-- 操作 -->
    <view class="action">
      <button open-type="contact" class="icon-handset">联系客服</button>
      <text class="cart icon-cart" @click="goCart">购物车</text>
      <text class="add" @click="addCart">加入购物车</text>
      <text class="buy" @click="createOrder">立即购买</text>
    </view>
  </view>
</template>

<script>
  export default {
    data(){
      return {
        // 商品的信息
        one:null,
        // 1.获取本地数据
        carts:uni.getStorageSync("carts")||[]
      }
    },
    methods: {
      // 直接去购物车
      goCart () {
        uni.switchTab({
          url: '/pages/cart/index'
        })
      },
      // 立即购买
      createOrder () {
        uni.navigateTo({
          url: '/pages/order/index'
        })
      },
      // 添加到购物车
      addCart(){
        // 1.获取本地数据 
        // data.arts:uni.getStorageSync("carts")||[]

        // 2.创建订单信息
        // ID/name/价格、图片，数量（1）  数据在哪？ this.one;
        const {
          goods_id,
          goods_name,
          goods_price,
          goods_small_logo
        } = this.one;

        // 3.判断当前的数据里面是否有重复的数据？ID

        // 3.1 重复：数量加1；
        var key="未重复";
        for (let i = 0; i < this.carts.length; i++) {
          // 已经有商品
          if (this.carts[i].goods_id==goods_id) {
            key="已重复";
            this.carts[i].goods_number++;
            break;
          }
        }

        // 3.2 未重复：新商品，数量为1
        if (key=="未重复") {
          this.carts.push({
            goods_id,
            goods_name,
            goods_price,
            goods_small_logo,
            // 数量
            goods_number:1,
            // 状态:默认到了订单就是选中状态
            goods_checked:true,
          });
        }

        // 4.把data 数据 存入本地
        uni.setStorageSync("carts",this.carts);

        // 提醒
        uni.showToast({title:"添加成功",icon:"none"});
      },


      // -----------------------------------------API
      // 获取商品详情数据
      async getDetails(id){
        const {message} = await this.request({
          url:"/api/public/v1/goods/detail",
          data:{
            goods_id:id
          }
        });

        // console.log(message);
        this.one = message;
        
      },
    },
    onLoad(opts){
      const {id} = opts;

      // 获取商品详情数据
      this.getDetails(id);
    }

  }
</script>

<style scoped lang="less">
  .wrapper {
    margin-bottom: 100rpx;
    background-color: #f4f4f4;
  }

  .pics {
    height: 640rpx;
  }
  
  .meta {
    height: 250rpx;
    line-height: 1;
    padding: 30rpx 180rpx 30rpx 20rpx;
    box-sizing: border-box;
    background-color: #fff;
    position: relative;

    .price {
      font-size: 36rpx;
      color: #ea4451;
      margin-bottom: 20rpx;
    }

    .name {
      color: #333;
      line-height: 1.4;
      font-size: 33rpx;

      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }

    .shipment {
      font-size: 27rpx;
      color: #999;
      position: absolute;
      bottom: 30rpx;
    }

    .collect {
      width: 140rpx;
      height: 88rpx;
      text-align: center;
      box-sizing: border-box;
      border-left: 1rpx solid #ddd;
      font-size: 24rpx;
      color: #999;

      position: absolute;
      right: 10rpx;
      top: 91rpx;
    }

    [class*="icon-"]::before {
      display: block;
      font-size: 45rpx;
      margin-bottom: 10rpx;
    }
  }

  .detail image {
    width: 100%;
    height: 480rpx;
    margin-top: 20rpx;
  }

  .action {
    width: 100%;
    height: 98rpx;
    background-color: #fff;

    position: fixed;
    left: 0;
    bottom: 0;

    display: flex;
    align-items: center;

    text {
      display: block;
    }

    .add, .buy {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 210rpx;
      text-align: center;
      font-size: 27rpx;
      color: #fff;
    }

    .add {
      background-color: #f4b73f;
    }

    .buy {
      background-color: #ea4451;
    }

    button {
      padding: 0;
      border-radius: 0;
      background-color: #fff;

      &::after {
        border: none;
      }
    }

    button, .cart {
      flex: 1;
      text-align: center;
      color: #989898;
      font-size: 24rpx;
      box-sizing: border-box;
    }

    [class*="icon"]::before {
      display: block;
      font-size: 45rpx;
      margin-bottom: 2rpx;
    }
  }
</style>
