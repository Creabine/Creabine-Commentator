function CreabineCommentator(options) {
    /* 校验 */
    if (!options.root) {
        throw "require name to this commentator";
    }
    if (!options.comments) {
        throw "must provide parameter comments";
    }
    if (options.comments.length < 5) {
        throw "require more than 4 pictures";
    }
    if (options.logos && options.comments.length != options.logos.length) {
        throw "comments are not equal to logos";
    }
    /*
    _root: 根元素对象
    _commentatorInner: item容器元素对象
    _dotBox: dot容器对象
    _dots: dot对象数组
    comments: 评论对象数组
    logos: logo图片url的字符串数组
    */
    var _root, _commentatorInner, _dotBox, _dots;
    var comments = options.comments, logos = options.logos;
    /*
    _activeElmNo: 激活的项目的编号,初始化时赋值0，即默认显示第一个。
    _items: 所有项目的数组。
    _isAnimate: ?????????????????????????
    _imc: ???????????????
     */
    var _activeElmNo, _items, _isAnimate = 0,_imc=0;
    /*
    _commentatorWidth，_commentatorHeight: item容器对象宽高
    ITEM_W,ITEM_H: 普通item的宽高
    EX_W,EX_H: 变大展示的item的宽高
    INNER_DEFAULT_LEFT: 大item两边的小item在显示区域只能放下一部分，放下的这部分的宽度
    _ROOTPADDING: 根元素root和item容器元素的上下间距之和，默认100，即上50px,下50px
    */
    var _commentatorWidth, _commentatorHeight, ITEM_W, ITEM_H, EX_W, EX_H, INNER_DEFAULT_LEFT;
    var _ROOTPADDING = 100;

    var PZ = options.sizeRate || 7 / 20, PU = options.scaleRate || 10 / 13;//图片比例，展开和常规比例
    /*
    _moveDuration: 左右移动执行的时间间隔，默认12ms执行一次
    _movePerVal: 每次执行左右移动时移动的量，默认30px
    _scaleDuration: 缩放执行的时间间隔，默认12ms执行一次，改变缩放速度
    _scalePerVal: 每次执行等比例缩放时缩放的量，默认6px。
    */
    var _moveDuration = options.moveDuration || 12,_movePerVal = options.movePerVal || 30;
    var _scaleDuration = options.scaleDuration || 12, _scalePerVal = options.scalePerVal || 6;
    /*
    _autoScroll: 是否自动轮播
    _scrollDuration: 自动轮播时间间隔，默认5000ms
    _btn: 是否显示左右箭头，默认不显示
    */
    var _autoScroll=options.autoScroll||false,_scrollDuration=options.scrollDuration||5000;
    var _btn=options.btn||false;
    ///public methods
    //计算尺寸
    this.resize = function (width, height) {
        initSize(width, height);
    }
    this.next = function () {
        next();
    }
    this.previous = function () {
        previous();
    }

    function next() {
        if (_isAnimate == 0) {
            /* 
            首先移动大item左边的第二个item
            不论总共有几个item，实际上每次我们能看到的都只有3个，1个大的在中间，2个小的在两边，
            所以，当我们next()的时候，所有item往左走。那么，这个大的item左边第二个item，是
            看不见的，我们把它移动到最右边去，从而实现无限滚动。这里下边的moveItem,就是要移动
            到最右边去的这个item的序号。用下边的方法计算：
             */
            var moveItem = (_activeElmNo<2) ? (_activeElmNo - 2 + _items.length) : (_activeElmNo - 2);
            /*
            找到要移动到最右边的小item之后，改变他的位置(left的值)，给他的当前位置加上所有item
            排列在一起的长度，也就是每个item的宽度(ITEM_W)乘以item的个数(_items.length)
            */
            _items[moveItem].style.left = _items[moveItem].offsetLeft + _items.length * ITEM_W + "px";
            /* 然后缩小大item */
            narrow(_items[_activeElmNo])
            /* 让item容器平滑的向左移动 */
            moveToLeft();
            /* 计算出新的大item序号 */
            _activeElmNo = (_activeElmNo < _items.length - 1) ? ++_activeElmNo : 0;
            /* 改变相应的dots */
            reRenderDots();
            /* 扩大新的大item */
            expand(_items[_activeElmNo])
        }
    }

    function previous() {
        if (_isAnimate == 0) {
            /*
            首先要把大item右边的第二个item移动到最左边，计算这个item的序号：
            */
            var moveItem = (_activeElmNo < (_items.length-2)) ? (_activeElmNo + 2) : (_activeElmNo + 2 - _items.length);
            /* 进行移动，向左移动所有item宽度的和 */
            _items[moveItem].style.left = _items[moveItem].offsetLeft - _items.length * ITEM_W + "px";
            /* 把大item缩小 */
            narrow(_items[_activeElmNo])
            /* 让item容器平滑的向右移动 */
            moveToRight();
            /* 计算出新的大item序号 */
            _activeElmNo = (_activeElmNo > 0) ? (--_activeElmNo) : (_items.length-1);
            /* 改变相应的dots */
            reRenderDots();
            /* 扩大新的大item */
            expand(_items[_activeElmNo])
        }
    }

    function moveToLeft() {
        addAnimation();
        _imc--;
        var hadDiff = 0;
        var timer = setInterval(function () {
            if (ITEM_W - hadDiff < _movePerVal) {
                _commentatorInner.style.left = _commentatorInner.offsetLeft - (ITEM_W - hadDiff) + 'px';
            } else {
                _commentatorInner.style.left = _commentatorInner.offsetLeft - _movePerVal + 'px';
            }
            hadDiff += _movePerVal;
            if (hadDiff >= ITEM_W) {
                clearInterval(timer);
                rmAnimation();
                //_commentatorInner.style.left=_commentatorInner.offsetLeft-_commentatorInner.offsetLeft%ITEM_W+"px";
            }
        }, _moveDuration)
    }

    function moveToRight() {
        addAnimation();
        _imc++;
        var hadDiff = 0;
        var timer = setInterval(function () {
            if (ITEM_W - hadDiff < _movePerVal) {
                _commentatorInner.style.left = _commentatorInner.offsetLeft + (ITEM_W - hadDiff) + 'px';
            } else {
                _commentatorInner.style.left = _commentatorInner.offsetLeft + _movePerVal + 'px';
            }
            hadDiff += _movePerVal;
            if (hadDiff >= ITEM_W) {
                clearInterval(timer);
                rmAnimation();
            }
        }, _moveDuration)
    }

    //缩小动作，传入参数elm是要缩小的item对象
    function narrow(elm) {
        addAnimation();
        var perW = _scalePerVal;
        var exW = EX_W - ITEM_W;
        var hadDiff = 0;
        var timer = setInterval(function () {
            if (exW - hadDiff < perW) {
                var leftW = exW - hadDiff;
                //elm.style.width = elm.offsetWidth - leftW + 'px';
                elm.style.width=ITEM_W+"px";
                elm.style.height = ITEM_H + 'px';
                elm.style.left = elm.offsetLeft + 0.5 * leftW + 'px';
                elm.style.top = elm.offsetTop + 1 + 'px';
            } else {
                elm.style.width = elm.offsetWidth - perW + 'px';
                elm.style.height = elm.offsetHeight - perW * PZ + 'px';
                elm.style.left = elm.offsetLeft + 0.5 * perW + 'px';
                elm.style.top = elm.offsetTop + 1 + 'px';
            }
            hadDiff += perW;
            if (hadDiff >= exW) {
                clearInterval(timer);
                elm.style.zIndex = 0;
                elm.style.top = (_commentatorHeight - ITEM_H) / 2 + 'px';
                elm.style.opacity = '0.4';
                var children = elm.childNodes;
                for( var i=0;i<children.length;i++ ){
                    children[i].style.opacity = '0';
                }
                rmAnimation()
            }
        }, _scaleDuration)
    }
    //放大动作，传入参数elm是要放大的item对象
    function expand(elm) {
        addAnimation();
        elm.style.zIndex = 10;
        var perW = _scalePerVal;
        //var exW = (1 - PU) * ITEM_W;
        var exW=EX_W-ITEM_W;
        var hadDiff = 0;
        var timer = setInterval(function () {
            if (exW - hadDiff < perW) {
                var leftW = exW - hadDiff;
                //elm.style.width = elm.offsetWidth + leftW + 'px';
                elm.style.width=EX_W+"px";
                elm.style.height = EX_H + 'px';
                elm.style.top = elm.offsetTop - 1 + 'px';
                elm.style.left = elm.offsetLeft - 0.5 * leftW + 'px';
            } else {
                elm.style.width = elm.offsetWidth + perW + 'px';
                elm.style.height = elm.offsetHeight + perW * PZ + 'px';
                elm.style.top = elm.offsetTop - 1 + 'px';
                elm.style.left = elm.offsetLeft - 0.5 * perW + 'px';
            }
            hadDiff += perW;
            if (hadDiff >= exW) {
                clearInterval(timer);
                elm.style.top = '0px';
                elm.style.opacity = '1';
                var children = elm.childNodes;
                for( var i=0;i<children.length;i++ ){
                    children[i].style.opacity = '1';
                }
                rmAnimation();
            }
        }, _scaleDuration)
    }
    //计算item位置，这里的n传入的是_activeElmNo
    function initPostion(n) {
        /* 调整item容器的位置，使其默认跟root左对齐，并垂直居中 */
        _commentatorInner.style.left = 0;
        _commentatorInner.style.top = _ROOTPADDING / 2 + 'px';
        _imc=0; 
        /*
        这里定义了一个新数组，用来存放item的序号,序号从大item开始，向右遍历所有item，例如共5个item时：
        当初始化的时候，这里的n=0,那么orArr=[0,1,2,3,4];
        当hover不相邻的dot导致重置时，若n=3，那么orArr=[3,4,0,1,2];
        */
        var orArr = [];
        for (var i = 0; i < _items.length; i++) {
            n = n - _items.length >= 0 ? n - _items.length : n;
            orArr[i] = n;
            n++;
        }
        /*之后所有的item按照刚才定义的顺序来设置位置。*/
        for (var i = 0; i < _items.length; i++) {
            /* 调整item的z-index和位置，使其为0且垂直居中 */
            _items[orArr[i]].style.zIndex=0;
            _items[orArr[i]].style.top = (_commentatorHeight - ITEM_H) / 2 + 'px';
            /* 
            这里筛选出了大item左边的两个小item，并设置他们的位置
             */
            if (_items.length - i <= 2) {
                _items[orArr[i]].style.left = INNER_DEFAULT_LEFT - (_items.length - i) * ITEM_W + "px";
            /*
            这里else中选出的是大item和他右边的两个小item，并设置他们的位置
            */
            }else{
                _items[orArr[i]].style.left = INNER_DEFAULT_LEFT + i * ITEM_W + "px";
            }
        }
    }
    //初始化大小，这里传入的参数width=options.width;height=options.height
    function initSize(width, height) {
        calcBaseSize(width, height);
        /* 调整root大小，跟item容器一样宽，比item容器高一些(_ROOTPADDING) */
        _root.style.width = _commentatorWidth + 'px';
        _root.style.height = _commentatorHeight + _ROOTPADDING + 'px';
        /* 调整item容器的大小 */
        _commentatorInner.style.height = _commentatorHeight + 'px';
        /* 调整item的大小 */
        for (var i = 0; i < _items.length; i++) {
            _items[i].style.width = ITEM_W + 'px';
            _items[i].style.height = ITEM_H + 'px';
        }
    }

    function randomColor() {
        var r = Math.round(Math.random() * 255).toString(16);
        var g = Math.round(Math.random() * 255).toString(16);
        var b = Math.round(Math.random() * 255).toString(16);
        r = r.length == 2 ? r : '0' + r;
        g = g.length == 2 ? g : '0' + g;
        b = b.length == 2 ? b : '0' + b;
        var rgb = '#' + r + g + b;
        return rgb;
    }

    ///private method
    //生成html对象
    function initElements() {
        _root = document.getElementById(options.root);
        if (!_root) {
            throw "no exist called this name element,please create element called this name";
        }
        _root.className = "creabinecarousel";
        _commentatorInner = document.createElement("div");
        _commentatorInner.className = "creabine-inner";
        //_commentatorInner.style.border = "3px solid black";
        _root.appendChild(_commentatorInner);
        calcBaseSize(options.width, options.height);
        _activeElmNo = 0;

        for (var i = 0; i < comments.length; i++) {
            var commentatorItem = document.createElement("div");
            commentatorItem.className = "creabine-item";
            //commentatorItem.style.backgroundColor = randomColor();
            //commentatorItem.style.backgroundColor = "#fff";
            _commentatorInner.appendChild(commentatorItem);
        }
        _items=_root.getElementsByClassName('creabine-item');
        for (var i = 0; i < _items.length; i++) {
            var content = document.createElement("p");
            content.className = "creabine-comment";
            content.innerText = comments[i].content;
            content.style.width = EX_W * 0.8 + 'px';
            content.style.height = EX_H * 0.3 + 'px';
            content.style.marginTop = EX_H * 0.1 + 'px';
            content.style.marginBottom = EX_H * 0.05 + 'px';
            _items[i].appendChild(content);
            if(logos){
                var logo = document.createElement("img");
                logo.className = "creabine-logo";
                logo.style.height = EX_H * 0.3 + 'px';
                logo.src = logos[i];
                _items[i].appendChild(logo);
            }
            var commentator = document.createElement("p");
            commentator.className = "creabine-commentator";
            commentator.innerText = comments[i].commentator;
            commentator.style.height = EX_H * 0.1 + 'px';
            commentator.style.marginTop = EX_H * 0.05 + 'px';
            _items[i].appendChild(commentator);
        }
        _dotBox = document.createElement("ul");
        _dotBox.className = "dot-box";
        _root.appendChild(_dotBox);
        for (var i = 0; i < _items.length; i++) {
            var dot = document.createElement('li');
            _dotBox.appendChild(dot);
        }
        _dots = _dotBox.querySelectorAll("li")
        for (var i = 0; i < _dots.length; i++) {
            var dotSpan = document.createElement("span");
            _dots[i].appendChild(dotSpan);
            (function (arg) {
                _dots[i].addEventListener("mouseenter", function () {
                    if (_activeElmNo != arg) {
                        /* hover的dot在activeDot右边 || 第一个的时候 */
                        if (arg - _activeElmNo == 1 || arg - _activeElmNo == -_items.length + 1) {
                            next();
                        /* hover的dot在activeDot左边 || 最后一个的时候 */
                        } else if (arg - _activeElmNo == -1 || arg - _activeElmNo == _items.length - 1) {
                            previous();
                        /* 不相邻的时候 */
                        } else {
                            _activeElmNo = arg;
                            reload();
                        }
                    }
                })
            })(i)
        }
        if(_btn){
            var leftBtn=document.createElement("span");
            leftBtn.className = "creabine-lefBtn";
            leftBtn.style.left = _commentatorWidth * 0.05 + "px";
            var rightBtn=document.createElement("span");
            rightBtn.className = "creabine-rightBtn";
            rightBtn.style.right = _commentatorWidth * 0.05 + "px";
            /* 下边的20 是Btn的高度，写在css里边，通过计算让Btn上下居中 */
            leftBtn.style.top = rightBtn.style.top = (_commentatorHeight + _ROOTPADDING-20)/2 + "px";
            _root.appendChild(leftBtn);
            _root.appendChild(rightBtn);
            leftBtn.addEventListener("click",function(){
                previous();
            });
            rightBtn.addEventListener("click",function(){
                next();
            });
        }
        if(_autoScroll){
            var timer=setInterval(function(){next()},_scrollDuration)
        }
    }

    //以组件长宽计算基础尺寸数值,这里传入的参数width=options.width;height=options.height
    function calcBaseSize(width, height) {
        /* 只显示一个item */
        if(options.singleShow){
            /* item容器的宽高，默认为300,105 */
            _commentatorWidth=width||300;
            _commentatorHeight=height||105;
            /* 大item的宽高，因为只显示一个，所以就等于整个容器的宽高 */
            EX_W=_commentatorWidth;
            EX_H=_commentatorHeight;
            /* 小item的宽高，大的宽高*比例 */
            ITEM_W=EX_W*PU;
            ITEM_H=EX_H*PU;
            INNER_DEFAULT_LEFT=(EX_W-ITEM_W)/2;
        }else{
            /* 正常显示3个item的时候容器的宽高，默认400,100 */
            _commentatorWidth = width || 400;
            _commentatorHeight = height || 100;
            /* 小item的宽高 */
            ITEM_W = _commentatorHeight * PU / PZ;
            ITEM_H = _commentatorHeight * PU;
            /* 大item的宽高 */
            EX_W = ITEM_W / PU;
            EX_H = ITEM_H / PU;
            /*  */
            INNER_DEFAULT_LEFT = (_commentatorWidth - ITEM_W) / 2;
        }
    }

    function addAnimation() {
        _isAnimate++;
    }
    function rmAnimation() {
        _isAnimate--;
        if(_isAnimate==0){
            _commentatorInner.style.left=_imc*ITEM_W+"px"
        }
    }
    /* 给当前item对应的dot加上class */
    function reRenderDots() {
        for (var i = 0; i < _dots.length; i++) {
            if (i == _activeElmNo) {
                _dots[i].className = "active";
            } else {
                _dots[i].className = "";
            }
        }
    }
    /* 
    重置轮播，在两种情况下需要这样做：
    1：初始化的时候，生成元素之后重置位置，大小，dot样式等等。此时的_acticeEleNo=0
    2：当你hover的dot不与_activeEleNo相邻的时候(相邻时平滑过渡),此时的_activeEleNo是你hover的那个dot对应的

     */
    function reload() {
        /* 重置dots，给hover的那个加上class */
        reRenderDots();
        /* 重置所有item的大小 */
        initSize(options.width, options.height);
        /* 重置所有item的位置 */
        initPostion(_activeElmNo);
        /* 
        这里将所有item的透明度变为0.4，并将item中的内容透明度变为0
        在变大的时候，再把要显示的大item的透明度改为正常 */
        for(var i=0;i<_items.length;i++){
            _items[i].style.opacity = '0.4';
            for( var j=0;j<_items[i].childNodes.length;j++ ){
                _items[i].childNodes[j].style.opacity = '0';
            }
        };
        /* 把要显示的大item变大 */
        expand(_items[_activeElmNo]);
    }

    initElements();
    reload();
}