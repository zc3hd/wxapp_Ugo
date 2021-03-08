export default function(conf) {
  const { baseUrl } = conf;

  // console.log(baseUrl);
  return function(Vue) {

    Vue.prototype.request = async function(opts) {
      const {
        url,
        data,
        method,
        header
      } = opts;

      // 1.显示加载效果
      uni.showLoading({
        title: "正在加载...",
        mask: true,
      });

      // 请求数据，返回
      const res = await uni.request({
        url: baseUrl + url,
        data,
        method,
        header
      });

      // 2.加载完成后，隐藏效果
      uni.hideLoading();

      return res[1].data;
    }
  }
}