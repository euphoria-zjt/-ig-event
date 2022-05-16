$(function () {
  let layer = layui.layer;
  let form = layui.form;
  initCate();
  // 初始化富文本编辑器
  initEditor();
  //定义加载文章分类的方法
  function initCate() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("初始化文章分类失败！");
        }
        //调用模板引擎渲染下拉分类的菜单
        let htmlStr = template("tpl-cate", res);
        $("[name=cate_id]").html(htmlStr);
        form.render();
        // initCate();
      },
    });
  }

  // 1. 初始化图片裁剪器
  var $image = $("#image");

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: ".img-preview",
  };

  // 3. 初始化裁剪区域
  $image.cropper(options);

  //为选择封面绑定点击事件
  $("#btnChooseImage").on("click", function () {
    $("#coverFile").click();
  });

  //为coverFile绑定change事件
  $("#coverFile").on("change", function (e) {
    //获取到文件列表的数据
    let files = e.target.files;
    // console.log(e);
    //判断用户是否选择了文件
    if (files.length == 0) {
      return;
    }
    //   根据选择的文件，创建一个对应的 URL 地址：
    let newImgURL = URL.createObjectURL(files[0]);
    //为裁剪区重新设置图片
    $image
      .cropper("destroy") // 销毁旧的裁剪区域
      .attr("src", newImgURL) // 重新设置图片路径
      .cropper(options); // 重新初始化裁剪区域
  });

  //定义文章的发布状态
  let art_state = "已发布";
  //为存为草稿按钮绑定事件处理函数
  $("#btnSave2").on("click", function () {
    art_state = "草稿";
  });
  //为表单绑定submit事件
  $("#form-pub").on("submit", function (e) {
    // 阻止表单默认跳转行为
    e.preventDefault();
    //   基于 form表单，快速创建一个Formdata对象
    let fd = new FormData($(this)[0]);
    //   将文章的发布状态存到fd中
    fd.append("state", art_state);
    //    将封面裁剪后的图片，输出为一个文件对象
    $image
      .cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280,
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        //将对象文件存到fd中
        fd.append("cover_img", blob);
        //   调用发布文章的方法
        publishArticle(fd);
      });

    //   定义发布文章的方法
    function publishArticle(fd) {
      $.ajax({
        method: "POST",
        url: "/my/article/add",
        data: fd,
        // 如果向服务器提交的是 Formdata格式的数据必须
        //   要添加以下两个配置项
        contentType: false,
        processData: false,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg("发布文章失败！");
            }
            console.log(res);
          layer.msg("发布文章成功");
          location.href = "/article/art_list.html";
        },
      });
    }
  });
});
