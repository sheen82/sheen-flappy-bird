//利用对象收编变量

var bird = {
    containerHeight : 0, //容器高度
    skyPosition:0,
    skyStep: 2,
    birdTop: 235,
    birdStepY: 0, //小鸟下坠步长
    startColor: "blue", //开始按钮初始颜色
    StartFlag: false,
    minTop:0,
    maxTop:570,
    pipeLength: 8,  //8对柱子
    pipeSpaceX: 300,  //柱子间距X轴
    pipeSpaceY: 150,  //柱子间距Y轴
    pipeArr:[], //[{up:dom, down:dom}]  存储创建的柱子
    score: 0, //加分
    //lastPipeIndex: 7, //记录最后一根柱子的索引
    pipeZeroIndexIsAddScore: false, //碰撞检测通过后的第0索引的柱子是否已经加分
    scoreArr: [], //存放结果分数的数组
    /**
     * 初始化函数
     */
    init: function (elName) {
        this.initData(elName);
        this.animate();
        this.handle();

        if (sessionStorage.getItem("game")){
            this.start();
        }
    },

    //动画 animate 管理所有动画   函数要做到单一职责原则
    animate: function () {
        var self = this;
        var count = 0;
        this.timer = setInterval(function () {
            self.skyMove();
            self.StartFlag && self.birdDrop();
            self.StartFlag && self.pipeMove();
            self.StartFlag && self.pipeWhile();
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
        this.oFinalScore = this.oEnd.getElementsByClassName("final-score")[0];
        this.oRankList = this.oEnd.getElementsByClassName("rank-list")[0];
        this.oReStart = this.oEnd.getElementsByClassName("restart")[0];
        this.containerHeight = this.el.offsetHeight;
        this.scoreArr = this.getScore();
        sessionStorage.setItem("game", true);
    },
    /**
     * 获取历史分数
     * @returns {[]|any}
     */
    getScore: function () {
        return  getLocal("score");
    },
    handle: function () {
        this.handleStart();
        this.handleRestStart();
        this.handleClick();
    },
    handleStart: function () {
        var self = this;
        this.oStart.onclick = function () {
            //this代表oStart
            self.start();
        }
    },
    handleRestStart: function () {
        this.oReStart.onclick= function (e) {
            location.reload();
        };
    },
    start: function () {
        this.oStart.style.display = "none";
        this.oScore.style.display = "block";
        this.oBrid.style.left = "80px";
        this.oBrid.style.transition = "none"; //禁止动画
        this.skyStep = 5;
        this.StartFlag = true;

        for(var i=1; i<=this.pipeLength; i++) {
            this.createPipe(i);
        }
    },
    /**
     * 创建柱子
     * @param x
     */
    createPipe: function (x) {
        // pipeHeight = (最少50像素)50 + rand * ((600-150)/2-50)
        //600父元素高度  150中间间隙
        // var upPipeHeight = 50+Math.floor(Math.random()*175);
        // var downPipeHeight = 600-this.pipeSpaceY-upPipeHeight;
        var pipeHeight = this.getPipeHeight();
        var upPipeHeight = pipeHeight.upHeight;
        var downPipeHeight = pipeHeight.downHeight;

        var leftPx = x*this.pipeSpaceX;

        var oDivup = createEl("div", ["pipe","pipe-up"], {
            height: upPipeHeight+"px",
            left: leftPx+"px"
        });
        var oDivbottom = createEl("div", ["pipe","pipe-bottom"], {
            height:downPipeHeight+"px",
            left: leftPx+"px"
        });
        this.pipeArr.push({
            up:oDivup,
            down:oDivbottom,
            y: [upPipeHeight, upPipeHeight+this.pipeSpaceY]
        });
        this.el.appendChild(oDivup);
        this.el.appendChild(oDivbottom);
    },
    /**
     * 鼠标单击玩游戏
     */
    handleClick: function(){
        var self  = this;  //总忘记 事件里的this 不是外部的this
        this.el.onclick = function (e) {
            if(!e.target.classList.contains("start")){//不包今 start 按钮点击那一次
                self.birdStepY = -10;
            }
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
    //柱子移动
    pipeMove: function () {
        for(var i=0, len = this.pipeArr.length; i<len; i++){
            var up = this.pipeArr[i].up;
            var down = this.pipeArr[i].down;
            var x = up.offsetLeft - this.skyStep;
            up.style.left = down.style.left = x+"px";
        }
    },
    //循环重组柱子
    pipeWhile: function () {
        // i==0 && console.log(x);
        // console.log(this.pipeArr[0].up.offsetLeft);
        if(this.pipeArr[0].up.offsetLeft < -52){
            var shiftPipe = this.pipeArr.shift();
            this.pipeZeroIndexIsAddScore = false;

            var pipeHeight = this.getPipeHeight();
            var upPipeHeight = pipeHeight.upHeight; //50+Math.floor(Math.random()*175);
            var downPipeHeight = pipeHeight.downHeight; //600-this.pipeSpaceY-upPipeHeight;

            var lastPipeLeft = this.pipeArr[this.pipeArr.length-1].up.offsetLeft;
            shiftPipe.up.style.left = shiftPipe.down.style.left = lastPipeLeft+this.pipeSpaceX+"px";
            shiftPipe.up.style.height = upPipeHeight+"px";
            shiftPipe.down.style.height = downPipeHeight+"px";
            shiftPipe.y = [upPipeHeight, upPipeHeight+this.pipeSpaceY];
            // console.log(lastPipeLeft,shiftPipe.up.style.left);
            this.pipeArr.push(shiftPipe);
        }
    },
    /**
     * 求上下柱子高度
     * @returns {{upHeight: number, downHeight: number}}
     */
    getPipeHeight: function () {
        var upPipeHeight = 50+Math.floor(Math.random()*175);
        var downPipeHeight = this.containerHeight-this.pipeSpaceY-upPipeHeight;

        return {
            upHeight: upPipeHeight,
            downHeight: downPipeHeight
        };
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
        this.addScore();
    },
    /**
     *
     */
    collisionTest: function(){
        this.collisionBoundary();
        this.collisionPipe();
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
    collisionPipe : function () {
        //与柱子相遇的时候 pipeX=95=80+30-15（小鸟manage-left=15）
        //离开柱子的时候 pipeX=13=80-15-52
        var pipeX = this.pipeArr[0].up.offsetLeft;
        if(pipeX <= 95 && pipeX >=13){
            // console.log(this.oBrid.style.top , this.pipeArr[0].up.offsetHeight);
            // if( (this.birdTop <= this.pipeArr[0].up.offsetHeight) || (this.birdTop >= (this.pipeArr[0].up.offsetHeight+this.pipeSpaceY))){
            if( this.birdTop <=this.pipeArr[0].y[0] || this.birdTop >= this.pipeArr[0].y[1] ){
                this.gameOver();//游戏结束
            }
        }
    },
    /**
     * 加分
     */
    addScore: function () {

        if( this.pipeArr[0].up.offsetLeft < 13 && !this.pipeZeroIndexIsAddScore ){
            this.oScore.innerText = this.oFinalScore.innerText = ++this.score;
            this.pipeZeroIndexIsAddScore = true;
        }

    },
    /**
     * 游戏结束
     */
    gameOver: function(){
        this.oMask.style.display = "block";
        this.oEnd.style.display = "block";
        //this.oBrid.style.display = "none";
        this.oScore.style.display = "none";
        clearInterval(this.timer);
        this.saveResult();
        this.renderRankList();
    },
    /**
     * 保存游戏分数
     */
    saveResult: function () {
        // this.score;
        this.scoreArr.push({
            score: this.score,
            updateDate: getFormatDate()
        });
        this.scoreOrder();
        var len = this.scoreArr.length;
        (len > 10) &&  this.scoreArr.splice(10,len-10);

        setLocal("score", this.scoreArr);
    },
    /**
     * 分数排名
     */
    scoreOrder: function () {
        this.scoreArr.sort(function (a,b) {
            return b.score - a.score;
        });
    },
    /**
     * 渲染排名表
     */
    renderRankList: function () {
        var template="";
        var hitOrderColorArr = [0,1,2];
        for (var i=0, len=this.scoreArr.length, n= len>8 ? 8 : len; i<n; i++){
            template += `<li class="rank-item">
                    <span class="rank-degree ${hitOrderColorArr.indexOf(i) > -1 ? "line"+(i+1) : ""}">${i+1}</span>
                    <span class="rank-score">${this.scoreArr[i].score}</span>
                    <span class="rank-time">${this.scoreArr[i].updateDate}</span>
                </li>`;
        }
        this.oRankList.innerHTML = template;
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


