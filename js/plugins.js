// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

/**
 * MBP - Mobile boilerplate helper functions
 */

(function(document) {

    window.MBP = window.MBP || {};

    /**
     * Fix for iPhone viewport scale bug
     * http://www.blog.highub.com/mobile-2/a-fix-for-iphone-viewport-scale-bug/
     */

    MBP.viewportmeta = document.querySelector && document.querySelector('meta[name="viewport"]');
    MBP.ua = navigator.userAgent;

    MBP.scaleFix = function() {
        if (MBP.viewportmeta && /iPhone|iPad|iPod/.test(MBP.ua) && !/Opera Mini/.test(MBP.ua)) {
            MBP.viewportmeta.content = 'width=device-width, minimum-scale=1.0, maximum-scale=1.0';
            document.addEventListener('gesturestart', MBP.gestureStart, false);
        }
    };

    MBP.gestureStart = function() {
        MBP.viewportmeta.content = 'width=device-width, minimum-scale=0.25, maximum-scale=1.6';
    };

    /**
     * Normalized hide address bar for iOS & Android
     * (c) Scott Jehl, scottjehl.com
     * MIT License
     */

    // If we split this up into two functions we can reuse
    // this function if we aren't doing full page reloads.

    // If we cache this we don't need to re-calibrate everytime we call
    // the hide url bar
    MBP.BODY_SCROLL_TOP = false;

    // So we don't redefine this function everytime we
    // we call hideUrlBar
    MBP.getScrollTop = function() {
        var win = window;
        var doc = document;

        return win.pageYOffset || doc.compatMode === 'CSS1Compat' && doc.documentElement.scrollTop || doc.body.scrollTop || 0;
    };

    // It should be up to the mobile
    MBP.hideUrlBar = function() {
        var win = window;

        // if there is a hash, or MBP.BODY_SCROLL_TOP hasn't been set yet, wait till that happens
        if (!location.hash && MBP.BODY_SCROLL_TOP !== false) {
            win.scrollTo( 0, MBP.BODY_SCROLL_TOP === 1 ? 0 : 1 );
        }
    };

    MBP.hideUrlBarOnLoad = function() {
        var win = window;
        var doc = win.document;
        var bodycheck;

        // If there's a hash, or addEventListener is undefined, stop here
        if ( !location.hash && win.addEventListener ) {

            // scroll to 1
            window.scrollTo( 0, 1 );
            MBP.BODY_SCROLL_TOP = 1;

            // reset to 0 on bodyready, if needed
            bodycheck = setInterval(function() {
                if ( doc.body ) {
                    clearInterval( bodycheck );
                    MBP.BODY_SCROLL_TOP = MBP.getScrollTop();
                    MBP.hideUrlBar();
                }
            }, 15 );

            win.addEventListener('load', function() {
                setTimeout(function() {
                    // at load, if user hasn't scrolled more than 20 or so...
                    if (MBP.getScrollTop() < 20) {
                        // reset to hide addr bar at onload
                        MBP.hideUrlBar();
                    }
                }, 0);
            });
        }
    };

    /**
     * Fast Buttons - read wiki below before using
     * https://github.com/h5bp/mobile-boilerplate/wiki/JavaScript-Helper
     */

    MBP.fastButton = function(element, handler, pressedClass) {
        this.handler = handler;
        // styling of .pressed is defined in the project's CSS files
        this.pressedClass = typeof pressedClass === 'undefined' ? 'pressed' : pressedClass;

        MBP.listenForGhostClicks();

        if (element.length && element.length > 1) {
            for (var singleElIdx in element) {
                this.addClickEvent(element[singleElIdx]);
            }
        } else {
            this.addClickEvent(element);
        }
    };

    MBP.fastButton.prototype.handleEvent = function(event) {
        event = event || window.event;

        switch (event.type) {
            case 'touchstart': this.onTouchStart(event); break;
            case 'touchmove': this.onTouchMove(event); break;
            case 'touchend': this.onClick(event); break;
            case 'click': this.onClick(event); break;
        }
    };

    MBP.fastButton.prototype.onTouchStart = function(event) {
        var element = event.target || event.srcElement;
        event.stopPropagation();
        element.addEventListener('touchend', this, false);
        document.body.addEventListener('touchmove', this, false);
        this.startX = event.touches[0].clientX;
        this.startY = event.touches[0].clientY;

        element.className+= ' ' + this.pressedClass;
    };

    MBP.fastButton.prototype.onTouchMove = function(event) {
        if (Math.abs(event.touches[0].clientX - this.startX) > 10 ||
            Math.abs(event.touches[0].clientY - this.startY) > 10) {
            this.reset(event);
        }
    };

    MBP.fastButton.prototype.onClick = function(event) {
        event = event || window.event;
        var element = event.target || event.srcElement;
        if (event.stopPropagation) {
            event.stopPropagation();
        }
        this.reset(event);
        this.handler.apply(event.currentTarget, [event]);
        if (event.type == 'touchend') {
            MBP.preventGhostClick(this.startX, this.startY);
        }
        var pattern = new RegExp(' ?' + this.pressedClass, 'gi');
        element.className = element.className.replace(pattern, '');
    };

    MBP.fastButton.prototype.reset = function(event) {
        var element = event.target || event.srcElement;
        rmEvt(element, 'touchend', this, false);
        rmEvt(document.body, 'touchmove', this, false);

        var pattern = new RegExp(' ?' + this.pressedClass, 'gi');
        element.className = element.className.replace(pattern, '');
    };

    MBP.fastButton.prototype.addClickEvent = function(element) {
        addEvt(element, 'touchstart', this, false);
        addEvt(element, 'click', this, false);
    };

    MBP.preventGhostClick = function(x, y) {
        MBP.coords.push(x, y);
        window.setTimeout(function() {
            MBP.coords.splice(0, 2);
        }, 2500);
    };

    MBP.ghostClickHandler = function(event) {
        if (!MBP.hadTouchEvent && MBP.dodgyAndroid) {
            // This is a bit of fun for Android 2.3...
            // If you change window.location via fastButton, a click event will fire
            // on the new page, as if the events are continuing from the previous page.
            // We pick that event up here, but MBP.coords is empty, because it's a new page,
            // so we don't prevent it. Here's we're assuming that click events on touch devices
            // that occur without a preceding touchStart are to be ignored.
            event.stopPropagation();
            event.preventDefault();
            return;
        }
        for (var i = 0, len = MBP.coords.length; i < len; i += 2) {
            var x = MBP.coords[i];
            var y = MBP.coords[i + 1];
            if (Math.abs(event.clientX - x) < 25 && Math.abs(event.clientY - y) < 25) {
                event.stopPropagation();
                event.preventDefault();
            }
        }
    };

    // This bug only affects touch Android 2.3 devices, but a simple ontouchstart test creates a false positive on
    // some Blackberry devices. https://github.com/Modernizr/Modernizr/issues/372
    // The browser sniffing is to avoid the Blackberry case. Bah
    MBP.dodgyAndroid = ('ontouchstart' in window) && (navigator.userAgent.indexOf('Android 2.3') != -1);

    MBP.listenForGhostClicks = (function() {
        var alreadyRan = false;

        return function() {
            if(alreadyRan) {
                return;
            }

            if (document.addEventListener) {
                document.addEventListener('click', MBP.ghostClickHandler, true);
            }
            addEvt(document.documentElement, 'touchstart', function() {
                MBP.hadTouchEvent = true;
            }, false);

            alreadyRan = true;
        };
    })();

    MBP.coords = [];

    // fn arg can be an object or a function, thanks to handleEvent
    // read more about the explanation at: http://www.thecssninja.com/javascript/handleevent
    function addEvt(el, evt, fn, bubble) {
        if ('addEventListener' in el) {
            // BBOS6 doesn't support handleEvent, catch and polyfill
            try {
                el.addEventListener(evt, fn, bubble);
            } catch(e) {
                if (typeof fn == 'object' && fn.handleEvent) {
                    el.addEventListener(evt, function(e){
                        // Bind fn as this and set first arg as event object
                        fn.handleEvent.call(fn,e);
                    }, bubble);
                } else {
                    throw e;
                }
            }
        } else if ('attachEvent' in el) {
            // check if the callback is an object and contains handleEvent
            if (typeof fn == 'object' && fn.handleEvent) {
                el.attachEvent('on' + evt, function(){
                    // Bind fn as this
                    fn.handleEvent.call(fn);
                });
            } else {
                el.attachEvent('on' + evt, fn);
            }
        }
    }

    function rmEvt(el, evt, fn, bubble) {
        if ('removeEventListener' in el) {
            // BBOS6 doesn't support handleEvent, catch and polyfill
            try {
                el.removeEventListener(evt, fn, bubble);
            } catch(e) {
                if (typeof fn == 'object' && fn.handleEvent) {
                    el.removeEventListener(evt, function(e){
                        // Bind fn as this and set first arg as event object
                        fn.handleEvent.call(fn,e);
                    }, bubble);
                } else {
                    throw e;
                }
            }
        } else if ('detachEvent' in el) {
            // check if the callback is an object and contains handleEvent
            if (typeof fn == 'object' && fn.handleEvent) {
                el.detachEvent("on" + evt, function() {
                    // Bind fn as this
                    fn.handleEvent.call(fn);
                });
            } else {
                el.detachEvent('on' + evt, fn);
            }
        }
    }

    /**
     * Autogrow
     * http://googlecode.blogspot.com/2009/07/gmail-for-mobile-html5-series.html
     */

    MBP.autogrow = function(element, lh) {
        function handler(e) {
            var newHeight = this.scrollHeight;
            var currentHeight = this.clientHeight;
            if (newHeight > currentHeight) {
                this.style.height = newHeight + 3 * textLineHeight + 'px';
            }
        }

        var setLineHeight = (lh) ? lh : 12;
        var textLineHeight = element.currentStyle ? element.currentStyle.lineHeight : getComputedStyle(element, null).lineHeight;

        textLineHeight = (textLineHeight.indexOf('px') == -1) ? setLineHeight : parseInt(textLineHeight, 10);

        element.style.overflow = 'hidden';
        element.addEventListener ? element.addEventListener('input', handler, false) : element.attachEvent('onpropertychange', handler);
    };

    /**
     * Enable CSS active pseudo styles in Mobile Safari
     * http://alxgbsn.co.uk/2011/10/17/enable-css-active-pseudo-styles-in-mobile-safari/
     */

    MBP.enableActive = function() {
        document.addEventListener('touchstart', function() {}, false);
    };

    /**
     * Prevent default scrolling on document window
     */

    MBP.preventScrolling = function() {
        document.addEventListener('touchmove', function(e) {
            if (e.target.type === 'range') { return; }
            e.preventDefault();
        }, false);
    };

    /**
     * Prevent iOS from zooming onfocus
     * https://github.com/h5bp/mobile-boilerplate/pull/108
     * Adapted from original jQuery code here: http://nerd.vasilis.nl/prevent-ios-from-zooming-onfocus/
     */

    MBP.preventZoom = function() {
        var formFields = document.querySelectorAll('input, select, textarea');
        var contentString = 'width=device-width,initial-scale=1,maximum-scale=';
        var i = 0;
        var fieldLength = formFields.length;

        var setViewportOnFocus = function() {
            MBP.viewportmeta.content = contentString + '1';
        };

        var setViewportOnBlur = function() {
            MBP.viewportmeta.content = contentString + '10';
        };

        for (; i < fieldLength; i++) {
            formFields[i].onfocus = setViewportOnFocus;
            formFields[i].onblur = setViewportOnBlur;
        }
    };

    /**
     * iOS Startup Image helper
     */

    MBP.startupImage = function() {
        var portrait;
        var landscape;
        var pixelRatio;
        var head;
        var link1;
        var link2;

        pixelRatio = window.devicePixelRatio;
        head = document.getElementsByTagName('head')[0];

        if (navigator.platform === 'iPad') {
            portrait = pixelRatio === 2 ? 'img/startup/startup-tablet-portrait-retina.png' : 'img/startup/startup-tablet-portrait.png';
            landscape = pixelRatio === 2 ? 'img/startup/startup-tablet-landscape-retina.png' : 'img/startup/startup-tablet-landscape.png';

            link1 = document.createElement('link');
            link1.setAttribute('rel', 'apple-touch-startup-image');
            link1.setAttribute('media', 'screen and (orientation: portrait)');
            link1.setAttribute('href', portrait);
            head.appendChild(link1);

            link2 = document.createElement('link');
            link2.setAttribute('rel', 'apple-touch-startup-image');
            link2.setAttribute('media', 'screen and (orientation: landscape)');
            link2.setAttribute('href', landscape);
            head.appendChild(link2);
        } else {
            portrait = pixelRatio === 2 ? "img/startup/startup-retina.png" : "img/startup/startup.png";
            portrait = screen.height === 568 ? "img/startup/startup-retina-4in.png" : portrait;
            link1 = document.createElement('link');
            link1.setAttribute('rel', 'apple-touch-startup-image');
            link1.setAttribute('href', portrait);
            head.appendChild(link1);
        }

        //hack to fix letterboxed full screen web apps on 4" iPhone / iPod
        if (navigator.platform.match(/iPhone|iPod/i) && (screen.height === 568)) {
            if (MBP.viewportmeta) {
                MBP.viewportmeta.content = MBP.viewportmeta.content
                    .replace(/\bwidth\s*=\s*320\b/, 'width=320.1')
                    .replace(/\bwidth\s*=\s*device-width\b/, '');
            }
        }
    };

})(document);

// Place any jQuery plugins here.

/*! Sidr - v1.1.1 - 2013-03-14
 * https://github.com/artberri/sidr
 * Copyright (c) 2013 Alberto Varela; Licensed MIT */
(function(e){var t=!1,i=!1,o={isUrl:function(e){var t=RegExp("^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$","i");return t.test(e)?!0:!1},loadContent:function(e,t){e.html(t)},addPrefix:function(e){var t=e.attr("id"),i=e.attr("class");"string"==typeof t&&""!==t&&e.attr("id",t.replace(/([A-Za-z0-9_.\-]+)/g,"sidr-id-$1")),"string"==typeof i&&""!==i&&"sidr-inner"!==i&&e.attr("class",i.replace(/([A-Za-z0-9_.\-]+)/g,"sidr-class-$1")),e.removeAttr("style")},execute:function(o,n,s){"function"==typeof n?(s=n,n="sidr"):n||(n="sidr");var a,d,l,c=e("#"+n),f=e(c.data("body")),u=e("html"),p=c.outerWidth(!0),y=c.data("speed"),v=c.data("side");if("open"===o||"toogle"===o&&!c.is(":visible")){if(c.is(":visible")||t)return;if(i!==!1)return r.close(i,function(){r.open(n)}),void 0;t=!0,"left"===v?(a={left:p+"px"},d={left:"0px"}):(a={right:p+"px"},d={right:"0px"}),l=u.scrollTop(),u.css("overflow-x","hidden").scrollTop(l),f.css({width:f.width(),position:"absolute"}).animate(a,y),c.css("display","block").animate(d,y,function(){t=!1,i=n,"function"==typeof s&&s(n)})}else{if(!c.is(":visible")||t)return;t=!0,"left"===v?(a={left:0},d={left:"-"+p+"px"}):(a={right:0},d={right:"-"+p+"px"}),l=u.scrollTop(),u.removeAttr("style").scrollTop(l),f.animate(a,y),c.animate(d,y,function(){c.removeAttr("style"),f.removeAttr("style"),e("html").removeAttr("style"),t=!1,i=!1,"function"==typeof s&&s(n)})}}},r={open:function(e,t){o.execute("open",e,t)},close:function(e,t){o.execute("close",e,t)},toogle:function(e,t){o.execute("toogle",e,t)}};e.sidr=function(t){return r[t]?r[t].apply(this,Array.prototype.slice.call(arguments,1)):"function"!=typeof t&&"string"!=typeof t&&t?(e.error("Method "+t+" does not exist on jQuery.sidr"),void 0):r.toogle.apply(this,arguments)},e.fn.sidr=function(t){var i=e.extend({name:"sidr",speed:200,side:"left",source:null,renaming:!0,body:"body"},t),n=i.name,s=e("#"+n);if(0===s.length&&(s=e("<div />").attr("id",n).appendTo(e("body"))),s.addClass("sidr").addClass(i.side).data({speed:i.speed,side:i.side,body:i.body}),"function"==typeof i.source){var a=i.source(n);o.loadContent(s,a)}else if("string"==typeof i.source&&o.isUrl(i.source))e.get(i.source,function(e){o.loadContent(s,e)});else if("string"==typeof i.source){var d="",l=i.source.split(",");if(e.each(l,function(t,i){d+='<div class="sidr-inner">'+e(i).html()+"</div>"}),i.renaming){var c=e("<div />").html(d);c.find("*").each(function(t,i){var r=e(i);o.addPrefix(r)}),d=c.html()}o.loadContent(s,d)}else null!==i.source&&e.error("Invalid Sidr Source");return this.each(function(){var t=e(this),i=t.data("sidr");i||(t.data("sidr",n),t.click(function(e){e.preventDefault(),r.toogle(n)}))})}})(jQuery);









