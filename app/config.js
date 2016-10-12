/**
 * SwallowJs(tm) : SwallowJs Framework (http://docs.swallow.js)
 *
 * For full copyright and license information, please see the LICENSE.txt
 *
 * @link          http://docs.swallow.js SwallowJs(tm) Project
 * @package       config.js
 * @since         SwallowJs(tm) v 0.2.9
 */

/**
 * !Warning ## Most not be a string and most not contain [space] ##
 * @type {{private, layoutTemplate, firebaseConfig, constants}}
 */

var CONFIG = (function () {
    var SwallowJs = {
        'main_container': 'swallow',
        'beta': true,
        'loading': true,
        'debug': true
    };

    // Templates
    var layout = {
        'home':              '/layouts/home.html',
        'page_loading':      '/layouts/page_loading.html',
        '404':               '/layouts/error/404.html',
    };

    var constants = {
        // define constants here
        'true': '1',
    };

    var firebase_config = {
        apiKey: 'APP-API-KEY',
        authDomain: 'APP-AUTH-DOMAIN',
        databaseURL: 'APP-DATABASE-URL',
        storageBucket: 'APP-STORAGE-BUCKET',
        messagingSenderId: 'APP-MESSAGE-SENDER-ID'
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
        constants: function (name) {
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
var debug = CONFIG.private('debug');


/**
 * Default SwallowJs firebaseConfig
 */
var firebaseConfig = CONFIG.firebaseConfig('firebase_config')

