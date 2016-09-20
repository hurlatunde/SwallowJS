/**
 * SwallowJs(tm) : SwallowJs Framework (http://docs.swallow.js)
 *
 * For full copyright and license information, please see the LICENSE.txt
 *
 * @link          http://docs.swallow.js SwallowJs(tm) Project
 * @package       component.js.Config.routes.js
 * @since         SwallowJs(tm) v 0.2.9
 */

var CONFIG = (function () {
    var SwallowJs = {
        'main_container': 'swallow',
        'loading': true,
        'debug': true
    };

    // Templates
    var layout = {
        'home':                     '/layouts/home.html',
        'page_loading':             '/layouts/elements/page_loading.html',
        '404':                      '/layouts/elements/error/404.html',
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


function logMessage() {
    //if (!debugMode) return;
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