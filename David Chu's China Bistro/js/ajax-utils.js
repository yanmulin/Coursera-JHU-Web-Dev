(function (global) {
    var ajaxUtils = {};

    var getRequestObject = function () {
        if (global.XMLHttpRequest) {
            return (new global.XMLHttpRequest());
        } else if (global.ActiveXObject) {
            return (new global.ActiveXObject());
        } else {
            global.alert("ajax unsupported!");
            return null;
        }
    };

    ajaxUtils.sendGetRequest = function (requestUrl, responseHandler, isJsonResponse) {
        var request = getRequestObject();
        request.onreadystatechange = function () {
            handleResponse(request, responseHandler, isJsonResponse);
        };
        request.open("Get", requestUrl);
        request.send(null);
    };

    var handleResponse = function (request, responseHandler, isJsonResponse) {
        if (isJsonResponse == undefined) {
            isJsonResponse = true;
        }
        if (request.readyState == 4 && request.status == 200) {
            if (isJsonResponse == true) 
                responseHandler(JSON.parse(request.responseText));
            else 
                responseHandler(request.responseText);
        }
    };

    global.$ajaxUtils = ajaxUtils;
    
})(window);