/**
 * Required -- path.js 'Path={version:"0.8.4"}'
 * Routes configuration
 *
 * In this file, you set up routes to your controllers and their actions.
 * different URLs.
 *
 * SwallowJs(tm) : SwallowJs Framework (http://docs.swallow.js)
 *
 * For full copyright and license information, please see the LICENSE.txt
 *
 * @link          http://docs.swallow.js SwallowJs(tm) Project
 * @package       component.js.Config.routes.js
 * @since         SwallowJs(tm) v 0.2.9
 */

Path.rescue(notFound);
Path.root("#/");

/**
 * index.html
 * landing page. (This is the first page you see)
 */
Path.map("#/").to(function () {
    templateUrl(mainContainer, CONFIG.layouts('home'));
}).enter(clearPanel);