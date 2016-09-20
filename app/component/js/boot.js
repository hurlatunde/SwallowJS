/**
 * The main Controller for handling required
 * SwallowJs(tm) : SwallowJs Framework (http://docs.swallow.js)
 *
 * For full copyright and license information, please see the LICENSE.txt
 *
 * @link          http://docs.swallow.js SwallowJs(tm) Project
 * @package       component.js.boot.js
 * @since         SwallowJs(tm) v 0.2.9
 */

$().ready(function () {
    $.when(
        $.getScript('/component/js/Config/config.js'),
        $.getScript('/component/js/plugins/mustache/mustache.min.js'),
        $.getScript('/component/js/plugins/path/path.min.js'),
        $.getScript('/component/js/view/layout.js'),
        $.getScript('/component/js/Config/routes.js')
        // $.Deferred(function( deferred ){
        //     $( deferred.resolve );
        // })
    ).done(function(data){
        logMessage('SwallowJs is working perfectly');
    });
});