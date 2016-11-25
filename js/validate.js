/*
* author:wanglei
* time:2016-05-03
*/

function change_code(obj){
	$("#code").attr("src",verifyURL + '/' + Math.random());
	return false;
	}
	
function check_code(obj){
	$("#tcode").attr("src",verifyURL + '/' + Math.random());
	return false;
	}
//注册发送验证码
function sendSms(obj){
		//console.log('sendsms');
		
		$('#re_tel').focus();
		$('#re_tel').blur();
		$('div.register input[name=code]').focus();
		$('div.register input[name=code]').blur();

		if($('#re_tel').parent().next().hasClass('error')){
			return;
		}

		if($('div.register input[name=code]').parent().parent().next().hasClass('error')){
			return;
		}


		if($('a.verification_right').hasClass('on')){
			return;
		}
	
		//注册发送验证码
		var data = {
			mobile : $('#re_tel').val(),
			code: $('div.register input[name=code]').val(),
			agent : 0
		}
		
		if($(".verification_right").hasClass("on")){
			return;
		}
		$("a.verification_right").addClass("on");
		console.log(data);
		$.post(APP + 'User/Regist/sendSms',data, function (res) {
			if ('string' == typeof(res)){
				res = $.parseJSON(res);
			}
			console.log(res);
			if( 1010 == parseInt(res.status) ){
				show_push_status();	
			}else{
				if(!res.info){
					res.info = '短信发送异常';
				}
				if(2099 == parseInt(res.status)){
					$('div.register input[name=code]').parent().next().click();
					$('div.register input[name=code]').parent().parent().next().html('<em></em>'+res.info).addClass('error');
					$('div.register input[name=code]').focus();
				}else{
					$('#re_tel').parent().next().html('<em></em>'+res.info).addClass('error');
					$('#re_tel').focus();
				}
				$("a.verification_right").removeClass("on");
			}
			//console.log(res);
			//alert(console.log(res));
		}, 'json');
	
}

function show_push_status(){
	console.log('show_push_status');
	var txt;
	var num=60;
	function time(){
		num -= 1;
		if(num<1){
			txt='获取验证码';
			$("a.verification_right").removeClass("on");							
			clearInterval(cltime);
		}else{
			txt=num+'s后重新发送';
		};
		$("a.verification_right").html(txt);
	};
	var cltime=setInterval(time,1000);
	setTimeout(time,0);
}






	
var validate = {	
	phone : false,
	password : false,
	code : false,
	
	smsphone : false,
	smscode : false,
	passwsF : false,
	passwdS : false,
	agreecheck : true
};

var msg = '';
$(function(){
	//前端登录表单验证
	var login = $('form[name=login]');
    //登录提交事件
	login.submit(function () {
		if($('input[name=submit]',login).hasClass('on')){
			return false;
		}

		console.log(validate);

		//依次触发失去焦点动作
		$( 'input[name=phone]', login ).trigger('blur');
		$( 'input[name=password]', login ).trigger('blur');
		$( 'input[name=code]', login ).trigger('blur');

		if (validate.phone && validate.password && validate.code) {
			//console.log('submit');
			$.cookie('rem','0');
			$.cookie('phone', '', { expires: -1 });
			$.cookie('password', '', { expires: -1 });

			if($('input[name=auto]', login).is(':checked')){
				$.cookie('rem','1');
				$.cookie('phone', $( 'input[name=phone]', login ).val());
				$.cookie('password', $( 'input[name=password]', login ).val());
			}

			$('input[name=submit]',login).addClass('on');


			console.log('submit');
	        $(this).find('input[type=submit]').addClass('on');
	        $('.remembercont').next().empty();
	        $.ajax({
	            cache: true,
	            type: "POST",
	            url:login.attr('action'),
	            data:login.serialize(),
	            async: true,
	            error: function(request) {
	            	$('.remembercont').next('表单提交失败');
	            	$('input[name=submit]',login).removeClass('on');
	            },
	            success: function(data) {
	                if('string' == typeof(data)){
	                	data = $.parseJSON(data);
	                }
	                console.log(data);

	                $('input[name=submit]',login).removeClass('on');

	                if(1010 != parseInt(data.status)){
	                	$('.remembercont').next().html('<em></em>'+data.info);
	                	$('.remembercont').next().addClass('error');
	                	if(2000 == parseInt(data.status)){
	                		$('.logincont .verification_right').click();
	                	}
	                	return false;
	                }

	                window.location.href = data.url;
	            }
	        });
		}

		return false;
	});

    //验证登录用户名
	$( 'input[name=phone]', login ).blur( function () {
		var phone = $(this).val();
		var div = $(this).parent().next();

	    //不能为空
		if (!phone) {
			msg = '手机号码不能为空';
			div.html('<em></em>'+msg).addClass('error');
			validate.phone = false;
			return;
		}
	
		var reg=/(1[3-9]\d{9}$)/;
		if(!reg.test(phone)){
			msg = '手机号码格式不正确';
			div.html('<em></em>'+msg).addClass('error');
			validate.phone = false;
			return;
		
		}
		msg = '';
			validate.phone = true;
			div.html('<em></em>'+msg).removeClass('error');
		});
    	//验证登录密码
		$( 'input[name=password]', login ).blur( function () {				  								  
			var password = $(this).val();
				var div = $(this).parent().next();
	
			if (!password) {
				msg = '密码不能为空';
				div.html('<em></em>'+msg).addClass('error');
				validate.password = false;
				return;
			}
			msg = '';
			validate.password = true;
			div.html('<em></em>'+msg).removeClass('error');
	});
	 //验证验证码
	$('input[name=code]',login).blur(function(){
		var verify = $(this).val();
		var div = $(this).parent().next().next();

		if(!verify){
			msg = '请填写验证码';
			div.html('<em></em>'+msg).addClass('error');
			validate.code = false;
			return;
		}
		msg = '';
		validate.code = true;
		div.html('<em></em>'+msg).removeClass('error');
    });

	
	//注册新用户表单验证
	var regist = $('form[name=regist]');
    //注册新用户提交事件
	regist.submit(function () {
		if($('input[name=submit]',regist).hasClass('on')){
			return false;
		}

		console.log(validate);

		//依次触发失去焦点动作
		$( 'input[name=smsphone]', regist ).trigger('blur');
		$( 'input[name=smscode]', regist ).trigger('blur');
		$( 'input[name=code]', regist ).trigger('blur');
		$( 'input[name=passwdF]', regist ).trigger('blur');
		$( 'input[name=passwdS]', regist ).trigger('blur');
		$( 'input[name=agreecheck]', regist ).change();

		if (validate.smsphone && validate.smscode && validate.code && validate.passwsF && validate.passwdS && validate.agreecheck) {
			
			console.log('submit');
			$('.agree').next().addClass('error');
	        $(this).find('input[type=submit]').addClass('on');
	        $('.agree').next().empty();
	        $.ajax({
	            cache: true,
	            type: "POST",
	            url:regist.attr('action'),
	            data:regist.serialize(),
	            async: true,
	            error: function(request) {

	            	$('.agree').next().html('<em></em>表单提交失败');
	            	$('input[name=submit]',regist).removeClass('on');
	            },
	            success: function(data) {
	                if('string' == typeof(data)){
	                	data = $.parseJSON(data);
	                }
	                console.log(data);

	                $('input[name=submit]',regist).removeClass('on');

	                if(1010 != parseInt(data.status)){
	                	$('.agree').next().html('<em></em>'+data.info);
	                	return false;
	                }

	                $('.agree').next().html('<em></em>'+data.info);

	                setTimeout(function(){window.location.href=data.url;},3000);
	            }
	        });

			return false;
		}

		return false;

	});

//注册用户帐号
	$('input[name=smsphone]',regist ).blur( function (){
	  var smsphone = $( this ).val();
		var div = $(this).parent().next();
		 //不能为空
		if (!smsphone) {
			msg = '手机号码不能为空';
			div.html('<em></em>'+msg).addClass('error');
			validate.smsphone = false;
			return;
		}
	 //正则判断
		var reg=/(1[3-9]\d{9}$)/;
		if(!reg.test(smsphone)){
			msg = '手机号码格式不正确';
			div.html('<em></em>'+msg).addClass('error');
			validate.smsphone = false;
			return;
		}
      
		msg = '';
		validate.smsphone = true;
		div.html('<em></em>'+msg).removeClass('error');
	});
    //验证码
	$( 'input[name=smscode]', regist ).blur( function () {
		var smscode = $( this ).val();
		var div = $( this ).parent().parent().next();
		if (!smscode) {
			msg = '验证码不能为空';
			div.html('<em></em>'+msg).addClass('error');;
			validate.smscode = false;
			return;
		}
	    //正则判断
		var reg = /^\d{6}$/;
		if (!reg.test(smscode)) {
			msg = '请输入正确的验证码';
			div.html('<em></em>'+msg).addClass('error');;
			validate.smscode = false;
			return;
		}
		msg = '';
		validate.smscode = true;
		div.html('<em></em>'+msg).removeClass('error');
	});
	//图形验证码
	$( 'input[name=code]', regist ).blur( function () {
		var code = $( this ).val();
		var div = $( this ).parent().parent().next();
		if (!code) {
			msg = '图形验证码不能为空';
			div.html('<em></em>'+msg).addClass('error');;
			validate.code = false;
			return;
		}
		msg = '';
		validate.code = true;
		div.html('<em></em>'+msg).removeClass('error');
	});
//验证密码
	$( 'input[name=passwdF]',regist).blur( function () {
		var pwd = $( this ).val();
		var div = $( this ).parent().next();
		if (!pwd) {
			msg = '密码不能为空';
			div.html('<em></em>'+msg).addClass('error');
			validate.passwsF = false;
			return;
		}

		msg = '';
		validate.passwsF = true;
		div.html('<em></em>'+msg).removeClass('error');
	} );
//确认密码
	$( 'input[name=passwdS]', regist ).blur( function () {
		var passwd = $( this ).val();
		var div = $( this ).parent().next();

		if (!passwd) {
			msg = '请再次输入密码';
			div.html('<em></em>'+msg).addClass('error');
			validate.passwdS = false;
			return;
		}

		if ( passwd != $( 'input[name=passwdF]', regist ).val() ) {
			msg = '两次密码不一致';
			div.html('<em></em>'+msg).addClass('error');
			validate.passwdS = false;
			return;
		}
        
		msg = '';
		div.html('<em></em>'+msg).removeClass('error');
		validate.passwdS = true;
	
	});

	//同意条款
	$('input[name=agreecheck]').change(function() {

		var htm = '<em></em>请勾选同意网站条款';
		$(this).parent().next().addClass('error');
		validate.agreecheck=false;
		if($(this).is(':checked')){
			htm = '<em></em>';
			$(this).parent().next().removeClass('error');
			validate.agreecheck=true;
		}
		$(this).parent().next().html(htm);

		console.log(validate);
	});
})

