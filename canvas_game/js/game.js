/*游戏主程序*/
function game(canvas,cobj,runImg,jumpImg,hinderImg,zidanImg,foodImg,footm,flaym,fenshubox,julibox,lifebox,endfenshubox){
    this.canvas=canvas;
    this.width=canvas.width;
    this.height=canvas.height;
    this.cobj=cobj;
    this.runImg=runImg;
    this.jumpImg=jumpImg;
    this.hinderImg=hinderImg;
    this.zidanImg=zidanImg;
    this.foodImg=foodImg;
    this.fenshubox=fenshubox;
    this.juliubox=julibox;
    this.lifebox=lifebox;
    this.footm=footm;
    this.flaym=flaym;
    this.person =new person(canvas,cobj,runImg,jumpImg);
    this.speed=20;
    this.hinderArr=[];
    this.score=0;
    this.life=2;
    this.isfire = false;
    this.zidan=new zidan(canvas,cobj,zidanImg);
    this.endfenshubox=endfenshubox;
    this.timer={};
    this.isrun=false;

    /*move*/
    this.num = 0;
    this.back = 0;
    this.num2=0;
    this.step=5000+parseInt(5*Math.random())*1000;

    this.flag=false
    this.inita=0;
    this.speeda=5;
    this.r=200;
    this.y=this.person.y;
}
game.prototype={
    play:function(){
        this.run();
        this.key();
        this.mouse();
    },
    run:function(){
        this.name=prompt("请输入用户名","玩家");
        var that = this;
        that.timer.t1=setInterval(function(){
            that.move();
        },50)
    },
   move:function () {
        var that = this;
       /*
       * 函数:代码复用    类   实例化
       * this 指向实例化地址 保持一致
       * */
        that.footm.play();
        // var num = 0;
        // var back = 0;
        // var num2=0;
        // var step=5000+parseInt(5*Math.random())*1000;
        // this.name=prompt("请输入用户名","玩家");
        // that.timer.t1=setInterval(run,50)
        // function move(){
            that.person.num++;
            that.back -= that.speed;
            that.cobj.clearRect(0, 0, that.width, that.height);

            if (that.person.status == "runImg"){
                that.person.state = that.person.num%8;
            } else if (that.person.status == "jumpImg") {
                that.person.state = 0;
                that.footm.pause();
                that.flaym.play();
            }
            /*障碍物*/
            if(that.num2%that.step==0){
                that.num2=0;
                that.step=5000+parseInt(5*Math.random())*1000;
                var hinderObj=new hinder(that.canvas,that.cobj,that.hinderImg);
                hinderObj.state=Math.floor(that.hinderImg.length*Math.random());
                that.hinderArr.push(hinderObj);
            }
       that.num2+=50;
            for(var i=0;i<that.hinderArr.length;i++){
                that.hinderArr[i].x-=that.speed;
                that.hinderArr[i].draw();
                if(hitPix(that.canvas,that.cobj,that.person,that.hinderArr[i])){
                    if(!that.hinderArr[i].flag) {
                        that.life--;
                        that.lifebox.innerHTML=that.life;
                        xue(that.cobj, that.person.x + that.person.width / 2, that.person.y + that.person.height / 2,"red");
                        if(that.life<=0){
                            clearInterval(that.timer.t1)
                            // 任务失败 失败按钮
                            var notice=$(".notice");
                            var over=$(".ts-btn1");
                            notice.css({"ainimation":"tabledown 2s","display":"block"});
                            /*存储*/
                            if(that.life == 0){
                                ////////////////
                                var messages=localStorage.messages?JSON.parse(localStorage.messages):[];

                                var temp={name:that.name,score:that.score};
                                // 排序
                                if(messages.length>0){
                                    messages.sort(function(a,b){
                                        return a.score<b.score;
                                    });
                                    if(messages.length==3){
                                        if(temp.score>messages[messages.length-1].score){
                                            messages[messages.length-1]=temp;
                                        }
                                    }else if(messages.length<3){
                                        messages.push(temp);
                                    }
                                }else{
                                    messages.push(temp);
                                }
                                localStorage.messages=JSON.stringify(messages);
                                messages.push(temp);
                                // location.reload();
                                that.over();
                                ////////////////
                            }
                            /*
                            * 实例ajax对象
                            * 传参 方式 地址 同步异步 服务器用户名密码
                            * obj.send() 发送请求
                            * */
                            over.on("click",function(){
                                location.reload();
                            })
                        }
                    }
                    that.hinderArr[i].flag=true;
                }
                if(that.hinderArr[i].x+that.hinderArr[i].width<that.person.x){
                    if(!that.hinderArr[i].flag&&!that.hinderArr[i].flag) {
                        that.score+=100;
                        that.fenshubox.innerHTML=that.score;
                        if(that.score%3==0){
                            that.speed+=1;
                        }
                    }
                    that.hinderArr[i].flag=true;
                }
                //子弹碰撞障碍物
                if(that.isfire){
                    if(hitPix(that.canvas,that.cobj,that.zidan,that.hinderArr[i])){
                        that.hinderArr.splice(i,1);
                        that.cobj.clearRect(0,0,that.width,that.height);
                        that.score=that.score+100;
                        that.fenshubox.innerHTML=that.score;
                    }
                }

            }
            if(that.isfire){
                that.zidanspeedx+=that.zidan.jia;
                that.zidan.x+=that.zidan.speedx;
                that.zidan.draw();
            }
            that.person.draw();
            that.person.update();
            that.canvas.style.backgroundPositionX = that.back + "px";
            that.juliubox.innerHTML=parseInt(Math.abs(that.back/100));
        // }
    },

    key:function(){
        var that=this;
        var flag=true;
        $(document).keydown(function(e){
            if(e.keyCode==32){
                that.flaym.play();
                that.person.status="jumpImg";
                if(!flag){
                    return;
                }
                //flag=false;
                //var inita=0;
                //var speeda=5;
               // var r=200;
               // var y=that.person.y;
                that.timer.t2=setInterval(function(){
                    // inita+=speeda;
                    // if(inita>=180){
                    //     that.person.y=y;
                    //     clearInterval(that.timer.t2);
                    //     that.person.status="runImg";
                    //     clearInterval(that.timer.t2);
                    //     flag=true;
                    // }
                    // var top=Math.sin(inita*Math.PI/180)*r;
                    // that.person.y=y-top;
                    that.move2();
                },30)
            }else if(e.keyCode==38){
                if(!that.isrun){
                    for(var i in that.timer){
                        clearInterval(that.timer[i]);
                        that.footm.pause();
                    }
                    that.isrun=true;
                }else if(that.isrun){
                    that.timer.t1=setInterval(function(){
                        that.move();
                    },50);
                    if(!that.flag){
                        clearInterval(that.timer.t2);
                        that.timer.t2=setInterval(function(){
                            that.move2();
                        },50);
                    }
                    that.isrun=false;
                }
            }
        })
    },
    move2:function () {
        var that=this;
        that.inita+=that.speeda;
        var top=Math.sin(that.inita*Math.PI/180)*that.r;
        if(that.inita>=180){
            clearInterval(that.timer.t2);
            that.flaym.play();
            that.person.status="runImg";
            that.person.y=that.y;
            that.flag=true;
            that.inita=0;
        }else{
            that.person.y=that.y-top;
        }
    },

    mouse:function(){
        var that = this;
        $(document).keydown(function(e){
            if(e.keyCode==74){
                that.zidan.x=that.person.x+that.person.width/2;
                that.zidan.y=that.person.y+that.person.height/6;
                that.zidan.speedx=5;
                that.isfire=true;
            }
        })
    },
    /*游戏结束*/
    over:function(){
        var that=this;
        for(var i in this.timer){
            clearInterval(this.timer[i]);  //关闭所有的计时器
        }
        var over=document.querySelector(".notice");
        over.style.animation="start 2s ease forwards";
        //记录分数
        var tishi1=document.querySelector(".tishi1");
        tishi1.innerHTML=this.score;
        var lis=document.querySelector(".notice ul");
        var messages=localStorage.messages?JSON.parse(localStorage.messages):[];
        var str="";
        for (var i = 0; i < messages.length; i++) {
            str+="<li>"+messages[i].name+"："+messages[i].score;
        }
        lis.innerHTML=str;
        that.footm.pause();
    }
}

/*粒子动画*/
function lizi(cobj){
    this.cobj = cobj;
    this.x = 200;
    this.y = 300;
    this.r = 1+2*Math.random();
    this.color = "red";
    this.speedx = 3-Math.random()*6;
    this.speedy = 3-Math.random()*6;
    this.speedr = 0.1;
    this.zhongli = 0.3;
}
lizi.prototype = {
    draw:function(){
        this.cobj.save();
        this.cobj.translate(this.x,this.y);
        this.cobj.beginPath();
        this.cobj.fillStyle = this.color;
        this.cobj.arc(0,0,this.r,0,2*Math.PI);
        this.cobj.fill();
        this.cobj.restore();
    },
    update:function(){
        this.x += this.speedx;
        this.speedy += this.zhongli;
        this.y += this.speedy;
        this.r -= this.speedr;
    }
}
function xue(cobj,x,y){
    var arr = [];

    for(var i = 0;i<30;i++)
    {
        var obj = new lizi(cobj);
        obj.x = x;
        obj.y = y;
        arr.push(obj);
    }
    var t = setInterval(function(){
        for(var i = 0;i<arr.length;i++)
        {

            arr[i].draw();
            arr[i].update();

            if(arr[i].r<0){
                arr.splice(i,1);
            }
        }
        if(arr.length==0){
            clearInterval(t);
        }
    })
}
/*子弹动画*/
function zidan(canvas,cobj,zidanImg){
    this.canvas = canvas;
    this.zidanImg=zidanImg;
    this.cobj = cobj;
    this.x = 0;
    this.y = 0;
    this.width = 150;
    this.height = 110;
    this.speedx = 50;
    this.jia = 100;
    this.state=0;
}
zidan.prototype = {
    draw:function(){
        this.cobj.save();
        this.cobj.translate(this.x,this.y);
        this.cobj.drawImage(this.zidanImg[this.state],0,0,150,110,0,0,this.width,this.height)
        this.cobj.restore();
    }
}
/*创建人物*/
function person(canvas,cobj,runImg,jumpImg){
    this.x=100;
    this.y=480;
    this.endy=480;
    this.width=210;
    this.height=229;
    this.canvas=canvas;
    this.cobj=cobj;
    this.runImg=runImg;
    this.jumpImg=jumpImg;
    this.status= "runImg";
    this.state=0;
    this.num=0;
    this.speed=6;
    this.zhongli=3;
}
person.prototype={
    draw:function(){
        this.cobj.save();
        this.cobj.translate(this.x,this.y);
        this.cobj.drawImage(this[this.status][this.state],0,0,210,229,0,0,this.width,this.height);
        this.cobj.restore();
    },
    update:function(){
        // if(this.y>this.endy){
        //     this.y=this.endy;
        // }else if(this.y<this.endy){
        //     this.speed+=this.zhongli;
        //     this.y+=this.speed;
        // }
        this.x=this.speed;
    }
}
/*创建障碍物对象*/
function hinder(canvas,cobj,hinderImg){
    this.canvas=canvas;
    this.cobj=cobj;
    this.hinderImg=hinderImg;
    this.state=0;
    this.width=120;
    this.height=150;
    this.x=canvas.width;
    this.y=500;
}
hinder.prototype={
    draw:function(){
        this.cobj.save();
        this.cobj.translate(this.x,this.y);
        this.cobj.drawImage(this.hinderImg[this.state],0,0,120,150,0,0,this.width,this.height);
        this.cobj.restore();
    }
}
/*创建食物对象*/
function food(canvas,cobj,foodImg){
    this.canvas=canvas;
    this.cobj=cobj;
}
