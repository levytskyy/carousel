/*let slider = new Slider({
    el: '.slides',
    items: 3,
    offsetRight: 60,
    prev: '.carousel__nav-prev',
    next: '.carousel__nav-next',
});*/

function Slider(levit) {
    const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth;
    const isSmoothScrollSupported = 'scrollBehavior' in document.documentElement.style;
    const requestAnimFrame = (function () {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    let timer = null;
    let isScrollDisabled = false;
    let isScrolling = false;

    this.scrollPosition = 0;
    this.currentIndex = 0;

    this.el = document.querySelector('.scroll-slider');
    this.divEl = this.el.getElementsByTagName('div');
    this.margin = 0;

    this.btPrev = document.querySelector(levit.prev);
    this.btNext = document.querySelector(levit.next);
    this.elWidth = 0;

    this.init = function () {

    };

    this.initSizes = function () {
        let style = this.divEl[0].currentStyle || window.getComputedStyle(this.divEl[0]);
        this.margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);
        if (levit.items) {
            for (let i = 0; i < this.divEl.length; i++) {
                this.divEl[i].style.width = 'calc(' + ((100 / levit.items) - (((this.margin*2) / windowWidth) * 100)) + '% - ' + levit.offsetRight / levit.items + 'px)';
            }
        }
        this.elWidth = this.divEl[0].offsetWidth + this.margin;
    };

    this.goTo = function (index) {
        if (isSmoothScrollSupported) {
            if(this.divEl[index]){
                let distance = this.divEl[index].offsetLeft - this.margin;
                this.el.scrollTo({
                    top: 0,
                    left: distance,
                    behavior: "smooth"
                });
            }
        } else {
            this.scrollBy(index, 300);
        }
    };

    this.scrollBy = function (index, duration) {
        let _self = this;
        let initialX = this.el.scrollLeft;

        let distance = this.divEl[index].offsetLeft - this.margin;
        let baseX = (initialX + distance) * 0.5;
        let difference = initialX - baseX;
        let startTime = performance.now();

        this.el.style.overflow = 'auto';

        function step() {
            let normalizedTime = (performance.now() - startTime) / duration;
            if (normalizedTime > 1) normalizedTime = 1;
            _self.el.scrollTo(baseX + difference * Math.cos(normalizedTime * Math.PI), 0);
            if (normalizedTime < 1) requestAnimFrame(step);
        }

        requestAnimFrame(step);

        /*if(!isScrolling){

            requestAnimFrame(step);
        }else{
            _self.el.scrollTo({
                top: 0,
                left: 0
            });
        }*/
    };


    this.el.addEventListener('scroll', (e) => {
        if(!isScrollDisabled){
            this.scrollPosition = e.target.scrollLeft;
            this.currentIndex = Math.floor(this.scrollPosition / this.elWidth);
            isScrolling = true;
            //console.log(this.currentIndex);
        }
        if(timer !== null) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            this.el.style.overflow = 'auto';
            isScrollDisabled = false;
            isScrolling = false;
        }, 60);
    });

    this.btNext.addEventListener('click', () => {
        if(isScrolling){
            this.el.style.overflow = 'hidden';
        }

        isScrollDisabled = true;

        this.currentIndex += this.currentIndex < this.divEl.length - levit.items ? 1 : 0;

        this.goTo( this.currentIndex);
    });

    this.btPrev.addEventListener('click', () => {
        if(isScrolling){
            this.el.style.overflow = 'hidden';
        }

        isScrollDisabled = true;

        this.currentIndex -= this.currentIndex > 0 ? 1 : 0;

        this.goTo(this.currentIndex);
    });


    this.initSizes();
}




