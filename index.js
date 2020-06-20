//利用对象收编变量

var bird = {
    skyPosition:0,
    skyStep: 2,
    birdTop: 235,
    birdStepY: 0, //小鸟下坠步长
    startColor: "blue", //开始按钮初始颜色
    StartFlag: false,
    minTop:0,
    maxTop:570,
    /**
     * 初始化函数
     */
    init: function (elName) {
        this.initData(elName);
        this.animate();
        this.handle();
    },

    //动画 animate 管理所有动画   函数要做到单一职责原则
    animate: function () {
        var self = this;
        var count = 0;
        this.timer = setInterval(function () {
            self.skyMove();
            self.StartFlag && self.birdDrop();
            if(++count % 10 === 0){ //300ms执行一次==当函数执行10次那么birdJump才执行一次
                if (!self.StartFlag) {
                    self.birdJump();
                    self.startBound();
                }
                self.birdFly(count);

            }
        },30);

        this.startBound();
    },
    initData: function(elName){
        this.el = document.getElementById(elName);
        this.oBrid = this.el.getElementsByClassName("bird")[0];
        this.oStart = this.el.getElementsByClassName("start")[0];
        this.oMask = this.el.getElementsByClassName("mask")[0];
        this.oEnd = this.el.getElementsByClassName("end")[0];
        this.oScore = this.el.getElementsByClassName("score")[0];
    },
    handle: function () {
        this.handleStart();
    },
    handleStart: function () {
        var self = this;
        this.oStart.onclick = function () {
            //this代表oStart
            this.style.display = "none";
            self.oBrid.style.left = "80px";
            self.skyStep = 5;
            self.StartFlag = true;
        }
    },
    /**
     * 天空移动
     */
    skyMove: function () {
        // setInterval(function () {
            this.skyPosition -= this.skyStep;
            this.el.style.backgroundPositionX=this.skyPosition+"px";
        // },30);
    },
    /**
     * 小鸟蹦跳
     */
    birdJump: function () {
        // setInterval(function () {
           this.birdTop = this.birdTop == 235 ? 265 : 235;
           this.oBrid.style.top = this.birdTop+"px";
        // },300)
        // console.log(this.oBrid);
    },
    /**
     * 小鸟飞  与蹦跳是两个动作
     */
    birdFly: function(count){
        this.oBrid.style.backgroundPositionX = count % 3 * -30 + "px";
    },
    /**
     * 小鸟下降
     */
    birdDrop: function(){
        this.birdTop += ++this.birdStepY;
        this.oBrid.style.top = this.birdTop+"px";
        this.collisionTest();//碰撞检测
    },
    /**
     *
     */
    collisionTest: function(){
        this.collisionBoundary();
        this.collisionPipo();
    },
    /**
     * 边界碰撞检测
     */
    collisionBoundary : function () {
        if( this.birdTop<this.minTop || this.birdTop > this.maxTop){
            this.gameOver();//游戏结束
        }
    },
    /**
     * 柱子碰撞检测
     */
    collisionPipo : function () {

    },
    /**
     * 游戏结束
     */
    gameOver: function(){
        this.oMask.style.display = "block";
        this.oEnd.style.display = "block";
        this.oBrid.style.display = "none";
        this.oScore.style.display = "none";
        clearInterval(this.timer);
    },
    /**
     * 开始按钮闪动
     */
    startBound: function () {
        this.oStart.classList.remove("start-"+this.startColor);
        this.startColor = this.startColor === "blue" ? "white" : "blue";
        this.oStart.classList.add("start-"+this.startColor);
    }
};


bird.init("game");