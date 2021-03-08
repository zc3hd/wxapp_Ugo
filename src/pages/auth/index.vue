<template>
  <view>
    <button type="primary" open-type="getUserInfo" @getuserinfo="getInfo">微信登录</button>
  </view>
</template>

<script>
  export default {
    // 页面一加载后：
    async onLoad(){
      // JS
      const [err,res] = await uni.getUserInfo();
      
      // 没有登录数据，结束
      if (!res) return;

      // 获取token数据
      this.getToken(res);      
    },
    methods:{
      // 获取用户信息
      getInfo(res){
        this.getToken(res.detail);
      },
      // 获取token信息
      async getToken(res){
        // 把拿到的数据解构
        const {
          encryptedData,
          iv,
          rawData,
          signature
        } = res;


        // code的信息
        const [err,info] = await uni.login();

        // 获取token
        const {message} = await this.request({
          url:"/api/public/v1/users/wxlogin",
          method:"POST",
          data:{
            encryptedData,
            iv,
            rawData,
            signature,
            code:info.code,
          }
        });


        // 1.保存到本地
        uni.setStorageSync("token",message.token);

        // 2.返回到上一页
        uni.navigateBack();

      }
    }
  }
</script>

<style lang="less" scoped>
  button {
    width: 600rpx;
    margin: 200rpx auto 0;
  }
</style>