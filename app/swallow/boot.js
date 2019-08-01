/**
 * The main Controller for handling all system required
 * SwallowJs(tm) : SwallowJs Framework (http://docs.swallow.js)
 *
 * For full copyright and license information, please see the LICENSE.txt
 *
 * @link          http://docs.swallow.js SwallowJs(tm) Project
 * @link          https://api.jquery.com/jquery.getscript/
 * @package       swallow.boot.js
 * @since         SwallowJs(tm) v 0.2.9
 */

if ("undefined" == typeof jQuery)
    throw new Error("SwallowJS requires jQuery");

$().ready(function () {

    $('<link>')
        .appendTo('head')
        .attr({type: 'text/css', rel: 'stylesheet', class: 'swallow_stylesheet'})
        .attr('href', 'swallow/utility/css/swallowjs.css');

    var includePath = [
        'swallow/utility/helper.js',
        'swallow/plugins/handlebars/handlebars.js',
        'swallow/plugins/navigo/navigo.js',
        'swallow/plugins/Firebase/firebase.js',
        'swallow/plugins/Firebase/firebase-firestore.js',
        'swallow/utility/bootstrap.js',
        'swallow/config.js',
        'config.js',
        'swallow/service/initializeFirebaseConnection.js',
        'swallow/plugins/Rx.js',
        'swallow/plugins/redux.min.js',
        'swallow/plugins/es6-promise.auto.js',
        'swallow/utility/layout.js',
        'broadcast.js',
        'routes.js'
    ];

    let loadScript = function (includePath){
        let f = 0;
        let fPath = includePath[f];

        let getSc = function (fPath){
            $.getScript(fPath, function( data, textStatus, jqxhr ) {
                if (f === (includePath.length -1)) {
                    //$(initPath);
                    logMessage('**** SwallowJs is working perfectly ****');
                } else if (textStatus === "success") {
                    f++;
                    getSc(includePath[f]);
                }
            });
        };
        getSc(fPath);
    };
    loadScript(includePath);
});