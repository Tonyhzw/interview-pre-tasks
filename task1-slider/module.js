/**
 * Created by ucas on 2016/6/14.
 */
function Slider(opts){
    //console.log(this.element);
    this._init(opts);
    //this.renderSlider();
}
Slider.prototype._init = function(opts){
    this.slideEffect=opts.slideEffect||'slide';
    this.autoSlide=(opts.autoSlide===undefined)?true:opts.autoSlide;
    this.slideInterval=opts.slideInterval||5000;
    this.sliderWillSlide=opts.sliderWillSlide;
    this.sliderDidSlide=opts.sliderDidSlide;
    /*
    * element:当前需要添加到的父元素
    * list:需要添加的列表slide
    * */
    this.element=opts.element;
    this.list=opts.list;
    this._renderDom();
};
Slider.prototype._renderDom=function(){
    var len=this.list.length;
    this.outer=document.createElement('ul');
    var width=window.innerWidth;
    for(var i=0;i<len;i++){
        var li=document.createElement('li');
        var item=this.list[i];
        li.style.cssText ='width:'+width+'px;transform:translate3d('+i*width+'px,0,0)';
        if(item){
            li.innerHTML='<img width="'+width+'" src="'+item['src']+'">';
        }
        this.outer.appendChild(li);
    }
    this.outer.style.width=width+' px';
    this.element.appendChild(this.outer);
};
Slider.prototype.setActiveSlide = function(slide){
    var n = slide*1;
    if(typeof n=='number') {
        this.currentId=n-1;
        this._renderSlides();
    }else{
        console.log('输入不合法');
    }
};
//slider绘制
Slider.prototype.renderSlider = function(){
    if(this.list.length==0) return this;
    this.currentId=this.currentId||0;//如果没有setActiveSlide指定
    if(this.autoSlide){
        //自动播放
        var that =this;
        function interChange(){
            that._renderSlides();
            setTimeout(interChange,that.slideInterval);
        }
        setTimeout(interChange,that.slideInterval);
    }
};
//单次轮播
Slider.prototype._renderSlides = function(){
    var lis=this.outer.getElementsByTagName('li');
    var len=this.list.length;
    var width=window.innerWidth;
    var that=this;
    //轮播开始前回调
    var nextId=(this.list[this.currentId+1] && (this.currentId+1))||0;
    //console.log("start: "+this.currentId+" "+nextId);
    if(typeof this.sliderWillSlide === 'function')
        this.sliderWillSlide(this.currentId,nextId);
    //轮播
    if(this.slideEffect==='slide'){
        lis[nextId]&&(lis[nextId].style.transition='transform 0s ease-out');
        lis[nextId-1]&&(lis[nextId-1].style.transition='transform 0s ease-out');
        lis[nextId+1]&&(lis[nextId+1].style.transition='transform 0s ease-out');

        _getRender();
    }
    //淡入淡出
    else if(this.slideEffect==='fadeout'){
        //console.log(this.slideEffect);
        var opacity= 0;
        var scale=1/10;
        function getFade(){
                lis[nextId].style.opacity=opacity;
                lis[nextId].style.filter='alpha(opacity:'+(opacity*100)+')';
                opacity+=scale;
            if(opacity<=1)
                setTimeout(getFade,that.slideInterval/20);
        }
        _getRender();
        setTimeout(getFade,that.slideInterval/20);
    }
    //更新结果
    function _getRender(){
        if(nextId===0&&that.currentId===len-1){
           // console.log("second:"+that.currentId+" "+nextId);
            //重新初始化
            for(var i=0;i<len;i++){
                lis[i].style.transform='translate3d('+(i*width)+'px,0,0)';
            }
        }else {
            lis[nextId - 1] && (lis[nextId - 1].style.transform = 'translate3d(-' + width + 'px,0,0)');
            lis[nextId] && (lis[nextId].style.transform = 'translate3d(0,0,0)');
            lis[nextId + 1] && (lis[nextId + 1].style.transform = 'translate3d(' + width+ 'px,0,0)');
        }
    }
    //轮播结束时回调
    var preId=this.currentId;
    this.currentId = nextId;
    if(typeof this.sliderDidSlide === 'function')
        this.sliderDidSlide(this.currentId,preId);
};