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
 * Default SwallowJs variables
 */
var mainContainer;

var CONFIG = (function () {
    var SwallowJs = {
        'swallow_container': 'swallow',
        'inner_loading': 'modal-11',
        'inner_loading_text': 'loading_word',
        'loading': true,
        'debug': true
    };

    // Templates
    var templates = {
        'home':             '/templates/landing.html',
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
        SwallowJs: function (name) {
            return SwallowJs[name];
        },
        layoutTemplate: function (name) {
            return templates[name];
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
mainContainer = $('#' + CONFIG.SwallowJs('swallow_container'));
