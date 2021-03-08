<template>
  <view class="wrapper">

    <!-- 收货信息 -->
    <view class="shipment">

      <block v-if="addr">
        <view class="dt">收货人: </view>
        <view class="dd meta">
          <text class="name">{{addr.userName}}</text>
          <text class="phone">{{addr.telNumber}}</text>
        </view>
        <view class="dt">收货地址:</view>
        <view class="dd">{{addr.details}}</view>
       </block>

      <button v-else type="primary" @click="getAttr">点击添加地址</button>
      


    </view>


    <!-- 购物车 -->
    <view class="carts">
      <view class="item">
        <!-- 店铺名称 -->
        <view class="shopname">优购生活馆</view>

        <!-- 2.数据展示 -->
        <view class="goods" :key="one.goods_id" v-for="(one,index) in carts">
          <!-- 商品图片 -->
          <image class="pic" :src="one.goods_small_logo"></image>
          <!-- 商品信息 -->
          <view class="meta">
            <view class="name">{{one.goods_name}}</view>
            <view class="price">
              <text>￥</text>{{one.goods_price}}<text>.00</text>
            </view>
            <!-- 加减 -->
            <view class="amount">
              <text class="reduce" @click="change_numb(index,-1)">-</text>
              <input type="number" :value="one.goods_number" class="number">
              <text class="plus" @click="change_numb(index,+1)">+</text>
            </view>
          </view>
          <!-- 选框 -->
          <view class="checkbox">
            <icon 
              type="success" 
              size="20" 
              @click="change_checked(index)"
              :color="one.goods_checked?'#ea4451':'#ccc'"></icon>
          </view>
        </view>



      </view>
    </view>



    <!-- 其它 -->
    <view class="extra">
      <label class="checkall">
        <icon 
          type="success" 
          :color="is?'#ea4451':'#ccc'" 
          @click="ck_all"
          size="20"></icon>
        全选
      </label>
      <view class="total">
        合计: <text>￥</text><label>{{sum}}</label><text>.00</text>
      </view>
      <view class="pay" @click="createOrder">结算({{carts.length}})</view>
    </view>



  </view>
</template>

<script>
  export default {
    data(){
      return {
        // 所有的商品
        carts:[],

        // 收获地址
        addr:null,
      }
    },
    computed:{
      // 全选按钮：是否反选
      is(){
        return this.carts.length == this.ck_carts.length;
      },
      // 把选中的商品筛选出来
      ck_carts(){
        var arr = [];
        this.carts.forEach(function (item) { 
          if (item.goods_checked) {
            arr.push(item);
          }
        });
        
        return arr;
      },
      // 总价：
      sum(){
        var numb = 0;
        this.ck_carts.forEach(function (one) {
          numb+=one.goods_number * one.goods_price;
        });

        return numb;
      }
    },
    methods:{
      // 支付
      async createOrder(){
        
        // 1.判断是否有地址？
        if (!this.addr) {
          uni.showToast({title:"无收货地址",icon:"none"});
          return;
        }

        // 2.是否有选择的商品？
        if (!this.ck_carts.length) {
          uni.showToast({title:"无结算商品",icon:"none"});
          return;
        }

        // 3.判断有没有本地的token？ 没有就获取
        if (!uni.getStorageSync("token")) {
          
          // 转跳到登录页面，进行登录；
          uni.navigateTo({
            url:"/pages/auth/index"
          });

          return;
        }


        // 4.有token：创建订单
        const {message,meta} = await this.request({
          url:"/api/public/v1/my/orders/create",
          method:"POST",
          header:{"Authorization" : uni.getStorageSync("token")},
          data:{
            order_price:this.sum,
            consignee_addr:this.addr.details,
            goods:this.ck_carts
          }
        });
        console.log(message,meta);
        

        // 订单创建成功:去订单页
        if (meta.status==200) {

          // 把已经选择的数据清空掉
          uni.removeStorageSync("carts");
          
          // 
          uni.navigateTo({
            url:"/pages/order/index"
          });
        }
        // console.log(message);
        

      },
      // 点击获取地址
      getAttr(){
        // API 
        uni.chooseAddress({
          success:(res)=>{
            this.addr = res;
            this.addr.details = res.provinceName+res.cityName+res.countyName+res.detailInfo;
          }
        });
      },
      // 全选
      ck_all(){
        // 点击之后：
        // 1.先拿到现在的状态this.is, 
        var ck = !this.is;
        //   那点击之后的状态 !this.is;

        // 2.把点击之后的状态赋值给全部数据
        this.carts.forEach(function (one) { 
          one.goods_checked = ck;
        });
       
        // 修改本地数据
        uni.setStorageSync("carts",this.carts);
      },
      // 改变状态
      change_checked(index){
        // 
        this.carts[index].goods_checked = !this.carts[index].goods_checked;

        // 修改本地数据
        uni.setStorageSync("carts",this.carts);
      },
      // 修改数量
      change_numb(index,step){
        // console.log(index,step);
        
        // <
        if (step==-1&&this.carts[index].goods_number<=1) return;

        // > 
        if (step==1&&this.carts[index].goods_number>=15) return;

        // 修改
        this.carts[index].goods_number += step;

        // 修改本地数据
        uni.setStorageSync("carts",this.carts);
      }
    },
    // 
    onLoad(){
      // this.carts = uni.getStorageSync("carts")||[];
    },
    // 1.页面显示出来，数据重新获取下
    onShow(){
      this.carts = uni.getStorageSync("carts")||[];
    }
  }
</script>

<style scoped lang="less">
  .shipment {
    height: 100rpx;
    line-height: 2;
    padding: 30rpx 30rpx 40rpx 30rpx;
    font-size: 27rpx;
    color: #333;
    background-color: #fff;
    background-image: url(http://static.botue.com/ugo/images/cart_border%402x.png);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: bottom;

    .dt {
      width: 140rpx;
      float: left;
      clear: both;
    }

    .dd {
      padding-left: 160rpx;
    }

    .meta {
      padding-right: 50rpx;
    }

    text.phone {
      float: right;
    }
  }

  .carts {
    background-color: #f4f4f4;
    padding-bottom: 110rpx;
    overflow: hidden;

    .shopname {
      padding: 30rpx;
      margin-top: 20rpx;
      font-size: 30rpx;
      color: #333;
      background-color: #fff;
      border-top: 1rpx solid #eee;
      border-bottom: 1rpx solid #eee;
    }

    .goods {
      display: flex;
      padding: 30rpx 20rpx 30rpx 0;
      margin-left: 100rpx;
      border-bottom: 1rpx solid #eee;
      background-color: #fff;
  
      position: relative;

      .checkbox {
        width: 101rpx;
        height: 100%;
        background-color: #fff;

        display: flex;
        justify-content: center;
        align-items: center;

        position: absolute;
        left: -100rpx;
        top: 0;
      }

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

      .amount {
        position: absolute;
        bottom: 0;
        right: 20rpx;

        height: 48rpx;
        text-align: center;
        border: 1rpx solid #ddd;
        border-radius: 8rpx;

        display: flex;
        align-items: center;

        text {
          display: block;
          width: 60rpx;
          line-height: 48rpx;
          font-size: 36rpx;
          color: #ddd;
          text-align: center;
        }

        input {
          width: 60rpx;
          height: 48rpx;
          min-height: 48rpx;
          font-size: 27rpx;
          border-left: 1rpx solid #ddd;
          border-right: 1rpx solid #ddd;
        }
      }
    }
  }

  .extra {
    position: fixed;
    bottom: 0;
    /* #ifdef H5 */
    bottom: 50px;
    /* #endif */
    left: 0;
    z-index: 9;

    width: 750rpx;
    height: 96rpx;
    text-align: center;
    line-height: 96rpx;
    font-size: 36rpx;
    border-top: 1rpx solid #eee;
    background-color: #fff;
    color: #333;
    display: flex;

    .checkall {
      width: 140rpx;
      line-height: 1;
      margin-left: 25rpx;
      display: flex;
      align-items: center;

      icon {
        margin-right: 20rpx;
      }
    }

    .total {
      display: flex;
      justify-content: center;
      flex: 1;

      label, text {
        color: #ea4451;
        vertical-align: bottom;
        position: relative;
        bottom: -2rpx;
      }

      text {
        position: relative;
        bottom: -3rpx;
        font-size: 24rpx;

        &:first-child {
          margin-left: 10rpx;
        }
      }
    }

    .pay {
      width: 200rpx;
      background-color: #ea4451;
      color: #fff;
    }
  }
</style>

