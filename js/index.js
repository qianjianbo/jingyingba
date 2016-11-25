/**
 * Created by lanou on 16/9/18.
 */

var btns = document.querySelectorAll(".banner_list li");
var pics = document.querySelectorAll(".banner_cont li");
var length = btns.length;
for(var i = 0; i<length;i++){
    btns[i].index=i;
    btns[i].onclick=function () {
        for(var i = 0;i<length;i++){
            pics[i].className='';
            btns[i].className='';
        }
        pics[this.index].className="on";
        btns[this.index].className="on";
    }
}

var scrolldelay = null;
function pageScroll(){

    window.scrollBy(0,-15);
    scrolldelay=setTimeout('pageScroll()',1);

    if(document.body.scrollTop<=10)clearTimeout(scrolldelay);

}

var prev = document.querySelector(".cooperation_left");
var next =document.querySelector(".cooperation_right");
var ul =document.querySelector(".lun");
var left = 0;
var width = ul.clientWidth;
width = 3340;
prev.onclick=function () {
    left -= 167;
    ul.style.left = left + "px";
    if(Math.abs(left) >=width/2){
        left=0;
    }
}
next.onclick=function () {
    left += 167;
    if(ul.offsetLeft >= 0){
        left= -1670;
    }
    ul.style.left = left + "px";
}


