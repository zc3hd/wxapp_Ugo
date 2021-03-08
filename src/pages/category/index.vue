<template>
  <view v-if="all_list.length">
    <!-- 搜索 -->
    <search />
    <!-- 分类 -->
    <view class="category">


      <!-- 顶级分类 -->
      <view class="sup">
        <scroll-view scroll-y>
          <!-- <text class="active">大家电</text> -->
          <text 
            :class="{'active':index==ac_index}"
            :key="item.cat_id"
            @tap = "change(index)"
            v-for="(item,index) in all_list">
            {{item.cat_name}}
          </text> 
        </scroll-view>
      </view>


      <!-- 子级分类 -->
      <view class="sub">
        <scroll-view scroll-y>
          <!-- 封面图 -->
          <image src="http://static.botue.com/ugo/uploads/category.png" class="thumb"></image>


          <view class="children" :key="item.cat_id" v-for="item in all_list[ac_index].children">
            <view class="title">{{item.cat_name}}</view>
            <!-- 品牌 -->
            <view class="brands">


              <navigator 
                v-for="one in item.children" 
                :key="one.cat_id"
                :url="'/pages/list/index?query='+one.cat_name"  >
                <image :src="one.cat_icon"></image>
                <text>{{one.cat_name}}</text>
              </navigator>


            </view>

          </view>

        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script>
  import search from '@/components/search';

  export default {
    data(){
      return {
        // 全部数据
        all_list:[],
        ac_index:0,
      }
    },
    components: {
      search
    },
    methods:{
      // ---------------------------------------api
      // 获取全部数据
      async getCategories(){
        const {message} = await this.request({
          url:"/api/public/v1/categories"
        });

        // 获取到全部数据
        this.all_list = message;

      },
      // ------------------------------------交互
      change(index){
        this.ac_index = index;
      }
    },
    onLoad(){
      // 
      this.getCategories();
    }
  }
</script>

<style scoped lang="less">
  scroll-view {
    height: 100%;
  }

  .category {
    display: flex;
    width: 100%;
    position: absolute;
    top: 100rpx;
    bottom: 0;

    .sup {
      width: 196rpx;
      background-color: #f4f4f4;

      text {
        display: block;
        height: 100rpx;
        text-align: center;
        line-height: 100rpx;
        font-size: 27rpx;
        color: #333;
        border-bottom: 1rpx solid #eee;

        &:last-child {
          border-bottom: none;
        }
        
        &.active {
          background-color: #FFF;
          color: #ea4451;
          position: relative;

          &::before {
            content: '';
            display: block;
            width: 8rpx;
            height: 60rpx;
            transform: translateY(-50%);
            background-color: #ea4451;

            position: absolute;
            left: 0;
            top: 50%;
          }
        }
      }
    }

    .sub {
      flex: 1;
      padding: 20rpx 18rpx;

      .thumb {
        width: 100%;
        height: 180rpx;
      }

      .children {
        text-align: center;
        color: #333;

        .title {
          display: inline-block;
          margin: 40rpx 0 20rpx;
          font-size: 30rpx;

          &::before {
            content: '/';
            margin-right: 20rpx;
            color: #666;
          }

          &::after {
            content: '/';
            margin-left: 20rpx;
            color: #666;
          }
        }
      }

      .brands {
        display: flex;
        flex-wrap: wrap;

        navigator {
          width: 33%;
          margin-bottom: 20rpx;
        }

        image {
          width: 120rpx;
          height: 120rpx;
        }

        text {
          display: block;
          font-size: 24rpx;
        }
      }
    }
  }
</style>
