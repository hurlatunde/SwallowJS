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
         * @mustache   **https://github.com/janl/mustache.js/**
         * @pathjs     **https://github.com/mtrpcic/pathjs**
         */
        $.getScript('/component/js/plugins/mustache/mustache.min.js'),
        $.getScript('/component/js/plugins/path/path.min.js'),

        /**
         * SwallowJs (layout)
         * SwallowJs (routes)
         */
        $.getScript('/component/js/view/layout.js'),
        $.getScript('/component/js/Config/routes.js')
    ).done(function (d) {
        logMessage('**** SwallowJs is working perfectly ****');

        /**
         * your javascript codes here
         */
    });
});