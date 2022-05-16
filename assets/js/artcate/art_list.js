$(function () {
  let layer = layui.layer;
  // 定义一个查询参数的对象,以后请求数据的时候,
  // 定义美化时间的过滤器
  let laypage = layui.laypage;
  let form = layui.form;

  // 定义美化时间的过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date);

    var y = dt.getFullYear();
    var m = padZero(dt.getMonth() + 1);
    var d = padZero(dt.getDate());

    var hh = padZero(dt.getHours());
    var mm = padZero(dt.getMinutes());
    var ss = padZero(dt.getSeconds());

    return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
  };

  // 定义补零的函数
  function padZero(n) {
    return n > 9 ? n : "0" + n;
  }
  //需要将请求参数提交到服务器
  let q = {
    pagenum: 1, //页面值，默认请求第一页的数据
    pagesize: 2, //每页显示几条数据,默认两条
    cate_id: "", //文章分类的 Id
    state: "", //文章发布的状态
  };
  initTable();
  initCode();
  //获取文章列表数据的方法
  function initTable() {
    $.ajax({
      method: "GET",
      url: "/my/article/list",
      data: q,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取文章列表失败！");
        }
        // console.log(res.data);
        // 使用模板引擎渲染页面的数据
        let htmlStr = template("tpl-table", res);
        $("tbody").html(htmlStr);
        //渲染分页的方法
        renderPage(res.total);
      },
    });
  }

  //初始化文章分类的方法
  function initCode() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取分类数据失败");
        }
        // 调用模板引擎渲染分类的可选项
        let htmlStr = template("tpl-cate", res);
        // console.log(htmlStr);
        $("[name=cate_id]").html(htmlStr);
        form.render();
      },
    });
  }

  // 为筛选表单绑定submit事件
  $("form-search").on("submit", function (e) {
    e.preventDefault();
    // 获取表单中选中项的值
    let cate_id = $("[name=cate_id]").val();
    let state = $("[name=state]").val();
    //为查询参数对象 q中对应的属性赋值
    q.cate_id = cate_id;
    q.state = state;
    initTable();
  });

  // 定义渲染分页的方法
  function renderPage(total) {
    // 调用 laypage.render() 方法来渲染分页的结构
    laypage.render({
      elem: "pageBox", // 分页容器的 Id
      count: total, // 总数据条数
      limit: q.pagesize, // 每页显示几条数据
      curr: q.pagenum, // 设置默认被选中的分页
      layout: ["count", "limit", "prev", "page", "next", "skip"],
      limits: [2, 3, 5, 10],
      // 分页发生切换的时候，触发 jump 回调
      // 触发 jump 回调的方式有两种：
      // 1. 点击页码的时候，会触发 jump 回调
      // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
      jump: function (obj, first) {
        // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
        // 如果 first 的值为 true，证明是方式2触发的
        // 否则就是方式1触发的
        console.log(first);
        console.log(obj.curr);
        // 把最新的页码值，赋值到 q 这个查询参数对象中
        q.pagenum = obj.curr;
        // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
        q.pagesize = obj.limit;
        // 根据最新的 q 获取对应的数据列表，并渲染表格
        // initTable()
        if (!first) {
          initTable();
        }
      },
    });
  }
  // 通过代理的形式为删除按钮绑定事件
  $("tbody").on("click", ".btn-delete", function () {
    // 获取删除按钮的个数
    let len = $(".btn-delete").length;
    //获取到文章的id
    let id = $(this).attr("data-id");
    // 询问用户是否要删除
    layer.confirm("确认删除?", { icon: 3, title: "提示" }, function (index) {
      //do something
      $.ajax({
        method: "GET",
        url: "/my/article/delete/" + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg("删除文章失败！");
          }
          layer.msg("删除文章成功");
          //当数据删除完成后,需要判断当前这一页中,是否还有剩余数据
          //如果没有剩余的数据了,侧让页码值减一之后
          //重新调用initTable方法
          if (len == 1) {
            //如果len的值等于一,证明删除完毕之后页面上面没有任何数据了

            //页码值最小必须是一
            q.pagenum = q.pagenum == 1 ? 1 : q.pagenum - 1;
          }
          initTable();
        },
      });
      layer.close(index);
    });
  });
});
