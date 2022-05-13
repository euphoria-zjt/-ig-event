// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
  // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
  options.url = "http://www.liulongbin.top:3007" + options.url;
  console.log(options.url);
  if (options.url.indexOf("/my/") !== -1) {
    options.headers = {
      Authorization: localStorage.getItem("token") || "",
    };
  }
  // 全局统一挂载complete函数
  options.complete = res => {
    //   console.log("执行的complete的回调");
    //   console.log(res);
    // 在回调函数中可以使用responseJSON那倒服务器响应回来的数据
    if (
      res.responseJSON.status == 1 &&
      res.responseJSON.message == "身份认证失败！"
    ) {
      //1强制清空token
      localStorage.removeItem("token");
      //2强制跳转到登录页
      location.href = "/login.html";
    }
  };
});
