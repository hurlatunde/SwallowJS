/**
 * SwallowJs(tm) : SwallowJs Framework (http://docs.swallow.js)
 *
 * For full copyright and license information, please see the LICENSE.txt
 *
 * @link          http://docs.swallow.js SwallowJs(tm) Project
 * @package       component.js.Config.routes.js
 * @since         SwallowJs(tm) v 0.2.9
 */

/**
 * !Warning ## Most not be a string and most not contain [space] ##
 * @type {{private, layoutTemplate, firebaseConfig, constants}}
 */

var CONFIG = (function () {
    var SwallowJs = {
        'main_container': 'swallow',
        'app_version': 'v0.2.9',
        'beta': true,
        'loading': true,
        'debug': true
    };

    // Templates
    var layout = {
        'home':              '/layouts/home.html',
        'page_loading':      '/layouts/page_loading.html',
        '404':               '/layouts/error/404.html',
        'eeeee':   '/layouts/eeeee.html',
    };

    var constants = {
        // define constants here
        'true': '1',
    };

    var firebase_config = {
        apiKey: 'APP-API-KEY',
        authDomain: 'APP-AUTH-DOMAIN',
        databaseURL: 'APP-DATABASE-URL',
        storageBucket: 'APP-STORAGE-BUCKET'
    };

    return {
        private: function (name) {
            return SwallowJs[name];
        },
        layoutTemplate: function (name) {
            return layout[name];
        },
        firebaseConfig: function () {
            return firebase_config;
        },
        constants: function () {
            return constants[name];
        }
    };
})();

/**
 * Default SwallowJs main container
 */
var swallowJsContainer = $('#' + CONFIG.private('main_container'));

/**
 *
 * @type {any}
 */
var swallowVersion = CONFIG.private('app_version');
var debug = CONFIG.private('debug');

/**
 * Default SwallowJs main page URL
 */
var baseUrl = getAbsolutePath();

/**
 * Default SwallowJs absolute Path
 * getting current page
 */
var currentPathPage = getAbsolutePath(false);

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
 * @param formData
 * @returns {Array of Objects}
 */
function formToArray(formData) {
    var dataArray;
    dataArray = {};
    for (var i in formData) {
        dataArray[formData[i].name.trim()] = formData[i].value.trim();
    }
    return dataArray;
}