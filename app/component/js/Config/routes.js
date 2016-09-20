/**
 * Required -- path.js 'Path={version:"0.8.4"}'
 * @pathLink   https://github.com/mtrpcic/pathjs
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
    layoutUrl({element: swallowJsContainer, htmlSource: CONFIG.layoutTemplate('home')});
}).enter(clearPanel);


function notFound() {
    layoutUrl({element: swallowJsContainer, htmlSource: CONFIG.layoutTemplate('404')});
}









/**
 * clearPanel (You can put some code in here to do fancy DOM transitions, such as fade-out or slide-in.)
 */
function clearPanel() {
    // You can put some code in here to do fancy DOM transitions, such as fade-out or slide-in.
}

/**
 * listen (Always as to be at the bottom ot this page)
 */
Path.listen();