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
 * @type {{private, viewTemplates, firebaseConfig, constants}}
 */

var CONFIG = (function () {
    var SwallowJs = {
        'main_container': 'swallow',
        'remove_swallow_css': false,
        'beta': true,
        'loading': true,
        'debug': true
    };

    // Templates
    var views = {
        'home':              'views/home.html',
        'about':              'views/about.html',
        'page_loading':      'views/page_loading.html',
        '404':               'views/error/404.html',
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
        viewTemplates: function (name) {
            return views[name];
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
 * Please do not remove line 65. The system needs to work properly
 */
var swallowJsContainer  = CONFIG.private('main_container');

/**
 *
 * @type {any}
 */
var debug = CONFIG.private('debug');


/**
 * Default SwallowJs firebaseConfig
 */
var firebaseConfig = CONFIG.firebaseConfig('firebase_config');

/**
 * Firebase init
 * @Firebase https://firebase.google.com/docs
 * This as to be
 */
var mainApp = firebase.initializeApp(firebaseConfig);