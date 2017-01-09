window.onload=function(){
    /*获取*/
    /*游戏规则*/
    var canvas=document.getElementsByTagName("canvas")[0];
    var cobj=canvas.getContext("2d");
    canvas.width=document.documentElement.clientWidth;
    canvas.height=document.documentElement.clientHeight;
    canvas.style.background="black url(img/bg2.png) repeat-x top";
    /*获取*/
    var runImg=document.querySelectorAll(".run");
    var jumpImg=document.querySelectorAll(".jump");
    var hinderImg=document.querySelectorAll(".hinder");
    var zidanImg=document.querySelectorAll(".zidanp");
    var footm=document.querySelector(".foot-m");
    var flaym=document.querySelector(".flay-m");
    var fenshubox=document.querySelector(".fenshu");
    var endfenshubox=document.querySelector(".tishi1");
    var julibox=document.querySelector(".juli");
    var setbox=document.querySelector(".set");
    var lifebox=document.querySelector(".life");
    var foodImg=document.querySelectorAll(".food");
    /*记分牌*/
    /*开始*/
    var gameObj=new game(canvas,cobj,runImg,jumpImg,hinderImg,zidanImg,foodImg,footm,flaym,fenshubox,julibox,lifebox,endfenshubox);
    /*选项卡*/
    var table=$(".table");
    /*遮罩*/
    var mask=$(".mask");
    /*开始按钮*/
    var start=$(".start");
    start.one("click",function(){
        table.css("animation","tableup 2s forwards");
        mask.css("animation","beginup 2s forwards");
        gameObj.play();
    })
}