function shape(copy,canvas,cobj,selectobj){
    this.copy=copy;
    this.canvas=canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.cobj=cobj;
    this.bgcolor="#000";
    this.bordercolor="#000";
    this.lineWidth=1;
    this.type="stroke";
    this.shapes="line";
    this.history = [];
    this.selectobj = selectobj;
}
shape.prototype={
    init:function(){
        this.selectobj.css("display","none");
        if (this.temp) {
            this.history.push(this.cobj.getImageData(0, 0, this.width, this.height));
            this.temp = null;
        }
        this.cobj.fillStyle=this.bgcolor;
        this.cobj.strokeStyle=this.bordercolor;
        this.cobj.lineWidth=this.lineWidth;
    },
    line:function(x,y,x1,y1){
        var that=this;
        that.cobj.beginPath();
        that.cobj.moveTo(x,y);
        that.cobj.lineTo(x1,y1);
        that.cobj.stroke();
        that.cobj.closePath();
    },
    rect:function(x,y,x1,y1){
        var that=this;
        that.cobj.beginPath();
        that.cobj.rect(x,y,x1-x,y1-y);
        that.cobj.closePath();
        that.cobj[that.type]();
    },
    arc:function(x,y,x1,y1){
        var that=this;
        var r=Math.sqrt((x1-x)*(x1-x)+(y1-y)*(y1-y));
        that.cobj.beginPath();
        that.cobj.arc(x,y,r,0,Math.PI*2);
        that.cobj.closePath();
        that.cobj[that.type]();
    },
    five:function(x,y,x1,y1){
        var that = this;
        var r = Math.sqrt((x1-x)*(x1-x)+(y1-y)*(y1-y));
        var r1 = r/2;
        that.cobj.beginPath();
        that.cobj.moveTo(x+r,y);
        for(var i=0;i<10;i++){
            if(i%2 == 0){
                that.cobj.lineTo(x+Math.cos(i*36*Math.PI/180)*r,y+Math.sin(i*36*Math.PI/180)*r);
            }else{
                that.cobj.lineTo(x+Math.cos(i*36*Math.PI/180)*r1,y+Math.sin(i*36*Math.PI/180)*r1);
            }
        }
        that.cobj.closePath();
        that.cobj[that.type]();
    },
    pen:function(x,y,x1,y1){
        var that=this;
        that.copy.onmousedown=function(e){
            var startx= e.offsetX;
            var starty= e.offsetY;
            that.init();
            that.cobj.beginPath();
            that.cobj.moveTo(startx,starty);
            that.copy.onmousemove=function(e){
                var endx= e.offsetX;
                var endy= e.offsetY;
                that.cobj.lineTo(endx,endy);
                that.cobj.stroke();
            };
            that.copy.onmouseup=function(){
                that.cobj.closePath();
                that.history.push(that.cobj.getImageData(0,0,that.width,that.height));
                that.copy.onmousemove=null;
                that.copy.onmouseup=null;
            };
        };
    },
    draw:function(){
        var that=this;
        that.init();
        that.copy.onmousedown=function(e){
            that.init();
            var startx= e.offsetX;
            var starty= e.offsetY;
            that.copy.onmousemove=function(e){
                that.cobj.clearRect(0,0,that.width,that.height);
                if(that.history.length != 0){
                    //arr[arr.length-1]-->画的最后一条线
                    that.cobj.putImageData(that.history[that.history.length-1],0,0);
                }
                var endx= e.offsetX;
                var endy= e.offsetY;

                that[that.shapes](startx,starty,endx,endy);
            };
            that.copy.onmouseup=function(){
                that.history.push(that.cobj.getImageData(0,0,that.width,that.height));
                that.copy.onmousemove=null;
                that.copy.onmouseup=null;
            };
        };
    },
    xp:function(xpobj,xpw){
        var that = this;
        var w = xpobj.width();
        that.copy.onmousemove = function(e){
            var lefts = e.offsetX - w/2;
            var tops = e.offsetY - w/2;
            if(lefts < 0){
                lefts = 0;
            }
            if(lefts > that.width - w){
                lefts = that.width - w;
            }
            if(tops < 0){
                tops = 0;
            }
            if(tops > that.height - w){
                tops = that.height - w;
            }
            xpobj.css({
                left:lefts,
                top:tops,
                display:'block'
            });
        };
        that.copy.onmousedown = function(e){
            that.copy.onmousemove = function(e){
                var lefts = e.offsetX - w/2;
                var tops = e.offsetY - w/2;
                if(lefts < 0){
                    lefts = 0;
                }
                if(lefts > that.width - w){
                    lefts = that.width - w;
                }
                if(tops < 0){
                    tops = 0;
                }
                if(tops > that.height - w){
                    tops = that.height - w;
                }
                xpobj.css({
                    left:lefts,
                    top:tops,
                    display:'block'
                });
                that.cobj.clearRect(lefts,tops,w,w);
            };
            that.copy.onmouseup=function(){
                xpobj.css({
                    display:'none'
                });
                that.history.push(that.cobj.getImageData(0,0,that.width,that.height));
                that.copy.onmousemove=null;
                that.copy.onmouseup=null;
            };
        };
    },
    select:function(selectareaobj){
        var that=this;
        that.init();
        that.copy.onmousedown=function(e){
            var startx= e.offsetX;
            var starty= e.offsetY,minx,miny, w,h;
            that.init();
            that.copy.onmousemove=function(e){
                that.init();
                var endx= e.offsetX;
                var endy= e.offsetY;
                minx=startx>endx?endx:startx;
                miny=starty>endy?endy:starty;
                w=Math.abs(startx-endx);
                h=Math.abs(starty-endy);
                selectareaobj.css({
                    display:"block",
                    left:minx,
                    top:miny,
                    width:w,
                    height:h
                });
            };
            that.copy.onmouseup=function(){
                that.copy.onmouseup=null;
                that.copy.onmousemove=null;
                that.temp=that.cobj.getImageData(minx,miny,w,h);
                that.cobj.clearRect(minx,miny,w,h);
                that.history.push(that.cobj.getImageData(0,0,that.width,that.height));
                that.cobj.putImageData(that.temp,minx,miny);
                that.drag(minx,miny,w,h,selectareaobj);
            }
        }
    },
    drag:function(x,y,w,h,selectareaobj){
        var that=this;
        that.copy.onmousemove=function(e){
            var ox= e.offsetX;
            var oy= e.offsetY;
            if(ox>x&&ox<x+w&&oy>y&&oy<y+h){
                that.copy.style.cursor="move";
            }else{
                that.copy.style.cursor="default";
            }
        };
        that.copy.onmousedown=function(e){
            var ox= e.offsetX;
            var oy= e.offsetY;
            var cx=ox-x;
            var cy=oy-y;
            if(ox>x&&ox<x+w&&oy>y&&oy<y+h){
                that.copy.style.cursor="move";
            }else{
                that.copy.style.cursor="default";
                return;
            }
            that.copy.onmousemove=function(e){
                that.cobj.clearRect(0,0,that.width,that.height);
                if(that.history.length!==0){
                    that.cobj.putImageData(that.history[that.history.length-1],0,0);
                }
                var endx= e.offsetX;
                var endy= e.offsetY;
                var lefts=endx-cx;
                var tops=endy-cy;
                if(lefts<0){
                    lefts=0;
                }
                if(lefts>that.width-w){
                    lefts=that.width-w
                }
                if(tops<0){
                    tops=0;
                }
                if(tops>that.height-h){
                    tops=that.height-h
                }
                selectareaobj.css({
                    left:lefts,
                    top:tops
                });
                x=lefts;
                y=tops;
                that.cobj.putImageData(that.temp,lefts,tops);
            };
            that.copy.onmouseup=function(){
                that.copy.onmouseup=null;
                that.copy.onmousemove=null;
                that.drag(x,y,w,h,selectareaobj)
            };
        }


    }

};