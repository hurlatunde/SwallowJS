/**
 * SwallowJs(tm) : SwallowJs Framework (http://docs.swallow.js)
 *
 * For full copyright and license information, please see the LICENSE.txt
 *
 * @link          http://docs.swallow.js SwallowJs(tm) Project
 * @package       component.utility.helper.js
 * @since         SwallowJs(tm) v 0.2.9
 */

function swallowLoading(parameters) {
    var element = parameters.element;
    var show = parameters.show;

    var parentElement;

    if (typeof element === "undefined" || element === null) {
        parentElement = $('body');
        parentElement.css('position','relative');
    } else {
        parentElement = $("#" + element);
        parentElement.css('position','relative');
    }

    if (show == true) {
        $(parentElement).append('' +
            '<div id="modal_loading">'+
            '<div class="md-modal md-modal-mini md-effect-11 inner_loading md-show" id="modal-11">' +
            '<div class="md-content"> ' +
            '<div id="spinner-holder "> ' +
            '<div> ' +
            '<div class="spinner"> ' +
            '<div class="bounce1"></div> ' +
            '<div class="bounce2"></div> ' +
            '<div class="bounce3"></div> ' +
            '</div> ' +
            '</div>' +
            '<div class="text-center"> ' +
            '<p id="loading_message"> Loading... </p> ' +
            '</div> ' +
            '</div> ' +
            '</div> ' +
            '</div> ' +
            '</div>'
        );
    } else {
        $( "#" + element +" #modal_loading").html('');
    }

}

/**
 *
 * @author Femi TAIWO
 */
function logMessage() {
    if (!debug) return;
    switch (arguments.length) {
        case 0:
            return;
        case 1:
            console.log(arguments[0]);
            break;
        case 2:
            console.log(arguments[0], arguments[1]);
            break;
        case 3:
            console.log(arguments[0], arguments[1], arguments[2]);
            break;
        case 4:
            console.log(arguments[0], arguments[1], arguments[2], arguments[3]);
            break;
        default:
            console.log(arguments);
    }
}

/**
 *  \ref http://stackoverflow.com/questions/950087/how-to-include-a-javascript-file-in-another-javascript-file
 * @param url
 * @param callback
 */
function loadScript(url, callback) {
    // var url = parameters.url;
    // var callback = parameters.callback;

    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    if (typeof callback !== "undefined" || callback !== null) {
        script.onreadystatechange = callback;
        script.onload = callback;
    }
    logMessage(script);
    head.appendChild(script);
}

/**
 * ref http://stackoverflow.com/questions/2145914/including-a-js-file-within-a-js-file
 * @param src
 * @param f
 */
function loadScript_(src, f) {
    var head = document.getElementsByTagName("head")[0];
    var script = document.createElement("script");
    script.src = src;
    var done = false;
    script.onload = script.onreadystatechange = function () {
        // attach to both events for cross browser finish detection:
        if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
            done = true;
            if (typeof f == 'function') f();
            // cleans up a little memory:
            script.onload = script.onreadystatechange = null;
            head.removeChild(script);
        }
    };
    head.appendChild(script);
}

/**
 * @redirectUrl
 * @param redirect_url '/users
 * @param params       '/users/122/884
 */
function redirectUrl(redirect_url, params) {
    var encoded = encodeURIComponent(redirect_url.toLowerCase());
    if (params) {
        var params = params.join('/');
        $(location).attr('href', baseUrl + '#/' + encoded + '/' + params);
    } else {
        $(location).attr('href', baseUrl + '#/' + encoded);
    }
}


/**
 *
 * @param formData element
 * @returns {Array of Objects}
 */
function formToArray(element) {
    var formData = $("#" + element).serializeArray();
    var dataArray;
    dataArray = {};
    for (var i in formData) {
        dataArray[formData[i].name.trim()] = formData[i].value.trim();
    }
    return dataArray;
}

/**
 *
 * @param value
 * @return {string|*}
 */
function isBlank(value) {
    return $.trim(value);
}

/**
 *
 * @param length
 * @returns {string}
 */
function generateRandomString(length) {
    //var chars = "abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+<>ABCDEFGHIJKLMNOP1234567890";
    var chars = "abcdefghijklmnopqrstuvwxyz";
    var pass = "";
    for (var x = 0; x < length; x++) {
        var i = Math.floor(Math.random() * chars.length);
        pass += chars.charAt(i);
    }
    return pass;
}

/**
 *
 * @param baseUrl
 * @returns {string}
 */
function getAbsolutePath(baseUrl) {
    var loc = window.location;
    if (baseUrl == false) {
        return window.location.pathname;
    }
    var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
    return loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));
}




/***
 *
 *  Enabling auto route
 *  @param enabled
 **/

function enableAutoRoute(enabled){
    if(enabled){
        logMessage("**** Auto route enabled ****");
        var layouts = (CONFIG.layoutConfig('layout'));
        for (var eachLayout in layouts) {
            Path.map("#/"+eachLayout).to(function () {
                renderLayout(eachLayout, swallowJsContainer);
            }).enter(clearPanel);
        }
    }
}