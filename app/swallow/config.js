/**
 * SwallowJs(tm) : SwallowJs Framework (http://docs.swallow.js)
 *
 * For full copyright and license information, please see the LICENSE.txt
 *
 * @link          http://docs.swallow.js SwallowJs(tm) Project
 * @package       config.js
 * @since         SwallowJs(tm) v 0.2.9
 */

let root = null;
let useHash = true; // Defaults to: false
let hash = '#!'; // Defaults to: '#'
let swRouter = new Navigo(root, useHash, hash);

let updateSwLinks = function () {
    swRouter.updatePageLinks();
}