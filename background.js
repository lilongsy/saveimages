var theApp = {
    init : function () {
        this.initContextMenus();
        this.initEventListener();
    },
    initContextMenus : function () {
        chrome.contextMenus.create({
            title: "保存图片样式脚本文件",
            contexts: ["all"],
            onclick: this.download
        });
    },

    initEventListener: function () {
        chrome.extension.onMessage.addListener(function (a) {
            console.log(a.action);
            if ("IMAGELIST_LOAD" == a.action) {
                var images = a.images;
                for(var i = 0; i<images.length; i++) {
                    var f = images[i].src.replace(/https*:\/\//, '');
                    console.log(f);
                    chrome.downloads.download({
                        url: images[i].src,
                        filename:f,
                        saveAs : !1,
                        conflictAction : "overwrite"
                    });
                }
            }
        });
    },

    download: function() {
        chrome.tabs.query(
            {
                active : !0,
                windowId : chrome.windows.WINDOW_ID_CURRENT
            },
            function(b){
                c = b[0];
                chrome.tabs.executeScript(c.id, {
                    file: "content.js",
                    allFrames : !0
                }, function () {
                    var a = "pageQuery.getList(" + c.id + ");";
                    chrome.tabs.executeScript(c.id, {
                        code : a,
                        allFrames : !0
                    })
                });
            }
        );
    }
}
theApp.init();