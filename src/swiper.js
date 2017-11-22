/**
 * Created by Jimmy on 2017/11/16.
 */
!function(window){
    var Swiper = function (el, options) {
        this.el = document.querySelector(el);
        this.imgs = document.querySelectorAll(el + '>div[data-src]');
        this.indexDots = [];
        this.activedIndex = -1;
        this.loop = null;
        this.loopLeftTime = 0;
        this.opts = Object.assign({
            position: 'middle',
            timeout: 5000,
            loops: true,
            index: true
        }, options);
        this.moveStartX;
        this.moveDistance;
        this.isMove = false;
        this._moveStart = function (e) {
            this.isMove = true;
            this.moveStartX = e.targetTouches[0].pageX;
        };
        this._move = function (e) {
            if(!this.isMove){
                return;
            }
            this.moveDistance = e.targetTouches[0].pageX - this.moveStartX;
            if(this.moveDistance>50){
                this.prev();
                this.isMove = false;
            }else if(this.moveDistance<-50){
                this.next();
                this.isMove = false;
            }

        };
        this._moveEnd = function (e) {
            // console.log('finish touch');
        };
        this.init();
    };
    Swiper.prototype.init = function () {
        if (!this.imgs || this.imgs.length < 1) {
            console.warn(this.el + ':there aren\'t any items in the swiper');
            return;
        }
        this.el.classList.add('swiper');
        this.opts.index?this.index():'';
        this.opts.nav?this.nav():'';
        this.activeIndex(0);
        var imgDiv = this.imgs[0];
        this.imgs.forEach((imgDiv, index) => {
            var img = new Image();
            var vm = this;
            img.src = imgDiv.getAttribute('data-src');
            img.onload = function () {
                console.log('replace');
                var inner = imgDiv.innerHTML;
                var a = document.createElement('a');
                a.innerHTML = inner;
                // 背景图
                a.style.backgroundImage = `url(${img.src})`;
                // 绑定链接地址
                a.href = imgDiv.getAttribute('data-url') || 'javascript:void(0);';
                // 禁止拖动
                a.ondragstart = function () {
                    return false
                };
                imgDiv.removeAttribute('data-src');
                imgDiv.removeAttribute('data-url');
                imgDiv.innerHTML = '';
                imgDiv.appendChild(a);
            };
            imgDiv.addEventListener('touchstart',vm._moveStart.bind(this),false)
            imgDiv.addEventListener('touchmove',vm._move.bind(this),false)
            imgDiv.addEventListener('touchend',vm._moveEnd.bind(this),false)
        });
    };
    Swiper.prototype.loopFn = function () {
        clearTimeout(this.loop);
        if (this.opts.loops) {
            var vm = this;
            vm.loop = setTimeout(() => {
                this.next();
            }, vm.opts.timeout);
        }
    };
    Swiper.prototype.pause = function () {
        clearTimeout(this.loop);
    }
    Swiper.prototype.index = function () {
        var indexs = document.createElement('ul');
        indexs.classList.add('index-dots');
        indexs.classList.add('index-dots-' + this.opts.position);
        if (!this.imgs || this.imgs.length < 1) {
            return;
        }
        var vm = this;
        this.imgs.forEach((item, index) => {
            let li = document.createElement('li');
            li.addEventListener('click', function (e) {
                vm.activeIndex(index);
            }, false);
            indexs.appendChild(li);
            this.indexDots.push(li);
        });
        this.el.appendChild(indexs);
    };
    Swiper.prototype.activeIndex = function (index) {
        if (this.imgs && this.imgs.length > 1) {
            this.loopFn();
        }
        ;
        if (index == this.activedIndex) {
            return;
        }
        if (this.imgs[this.activedIndex]) {
            this.imgs[this.activedIndex].classList.remove('swiper-active');

            this.opts.index?this.indexDots[this.activedIndex].classList.remove('index-active'):'';
        }
        this.imgs[index].classList.add('swiper-active');
        this.opts.index?this.indexDots[index].classList.add('index-active'):'';
        this.activedIndex = index;

    };
    Swiper.prototype.nav = function () {
        console.log(navigator.userAgent);
        if (!this.imgs || this.imgs.length <= 1 || navigator.userAgent.match(/(iPhone|iPod|Android|ios|ipad)/i)) {
            return;
        }
        ;
        var left = document.createElement('a');
        var right = document.createElement('a');
        left.classList.add('swiper-nav-left');
        right.classList.add('swiper-nav-right');
        var vm = this;
        left.onclick = this.prev.bind(vm);
        right.onclick = this.next.bind(vm);
        this.el.appendChild(left);
        this.el.appendChild(right);
    }
    Swiper.prototype.next = function () {
        var next;
        if (this.activedIndex < this.imgs.length - 1) {
            next = this.activedIndex + 1;
        } else {
            next = 0;
        }
        this.activeIndex(next);
        this.activedIndex = next;

    };
    Swiper.prototype.prev = function () {
        var prev;
        if (this.activedIndex > 0) {
            prev = this.activedIndex - 1;
        } else {
            prev = this.imgs.length - 1;
        }
        this.activeIndex(prev);
        this.activedIndex = prev;
    };
    window.Swiper = window.Swiper || Swiper;
}(window);

