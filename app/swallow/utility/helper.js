/**
 * SwallowJs(tm) : SwallowJs Framework (http://docs.swallow.js)
 *
 * For full copyright and license information, please see the LICENSE.txt
 *
 * @link          http://docs.swallow.js SwallowJs(tm) Project
 * @package       component.utility.helper.js
 * @since         SwallowJs(tm) v 0.2.9
 */


let swHelper = {

    swGlobalId: null,

    /**
     * @param baseUrl
     * @returns {string}
     */
    getAbsolutePath: function (baseUrl) {
        let loc = window.location;
        if (baseUrl === false) {
            let hash = window.location.hash;
            hash = hash.trim().split('/');
            hash = this.cleanArray(hash);
            return hash[1];
        }
        let pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
        return loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));
    },

    /**
     *  Will remove all false values: undefined, null, 0, false, NaN and "" (empty string)
     * @param params
     * @return {Array}
     */
    cleanArray: function (params) {
        let newArray = [];
        for (let i = 0; i < params.length; i++) {
            if (params[i]) {
                newArray.push(params[i]);
            }
        }
        return newArray;
    },

    /**
     * @param pString
     * @returns {boolean}
     */
    isBlank: function (pString) {
        if (!pString || pString.length === 0) {
            return true;
        }
        // checks for a non-white space character
        // which I think [citation needed] is faster
        // than removing all the whitespace and checking
        // against an empty string
        return !/[^\s]+/.test(pString);
    },

    /**
     * @param e
     * @returns {boolean}
     */
    empty: function (e) {
        switch (e) {
            case typeof (e) === 'string':
                return !e.trim();
            case "":
            case 0:
            case "0":
            case null:
            case typeof (e) === 'object':
                if (JSON.stringify(e) === '{}' || JSON.stringify(e) === '[]') {
                    return true;
                } else if (!e) {
                    return true;
                }
                return false;
            case false:
            case typeof this == "undefined":
                return true;
            default:
                return false;
        }
    },

    loadScripts: function(includePath)  {
        for (let i = 0; i < includePath.length; i++) {
            let jsFilePath = includePath[i];
            if (jsFilePath.toString().indexOf('_js?_=') >= 0) {
                let jsFilePathParticles = jsFilePath.split('._js?_=');
                let jsFile = jsFilePathParticles[0];
                let parentScript = false;
                let nodeId;

                if ((jsFilePathParticles[1].indexOf('_parentLayout') >= 0)) {
                    parentScript = true;
                    nodeId = jsFilePathParticles[1].replace('_parentLayout', '');
                } else {
                    nodeId = jsFilePathParticles[1];
                }

                let ref = document.getElementsByTagName( "script" )[ 0 ];

                let script = document.createElement("script");
                script.type = "text/javascript";
                script.classList.add('swInclude');
                script.setAttribute('data-swNode', nodeId);
                script.src = `${jsFile}.js`;
                if (parentScript) {
                    ref.parentNode.appendChild(script);
                } else {
                    ref.parentNode.appendChild(script);
                }
            }
        }
    }

}


let error = {

    /**
     * @param error
     * @returns {*}
     */
    throwError: function (error) {
        throw new Error(error)
    }

}


/**
 *
 * @param parameters
 */
function swallowLoading(parameters) {
    var element = parameters.element;
    var show = parameters.show;

    var parentElement;

    if (typeof element === "undefined" || element === null) {
        parentElement = $('body');
        //parentElement.css('position', 'relativegetAbsolutePath');
    } else {
        parentElement = $("#" + element);
        //parentElement.css('position', 'relative');
    }

    if (show == true) {
        $(parentElement).append('' +
            '<div id="modal_loading">' +
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
            '<p id="loading_message"> Loading.... Please wait </p> ' +
            '</div> ' +
            '</div> ' +
            '</div> ' +
            '</div> ' +
            '</div>'
        );
    } else {
        $("#" + element + " #modal_loading").html('');
    }

}

/**
 * @author Femi TAIWO
 */
function logMessage() {

    if (!debug) return;
    switch (arguments.length) {
        case 0:
            return;
        case 1:
            console_view(arguments[0]);
            console.log(arguments[0]);
            break;
        case 2:
            console_view(arguments[0], arguments[1]);
            console.log(arguments[0], arguments[1]);
            break;
        case 3:
            console_view(arguments[0], arguments[1], arguments[2]);
            console.log(arguments[0], arguments[1], arguments[2]);
            break;
        case 4:
            console_view(arguments[0], arguments[1], arguments[2], arguments[3]);
            console.log(arguments[0], arguments[1], arguments[2], arguments[3]);
            break;
        default:
            console.log(arguments);
            console_view(arguments);
    }
}

function JsonViewer(self, options) {
    var json = $.parseJSON(self.data('json'));
    options = $.extend({}, this.defaults, options);
    var expanderClasses = getExpanderClasses(options.expanded);
    self.html('<ul class="json-container"></ul>');
    self.find('.json-container').append(json2html([json], expanderClasses));
}

function console_view(argument_1, argument_2, argument_3, argument_4) {
    // $('body').append('<div id="swallow_console_view"><div id="close_console_view">Console Message</div><div id="console_message"></div></div>');
    //
    // var str = argument_1 + "|" + argument_2 + "|" + argument_3 + "|" + argument_4;
    // var temp = new Array();
    // temp = str.split("|");
    // var setData = {};
    // for (var a in temp) {
    //     if (temp[a] != "undefined") {
    //         setData[a] = temp[a];
    //     }
    // }
    //
    // var consoleLogMessagessHolder = $('#console_message');
    // console.log(consoleLogMessagessHolder);


    // new JsonViewer(self, options);

//     var self = $(this
// else
//     if (typeof json == 'object') {
//         self.data('json', JSON.stringify(json))
//     }
//     else {
//         self.data('json', '');
//     }
//     new JsonViewer(self, options);
//     console.log(setData);
//     return;


    //
    //
    // var str = argument_1 + "|" + argument_2 + "|" + argument_3 + "|" + argument_4;
    // var temp = new Array();
    // temp = str.split("|");
    //
    // var setData = new Array();
    // for (var a in temp) {
    //     if (temp[a] != "undefined") {
    //         setData.push(temp[a]);
    //     }
    // }
    //
    // jsonview(setData);

    // JSON.stringify(arguments, undefined, 1)
    //$('body').append('<div id="swallow_console_view"><div id="close_console_view">Console Message</div><div id="console_message"></div></div>');


    // var setData = new Array();
    // for (var a in temp) {
    //     if (temp[a] != "undefined") {
    //         //     console.log(temp[a]);
    //         //     setData.push('<pre>'+temp[a]+'</pre>');
    //         //
    //         // return this.each(function () {
    //         //     );
    //         //     if (typeof json == 'string') {
    //         //         self.data('json', json);
    //         //     }var self = $(this
    //         //     else if (typeof json == 'object') {
    //         //         self.data('json', JSON.stringify(json))
    //         //     }
    //         //     else {
    //         //         self.data('json', '');
    //         //     }
    //         //     new JsonViewer(self, options);
    //         // });
    //         var self = temp[a];
    //         // if (typeof temp[a] == 'string') {
    //         //     self.data('json', temp[a]);
    //         // }
    //         console.log(self);
    //     }
    // }
    //console.log(setData);

    // if ($("#console_message").length) {
    //     $('#console_message').jsonview(str);
    //     // $('#console_message').prepend(setData);
    // } else {
    //     $('#console_message').jsonview(str);
    // }
    //$('#console_message').jsonview(str);
}

jsonview = function (json, options) {
    return this.each(function () {
        var self = $(this);
        console.log(self);

        // if (typeof json == 'string') {
        //     self.data('json', json);
        // }
        // else if (typeof json == 'object') {
        //     self.data('json', JSON.stringify(json))
        // }
        // else {
        //     self.data('json', '');
        // }
        // new JsonViewer(self, options);
    });
};

var getSc = function (firstPath, includePath, f) {
    logMessage(firstPath);
    var length = includePath.length;
    $.getScript(firstPath, function (data, textStatus, jqxhr) {
        if (textStatus === "success") {
            f++;
            firstPath = includePath[f];
            if (f != (length - 1)) {
                getSc(firstPath, includePath, f);
            }
        }
    });
};

/**
 * @param href
 */
function loadStyles(includePath) {
    $('.style_include').each(function (i) {
        $(this).remove();
    });

    for (i = 0; i < includePath.length; i++) {
        var cssFilePath = includePath[i];

        var exitingStyle = $('head link[href="' + cssFilePath + '"]');
        if (exitingStyle.length > 0) {
            exitingStyle.remove();
        }

        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.classList.add('style_include');
        link.type = "text/css";
        link.href = cssFilePath;
        document.getElementsByTagName("head")[0].appendChild(link);
    }
}

/**
 * @redirectUrl
 * @param redirect_url '/users
 * @param params       '/users/122/884
 */
function redirectUrl(redirect_url) {
    var encoded = redirect_url;
    if (encoded.indexOf("#/") >= 0) {
        encoded = encoded.replace('#/', '');
    }
    $(location).attr('href', baseUrl + '#/' + encoded);

    // if (params) {
    //     var p = params.join('/');
    //     $(location).attr('href', baseUrl + '#/' + encoded + '/' + p);
    // } else {
    //     $(location).attr('href', baseUrl + '#/' + encoded);
    // }
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
 * @param value
 * @return {string}
 */
function numberFormart(value) {
    return value.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "1,");
}

/**
 *
 * @param element
 * @return {*}
 */
function getInputFile(element) {
    return $('#' + element)[0].files[0];
}

/**
 *
 * @param o
 * @return {*}
 */
function shuffleArray(o) {
    for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x) ;
    return o;
}

/**
 * 1 - success
 * 2 - info // passing information
 * 3 - warning // light error
 * 4 - danger //error
 *
 * Show error message or alert massages
 * @param element
 * @param message
 * @param alertType
 */
function showAlert(element, message, alertType) {
    var type;
    switch (alertType) {
        case 1:
            type = 'alert-success';
            break;
        case 2:
            type = 'alert-info';
            break;
        case 3:
            type = 'alert-warning';
            break;
        default :
            type = 'alert-danger';
    }

    var alert = '<div class="alert ' + type + ' alert-dismissible fade in" role="alert">' +
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
        '<span aria-hidden="true">&times;</span>' +
        '</button>' + message + '</div>';
    $('#' + element).html(alert);
    alertTimeout(3000);

    function alertTimeout(wait) {
        setTimeout(function () {
            $('#' + element).children('.alert:first-child').remove();
        }, wait);
    }
}

/**
 * Exit kills functions
 */
function exit() {
    return;
}