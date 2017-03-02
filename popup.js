$(document).ready(function(){
    $("#status").click(function(){
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
    });
});