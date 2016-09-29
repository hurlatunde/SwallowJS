if ("undefined" == typeof jQuery)throw new Error("SwallowJS requires jQuery");
/**
 * The main Controller for handling all system required
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
        /**
         * SwallowJs system config (config.js)
         * SwallowJs (utilities)
         */
        $.getScript('/component/js/Config/config.js'),
        $.getScript('/component/js/view/utilities.js'),

        /**
         * @mustache   **https://github.com/janl/mustache.js**
         * @pathjs     **https://github.com/mtrpcic/pathjs**
         */
        $.getScript('/component/js/plugins/mustache/mustache.min.js'),
        $.getScript('/component/js/plugins/path/path.min.js'),

        /**
         * Data Source connection
         * Firebase / Serve side
         * SwallowJs system config (config.js)
         * SwallowJs (utilities)
         */
        $.getScript('/component/js/service/initializeFirebaseConnection.js'),
        $.getScript('/component/js/service/initializeServerSideConnection.js'),

        /**
         * SwallowJs (layout)
         * SwallowJs (routes)
         */
        $.getScript('/component/js/view/layout.js'),
        $.getScript('/component/js/Config/routes.js')
    ).done(function (s) {
        $(initPath);
        logMessage('**** SwallowJs is working perfectly ****');

        /**
         * your javascript codes here
         */





        // save
        // FirebaseModal.saveData({
        //    node: 'see', data: ({been:'sadvwvvvwacqw', been2:'sadvwvvvwacqw'})
        // }, function(data) {
        //     if(!data.error) {
        //         logMessage(data);
        //     } else {
        //         logMessage(data);
        //     }
        // });

        // update
        // FirebaseModal.updateData({
        //    path: 'see/-KSniAXFZJVrFIAg3gli', data: ({been:'s34567654wacqw', been2:'sadv3456765qw'})
        // }, function(data) {
        //     if(!data.error) {
        //         logMessage(data);
        //     } else {
        //         logMessage(data);
        //     }
        // });


        //findOne



        /**
         * your javascript codes here
         */
    });
});