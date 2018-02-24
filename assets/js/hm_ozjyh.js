//分类列表中每个字母相对于顶部的距离
function alphaArr(){
    var arr=[];
    $('.sort-wrap').find('p').each(function(){
      arr.push($(this).offset().top-49);
    });
    return arr;
}

//点击右侧字母移动到相应位置
function alphaList(){
    console.log('ok');
   $('.alpha-list').on('click','a',function(){
      $('.alpha-list a').removeClass('active');
      $(this).addClass('active');
      var data = ($(this).attr('data'));

      var groupElement = $('.index-'+data);
      console.log(groupElement);
      if (groupElement.length>0) {
          $('.sort-wrap').scrollTop(0);
          var oheight = groupElement.offset().top-49;
          var innerHeight = $('.sort-wrap').scrollTop();
          console.log(innerHeight);
          console.log(oheight);
          var height = oheight  - innerHeight;//滚动的距离 = 初始化时到顶部距离减去当前到顶部的距离
          $('.sort-wrap').stop().animate({scrollTop: '+=' + height + 'px'});
      }else{
           return;
      }
   });
}


//购物车操作商品数量
function countOper(type,obj, sale){       
    switch(type){
        case '-':
            var num = parseInt($(obj).next().html());
            if(num > 1){
                num--;
            }
            $(obj).next().html(num);
            break;
        case '+':
            var num = parseInt($(obj).prev().html());
            if (sale) {
                if(num < sale) {
                    num++;
                } else {
                    mask('库存不足');
                }
            }else{
                num++;
            } 
            $(obj).prev().html(num);
            break;
        default:
            break;
    }
}

//页面地址前缀
function preUrl(path){
    var fUrl = 'http://127.0.0.1:8020/hm_ozjyh/';
    return fUrl + path;
}

//ajax 传参url
function reqUrl(path){
    var frontUrl = 'http://124.128.23.74:8008/group17/hm_ozjyh/index.php/Webservice/V100/';
    return frontUrl + path;;
}


/*
*  获取地址栏中的参数
*   getQueryString('参数名1')
*   getQueryString('参数名2')
*/
function getQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}

// 遮罩
function mask(text){
    $('.layer').remove();
    var content = '<div class="layer"> '+ text +'</div>'
    $('body').append(content);

    var w = $('.layer').width() + 40;
    var win = $(window).width();

    $('.layer').css('left', (win-w)/2 + 'px');
    $('.layer').fadeIn();
    
    setTimeout(function(){
        $('.layer').fadeOut();
        $('.layer').remove();
    }, 2000);  
}

//页面链接跳转历史URL不记录的兼容处理
function fnUrlReplace(eleLink) {
    console.log(eleLink);
    if (!eleLink) {
        return;
    }
    var href = eleLink.href;
    console.log(href);
    if (href && /^#|javasc/.test(href) === false) {
        if (history.replaceState) {
            console.log('ok');
            history.replaceState(null, document.title, href.split('#')[0] + '#');
            location.replace('');
        } else {
            location.replace(href);
        }
    }
};

//点击的时候链接不进入历史记录堆栈(链接的点击事件)
$('.oz-nav a').on('click',function(event){
    if (event && event.preventDefault) {
        event.preventDefault();
    }
    fnUrlReplace(this);
    
    return false;
});

/**
* ajax请求接口封装函数
* @param {String} url: 请求地址
* @param {Object} params: 传的参数
* @param {Boolean} async值为 false 同步， 为true异步
* @param {function}  callback 回调函数
**/
function postAjax(url, params, async, callback) {
    $.ajax({
        type: 'post',
        dataType: 'json',
        url: url,
        data: params,
        async: async,
        xhrFields: {
            withCredentials: true
        },
        success: function(data) {
            callback(data);
        }
    });
}

// @param {string} img 图片的base64
// @param {int} dir exif获取的方向信息
// @param {function} next 回调方法，返回校正方向后的base64
function getImgData(img,dir,next){
    var image=new Image();
    image.onload=function(){
        var degree=0,drawWidth,drawHeight,width,height;
        drawWidth=this.naturalWidth;
        drawHeight=this.naturalHeight;
        console.log(drawWidth);
        //以下改变一下图片大小
        // var maxSide = Math.max(drawWidth, drawHeight);
        // if (maxSide > 2048) {
        //     var minSide = Math.min(drawWidth, drawHeight);
        //     minSide = minSide / maxSide * 2048;
        //     maxSide = 2048;
        //     if (drawWidth > drawHeight) {
        //         drawWidth = maxSide;
        //         drawHeight = minSide;
        //     } else {
        //         drawWidth = minSide;
        //         drawHeight = maxSide;
        //     }
        // }
        var canvas=document.createElement('canvas');
        canvas.width=width=drawWidth;
        canvas.height=height=drawHeight;
        console.log(canvas.width);
        var context=canvas.getContext('2d');
        //判断图片方向，重置canvas大小，确定旋转角度，iphone默认的是home键在右方的横屏拍摄方式
        switch(dir){
            //iphone横屏拍摄，此时home键在左侧
            case 3:
                degree=180;
                drawWidth=-width;
                drawHeight=-height;
                break;
            //iphone竖屏拍摄，此时home键在下方(正常拿手机的方向)
            case 6:
                canvas.width=height;
                canvas.height=width;
                degree=90;
                drawWidth=width;
                drawHeight=-height;
                break;
            //iphone竖屏拍摄，此时home键在上方
            case 8:
                canvas.width=height;
                canvas.height=width;
                degree=270;
                drawWidth=-width;
                drawHeight=height;
                break;
        }
        //使用canvas旋转校正
        context.rotate(degree*Math.PI/180);
        context.drawImage(this,0,0,drawWidth,drawHeight);
        //返回校正图片
        next(canvas.toDataURL("image/jpeg",.8));
    }
    image.src=img;
}


// 存储
var store = {
    setCookie: function(name, value, exdays){
        //设置cookie
        var exp = new Date();
        exp.setTime(exp.getTime()+(exdays*24*60*60*1000));
        document.cookie = name + "=" + escape(value) + "; expires=" + exp.toGMTString() + ";path=/";
    },
    getCookie: function(name){
        //获取cookie
        var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
        if(arr != null) return unescape(arr[2]); return null;
    },
    setInfo:function(k,v){
        //保存永久数据
        window.localStorage.setItem(k, JSON.stringify(v));
    },
    getInfo:function(k){
        //读取永久数据
        var data = window.localStorage.getItem(k);
        return JSON.parse(data);
    },
    removeInfo:function(k){
        //删除永久数据
        window.localStorage.removeItem(k);
    },
    allRemoveInfo:function(){
        //全部删除
        window.localStorage.clear();
    }

}



