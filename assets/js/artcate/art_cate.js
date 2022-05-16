$(function () {
  let layer = layui.layer;
  let form = layui.form;
  initArtCateList();

  // 获取文章分类的列表
  function initArtCateList() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        // console.log(res);
        let htmlStr = template("tpl_table", res);
        $("tbody").html(htmlStr);
      },
    });
  }

  let indexAdd = null;
  $("#btnAddCate").on("click", function () {
    indexAdd = layer.open({
      type: 1,
      area: ["500px", "300px"],
      title: "添加文章分类",
      content: $("#dialog_add").html(),
    });
  });
  // 通过代理的方式为表单绑定submit提交事件
  $("body").on("submit", "#form_add", function (e) {
    e.preventDefault();
    $.ajax({
      method: "POST",
      url: "/my/article/addcates",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("新增分类失败！");
        }
        initArtCateList();
        layer.msg("新增分类成功！");
        //   根据索引关闭对应的弹出层
        layer.close(indexAdd);
      },
    });
  });
  // 通过代理的形式为btn_edit添加点击事件
  let indexEdit = null;
  $("tbody").on("click", "#btn_edit", function () {
    //   弹出一个修改信息文章分类的层
    indexEdit = indexAdd = layer.open({
      type: 1,
      area: ["500px", "300px"],
      title: "修改文章分类",
      content: $("#dialog_edit").html(),
    });

    let id = $(this).attr("data-id");
    //  发起请求获取对应的数据
    $.ajax({
      method: "GET",
      url: "/my/article/cates/" + id,
      success: function (res) {
        form.val("form_edit", res.data);
      },
    });
  });
  // 通过代理的形式为修改分类绑定submit事件、
  $("body").on("submit", "#form_edit", function (e) {
    e.preventDefault();
    $.ajax({
      method: "POST",
      url: "/my/article/updatecate",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("更新分类失败！");
        }
        layer.msg("更新分类成功");
        layer.close(indexEdit);
        initArtCateList();
      },
    });
  });
  // 通过代理的形式为删除按钮事件
  $("tbody").on("click", ".btn_delete", function () {
    //   提示用户是否要删除
    let id = $(this).attr("data-id");
    layer.confirm("确定删除?", { icon: 3, title: "提示" }, function (index) {
      $.ajax({
        method: "GET",
        url: "/my/article/deletecate/" + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg("删除失败！");
          }
          layer.msg("删除成功");
          layer.close(index);
          initArtCateList();
        },
      });
    });
  });
});
