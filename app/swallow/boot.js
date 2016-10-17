/**
 * The main Controller for handling all system required
 * SwallowJs(tm) : SwallowJs Framework (http://docs.swallow.js)
 *
 * For full copyright and license information, please see the LICENSE.txt
 *
 * @link          http://docs.swallow.js SwallowJs(tm) Project
 * @package       swallow.boot.js
 * @since         SwallowJs(tm) v 0.2.9
 */

if ("undefined" == typeof jQuery)
    throw new Error("SwallowJS requires jQuery");

$().ready(function () {

    $('<link>')
        .appendTo('head')
        .attr({type: 'text/css', rel: 'stylesheet'})
        .attr('href', '/swallow/utility/css/swallowjs.css');

    var includePath = [
        'swallow/utility/helper.js',
        'swallow/utility/bootstrap.js',
        '/config.js',
        'swallow/plugins/mustache/mustache.min.js',
        'swallow/plugins/path/path.min.js',
        'swallow/service/initializeFirebaseConnection.js',
        'swallow/service/initializeServerSideConnection.js',
        'swallow/utility/layout.js',
        '/routes.js'
    ];

    var loadScript = function (includePath){
        var f = 0;
        var firstPath = includePath[f];

        var getSc = function (firstPath){
            $.getScript(firstPath, function( data, textStatus, jqxhr ) {
                if (textStatus === "success") {
                    f++;
                    firstPath = includePath[f];
                    getSc(firstPath);
                }

                if (f == (includePath.length)) {
                    $(initPath);
                    logMessage('**** SwallowJs is working perfectly ****');
                }
            });
        };
        getSc(firstPath);
    };
    loadScript(includePath);
});