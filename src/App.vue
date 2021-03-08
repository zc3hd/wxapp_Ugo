<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="less">
  @import './fonts';

  image {
    width: 100%;
    height: 100%;
    vertical-align: middle;
  }

  input {
    display: block;
    height: 100%;
    padding: 0;
    box-sizing: border-box;
    outline: none;
  }

  .tips {
    text-align: center;
    margin-top: 200rpx;
    font-size: 36rpx;
    color: #666;
  }
</style>
