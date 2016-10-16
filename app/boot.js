if ("undefined" == typeof jQuery)throw new Error("SwallowJS requires jQuery");
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

$('<link>')
    .appendTo('head')
    .attr({type: 'text/css', rel: 'stylesheet'})
    .attr('href', '/swallow/utility/css/swallow_inner_loading.css');

$().ready(function () {
    $.when(
        /**
         * SwallowJs (utility/bootstrap)
         * SwallowJs config (config.js)
         * SwallowJs (utility/helper)
         */
        $.getScript('/swallow/utility/helper.js'),
        $.getScript('/swallow/utility/bootstrap.js'),
        $.getScript('/config.js'),

        /**
         * @mustache   **https://github.com/janl/mustache.js**
         * @pathjs     **https://github.com/mtrpcic/pathjs**
         */
        $.getScript('/swallow/plugins/mustache/mustache.min.js'),
        $.getScript('/swallow/plugins/path/path.min.js'),

        /**
         * Data Source connection
         * Firebase / Serve side
         * SwallowJs system config (config.js)
         * SwallowJs (utilities)
         */
        $.getScript('/swallow/service/initializeFirebaseConnection.js'),
        $.getScript('/swallow/service/initializeServerSideConnection.js'),

        /**
         * SwallowJs (layout)
         * SwallowJs (routes)
         */
        $.getScript('/swallow/utility/layout.js'),
        $.getScript('/routes.js')

    ).done(function (s) {
        $(initPath);
        logMessage('**** SwallowJs is working perfectly ****');

        /**
         * your javascript codes here
         */




        // save
        // FirebaseService.saveData({
        //     path: '/posts', data: ({author:"John Deauthor", body: "post body content.", title: "Another post title "})
        // }, function(data) {
        //     if(!data.error) {
        //         logMessage(data);
        //     } else {
        //         logMessage(data);
        //     }
        // });

        // update
        // FirebaseService.updateData({
        //    path: 'see/-KSniAXFZJVrFIAg3gli', data: ({been:'s34567654wacqw', been2:'sadv3456765qw'})
        // }, function(data) {
        //     if(!data.error) {
        //         logMessage(data);
        //     } else {
        //         logMessage(data);
        //     }
        // });

        // findOne
        // FirebaseService.findOne({
        //     path: 'posts/post_one'
        // }, function(data) {
        //     if(!data.error) {
        //         logMessage(data);
        //     } else {
        //         logMessage(data);
        //     }
        // });


        // FirebaseService.findAll({
        //    path: 'posts'
        // }, function(data) {
        //     if(!data.error) {
        //         logMessage(data);
        //     } else {
        //         logMessage(data);
        //     }
        // });


        /**
         * your javascript codes here
         */
    });
});