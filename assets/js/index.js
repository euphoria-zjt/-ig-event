$(function () {
  //   调用 getUserInfo 获取用户基本信息
  getUserInfo();
  let layer = layui.layer;
  // 点击按钮实现退出功能
  $("#btnLogout").on("click", function () {
    //   提示用户是否确认退出
    layer.confirm(
      "确定退出登录吗宝贝?",
      { icon: 3, title: "提示" },
      function (index) {
        //do something
        //    清空本地存储的 token
        localStorage.removeItem("token");
        //   重新跳转到页面
        location.href = "/login.html";
        //   关闭confrim询问框
        layer.close(index);
      }
    );
  });
});
// 获取用户基本信息
function getUserInfo() {
  $.ajax({
    method: "GET",
    url: "/my/userinfo",
    //   headers就是请求头配置对象
    // headers: {
    //   Authorization: localStorage.getItem("token") || "",
    // },
    success: function (res) {
      if (res.status !== 0) {
        return layui.layer.msg("获取用户信息失败！");
      }
      renderAvatar(res.data);
    },
    // 无论成功还是失败最终都会调用complete函数
    // complete: function (res) {
    //   //   console.log("执行的complete的回调");
    //   //   console.log(res);
    //   // 在回调函数中可以使用responseJSON那倒服务器响应回来的数据
    //   if (
    //     res.responseJSON.status == 1 &&
    //     res.responseJSON.message == "身份认证失败！"
    //   ) {
    //     //1强制清空token
    //     localStorage.removeItem("token");
    //     //2强制跳转到登录页
    //     location.href = "/login.html";
    //   }
    // },
  });
}
// 渲染用户头像
function renderAvatar(user) {
  // 获取用户名的名称
  let name = user.nickname || user.username;
  // 设置欢迎文本
  $("#welcome").html("欢迎&nbsp;&nbsp;" + name);
  // 按需渲染头像
  if (user.user_pic !== null) {
    //   渲染图片头像
    $(".layui-nav-img").attr("src", user.user_pic).show();
    $(".text-avatar").hide();
  } else {
    //    渲染文本头像
    $(".layui-nav-img").hide();
    let first = name[0].toUpperCase();
    $(".text-avatar").html(first).show();
  }
}
