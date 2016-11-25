/**
 * Created by lanou on 16/9/23.
 */
// 登录注册tab
var loginbtn = document.querySelector(".loginbtn");
var registerbtn = document.querySelector(".registerbtn");
var logincont = document.querySelector(".logincont");
var register= document.querySelector(".register");
var on = document.querySelector(".on");
registerbtn.onclick=function () {
    logincont.style.display="none";
    register.style.display="block";
    registerbtn.className= "on";
    loginbtn.className="";
};
loginbtn.onclick=function () {
    logincont.style.display="block";
    register.style.display="none";
    registerbtn.className= "";
    loginbtn.className="on";
};

