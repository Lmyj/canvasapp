$(function(){
    var box = $('.box');
    var copy = $(".copy");
    var canvas = $("canvas");
    var cobj = canvas[0].getContext("2d");
    var xpobj = $('.xp');
    var showLeft = $('.spail');
    var showCon = $('.show-con');
    canvas.attr({
        width:copy.width(),
        height:copy.height()
    });
    $('.hasson').not('.xianshi').hover(function(){
        $(this).find(".son").finish();
        $(this).find(".son").fadeIn(200);
    },function(){
        $(this).find(".son").fadeOut(200);
    });
    var obj=new shape(copy[0],canvas[0],cobj,$(".selectall"));
    obj.draw();
    //文件
    $(".hasson:eq(0)").find(".son li").click(function(){
        var filltype = $(this).attr("data-role");
        if(filltype == 'new'){
            if(obj.history.length > 0 ){
                var yes = window.confirm('是否保存');
                if(yes){
                    location.href = (canvas[0].toDataURL().replace('data:image/png','data:stream/png'));
                }
            }
            obj.history = [];
            cobj.clearRect(0,0,canvas[0].width,canvas[0].height);
        }else if(filltype == 'back'){
            cobj.clearRect(0,0,canvas[0].width,canvas[0].height);
            if(obj.history.length == 0){
                alert('亲，没有记录了哦！！！');
                return;
            }
            var data = obj.history.pop();
            cobj.putImageData(data,0,0);
        }else if(filltype == 'save'){
            location.href = (canvas[0].toDataURL().replace('data:image/png','data:stream/png'));
        }
    });
    //gongju
    var youxian = function(arr){
        for(var i=0;i<arr.length;i++){
            showCon[i].style.display = 'block';
            showCon[i].setAttribute('data-role',arr[i].getAttribute('data-role'));
            showCon[i].innerHTML = arr[i].innerHTML;
        }
    };
    //画笔形状
    $(".hasson:eq(1)").find(".son li").click(function(){
        showCon.css('display','none');
        var arr = $(".hasson:eq(1)").find(".son li");
        showCon.attr('class','show-con pen-style');
        obj.shapes = $(this).attr("data-role");
        if(obj.shapes !== 'pen'){
            obj.draw();
        }else{
            obj.pen();
        }
        youxian(arr);
    });
    showCon.click(function(){
        var isAttr = $(this).attr('class').split(' ')[1];
        if(isAttr == 'pen-style'){
            obj.shapes = $(this).attr("data-role");
            if(obj.shapes !== 'pen'){
                obj.draw();
            }else{
                obj.pen();
            }
        }else if(isAttr == 'fill-style'){
            obj.type = $(this).attr("data-role");
            obj.draw();
        }else if(isAttr == 'pen-width'){
            obj.lineWidth = $(this).attr("data-role");
            obj.draw();
        }else if(isAttr == 'clear-style'){
            var xpw = $(this).attr("data-role");
            xpobj.css({
                width:xpw,
                height:xpw
            });
            obj.xp(xpobj,xpw);
        }
        showCon.attr('class','show-con '+isAttr+'');
        $(this).attr('class','show-con '+isAttr+' chose');
    });
    //填充类型
    $(".hasson:eq(2)").find(".son li").click(function(){
        showCon.css('display','none');
        var arr = $(".hasson:eq(2)").find(".son li");
        obj.type = $(this).attr("data-role");
        showCon.attr('class','show-con fill-style');
        obj.draw();
        youxian(arr);
    });
    //画笔宽度
    $(".hasson:eq(3)").find(".son li").click(function(){
        showCon.css('display','none');
        showCon.attr('class','show-con pen-width');
        var arr = $(".hasson:eq(3)").find(".son li");
        obj.lineWidth = $(this).attr("data-role");
        obj.draw();
        youxian(arr);
    });
    //画笔颜色
    $(".bdcolor input").change(function(e){
        obj.bordercolor = e.currentTarget.value;
        obj.draw();
    });
    //填充色
    $(".fillcolor input").change(function(e){
        obj.bgcolor = e.currentTarget.value;
        obj.draw();
    });
    //橡皮
    $(".hasson:eq(4)").click(function(){
        showCon.css('display','none');
        showCon.attr('class','show-con clear-style');
        var arr = $(".hasson:eq(4)").find(".son li");
        var xpw = $(this).width();
        obj.xp(xpobj,xpw);
        youxian(arr);
    });
    $(".hasson:eq(4)").find(".son li").click(function(){
        showCon.css('display','none');
        showCon.attr('class','show-con clear-style');
        var arr = $(".hasson:eq(4)").find(".son li");
        var xpw = $(this).attr("data-role");
        xpobj.css({
            width:xpw,
            height:xpw
        });
        obj.xp(xpobj,xpw);
        youxian(arr);
    });
//    选择
    $('.select').click(function(e){
        showCon.css('display','none');
        var selAllObj = $('.selectall');
        obj.select(selAllObj);
    });
});