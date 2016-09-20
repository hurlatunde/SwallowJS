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
        $.getScript('/component/config.js'),
        // $.getScript('/component/services.js'),
        // $.getScript('/assets/js/plugins/mustache/mustache.min.js'),
        // $.getScript('/assets/js/plugins/path/path.min.js'),
        // $.getScript('/assets/js/vendor/bootstrap.min.js'),
        // $.getScript('/component/layout.js'),
        $.getScript('/component/Config/routes.js')
        //$.getScript('/component/providers.js')
        // $.Deferred(function( deferred ){
        //     $( deferred.resolve );
        // })
    ).done(function(data){

    });
});