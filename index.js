
//本地
var host = "http://127.0.0.1:8080"

var global_login_url = ""  //全局扫描登录url


//下单
function save_order(id, money) {
	var token = $.cookie("token");

	//因为微信登陆无法完成操作，所以暂时写死一个token，以便测试支付   此token可能过期，也可以先注释掉后端的登陆拦截
	token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0b21vcnJvd2NhdCIsImlkIjoxLCJuYW1lIjoia2ltIiwiaW1nIjoid3d3LnhkY2xhc3MubmV0IiwiaWF0IjoxNjI1NDU1NTEzLCJleHAiOjE2MjYwNjAzMTN9.yY4GI7o1n0_11Kz8zrEUhl3oPEFR2VLa-qRIz7mHIMg';

	//没有token
	if (!token || token == "") {
		//去登陆
		window.location.href = global_login_url;

	}

	//下单接口
	var url = host + "/user/api/v1/order/add?token=" + token + "&video_id=" + id;

	$('#pay_img').attr('src', url);
	$('#money').html("金额：" + money + "元");
}






$(function () {
	//获取商品列表
	function get_list() {
		$.ajax({
			type: 'get',
			url: host + "/api/v1/video/page?size=30&page=1",
			dataType: 'json',
			success: function (res) {
				var data = res.data;

				for (var i = 0; i < data.length; i++) {
					// console.log(data[i]);

					var video = data[i];
					var price = video.price / 100;

					var template = "<div class='col-sm-6 col-md-3'><div class='thumbnail'>" +
						"<img src='" + video.coverImg + "'alt='通用的占位符缩略图'>" +
						"<div class='caption'><h3>" + video.title + "</h3><p>价格:" + price + "元</p>" +
						"<p><a href='' onclick='save_order(" + video.id + "," + video.price / 100 + ")' data-toggle='modal' " +
						"data-target='#myModal' class='btn btn-primary' role='button'>立刻购买</a></p></div></div></div>"

					$(".row").append(template);

				}

			}
		})

	}

	//获取微信登陆二维码url
	function get_wechat_login() {
		//当前页面地址，用于登陆完成跳转回来
		var current_page = window.location.href;
		$.ajax({
			type: 'get',
			url: host + "/api/v1/wechat/login_url?access_page=" + current_page,
			dataType: 'json',
			success: function (res) {
				$("#login").attr("href", res.data);
				global_login_url = res.data;
			}
		})

	}

	//后端的登陆工作处理完毕并返回前端，前端获取传来的参数
	function get_params() {
		var params = window.location.search;//获取url中?后面的字符串,包括问号
		var obj = new Object();
		if (params.indexOf("?") != -1) {

			var str = params.substr(1);

			var strs = str.split("&");
			for (var i = 0; i < strs.length; i++) {
				var key = strs[i].split("=")[0];
				var value = strs[i].split("=")[1];
				obj[key] = value;
			}
		}

		return obj;


	}


	//设置头像和昵称
	function set_user_info() {
		var user_info = get_params();

		var head_img = $.cookie('head_img');
		var name = $.cookie('name');

		if (JSON.stringify(user_info) != '{}') {
			var head_img = user_info['head_img']
			var name = user_info['name'];
			var token = user_info['token']

			$('#login').html(name);
			$('#head_img').attr("src", head_img);
			
			$.cookie('token', token, { expires: 7, path: '/' });
			$.cookie('head_img', head_img, { expires: 7, path: '/' });
			$.cookie('name', name, { expires: 7, path: '/' });
		} else if (name && name != "") {
			$('#login').html(name);
			$('#head_img').attr('src', head_img);
		}
	}




	get_list();
	get_wechat_login();
	set_user_info();

})
