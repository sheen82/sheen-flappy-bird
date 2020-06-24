//createEl("div", [],{})
function createEl(el, classArr=[], styleObj=null) {
    var elem = document.createElement(el);
    //是否数组
    if(typeof classArr === "object"){
        for(var className of classArr){
            elem.classList.add(className);
        }
    }else {
        elem.classList.add(classArr);
    }

    //是否对象
    //{"top":0, "left":"5px"}
    if(styleObj){
        var styleObj = (typeof styleObj === "string") ? JSON.parse(styleObj) : styleObj;
        for ( let key in styleObj ){
            // console.log(styleObj[key]);
            elem.style[key] = styleObj[key];
        }
    }

    return elem;
}

//获取当前时间
function getFormatDate() {
    var d = new Date();
    if(typeof d == "object") {
        var year = d.getFullYear();
        var month = formatNum(d.getMonth()+1);
        var day = formatNum(d.getDate());
        var hours = formatNum(d.getHours());
        var minutes = formatNum(d.getMinutes());
        var seconds = formatNum(d.getSeconds());

        return `${year}:${month}:${day} ${hours}:${minutes}:${seconds}`;
    }else{
        return null;
    }
}
function formatNum(n) {
    return n < 10 ? "0"+n : n;
}

//为localStorage key赋值
function setLocal(key,value) {
    if( !!value && typeof value === "object"){
        value = JSON.stringify(value);
    }
    localStorage.setItem(key, value);
}

function getLocal(key) {
    if(!key) return [];
    var value = localStorage.getItem(key);
    if( value && (value[0] === "{" || value[0] === "[") ){
        value = JSON.parse(value);
    }
    return value ? value : [];
}