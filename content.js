var TAG_TYPE = {
    IMG : 0,
    LINK : 1
};
String.prototype.isEndWith = function (b) {
    return null == b || "" == b || null == this || 0 == this.length || b.length > this.length ? !1 : this.substring(this.length - b.length).toLowerCase() == b.toLowerCase() ? !0 : !1
};

function absolute(base, relative) {
    var stack = base.split("/"),
        parts = relative.split("/");
    stack.pop(); // remove current file name (or empty string)
    // (omit if "base" is the current folder without trailing slash)
    for (var i=0; i<parts.length; i++) {
        if (parts[i] == ".")
            continue;
        if (parts[i] == "..")
            stack.pop();
        else
            stack.push(parts[i]);
    }
    return stack.join("/");
}

var PageQuery = function () {};
PageQuery.prototype = {
    images : [],
    getList : function (b) {
        this.images = [];
        
        // img tag
        for (var d = document.getElementsByTagName("img"), c = 0; c < d.length; c++) {
            var a = d[c];
            if (0 != a.src.length && 0 != a.src.indexOf("data:")) {
                var e = new Image;
                e.src = a.src;
                var f = parseInt(a.naturalWidth),
                    g = parseInt(a.naturalHeight),
                    h = parseInt(e.width),
                    e = parseInt(e.height),
                    f = Math.max(f, h),
                    g = Math.max(g, e);
                this.add(TAG_TYPE.IMG, a.src, f, g)
            }
        }
        
        // a href
        d = document.getElementsByTagName("a");
        for (var c = 0; c < d.length; c++)
            a = d[c].href, (a.isEndWith(".jpg") || a.isEndWith(".jpeg") ||
                a.isEndWith(".gif") || a.isEndWith(".png") || a.isEndWith(".bmp") || a.isEndWith(".ico")) && this.add(TAG_TYPE.LINK, a, 0, 0);
        
        // css
        var list_css = document.getElementsByTagName("link");
        var that = this;
        for (var c = 0; c < list_css.length; c++) {
            var href_css = list_css[c].href;
            if (href_css.isEndWith(".css")) {
                this.add(TAG_TYPE.LINK, href_css, 0, 0);

                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function(){
                    if (xhr.readyState == 4 && xhr.status == 200) {
                        var text_css = xhr.responseText;
                        var patt = /url\(['"]?([^)'"]+?)['"]?\)/ig;
                        var array_image;
                        while ((array_image = patt.exec(text_css)) != null) {
                            if (array_image[1]) {
                                if (array_image[1].toLowerCase().indexOf("http") == 0) {
                                    abs_css = array_image[1];
                                } else if (array_image[1].toLowerCase().indexOf("data") == 0) {
                                    
                                } else {
                                    abs_css = absolute(href_css, array_image[1]);
                                }
                            }
                            that.add(TAG_TYPE.LINK, abs_css, 0, 0);
                        }
                    }
                }
                xhr.open("GET", href_css, false);
                xhr.send();
            }
        }
        
        // js
        var list_js = document.getElementsByTagName("script");
        for (var c = 0; c < list_js.length; c++) {
            src_js = list_js[c].src;
            this.add(TAG_TYPE.LINK, src_js, 0, 0);
        }
        
        0 < this.images.length && chrome.extension.sendMessage({
            action : "IMAGELIST_LOAD",
            images : this.images,
            outputTabId : b
        });
    },
    add : function (b, d, c, a) {
        this.images.push({
            tagType : b,
            src : d,
            width : c,
            height : a
        })
    }
};
var pageQuery = new PageQuery;
