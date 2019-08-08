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
 * @package       routes.js
 * @since         SwallowJs(tm) v 0.2.9
 * @plugin        Navigo: https://github.com/krasimir/navigo
 */

/**
 * Declare parent identifier here
 * @type {any}
 */

let views = {
    'home': 'views/home.html',
    'about': 'views/about.html',
    'page_loading': 'views/page_loading.html',
    '404': 'views/error/404.html',
};


swRouter.on('/', function () {
    // An example of an array
    var data = {
        "full_name": "Olatunde owokoniran",
        "beatles": [
            {"firstName": "John", "lastName": "Lennon"},
            {"firstName": "Paul", "lastName": "McCartney"},
            {"firstName": "George", "lastName": "Harrison"},
            {"firstName": "Ringo", "lastName": "Starr"}
        ],
        "name": function () {
            return this.firstName + " " + this.lastName;
        }
    };

    renderView(
        views.home,
        'default_container',
        data
    );
}).resolve();

swRouter.on('/about', function () {
  console.log('got here');
}).resolve();

// In the case of the default handler and notFound handler the function receives only query as parameter.
swRouter.notFound(function (query) {
    // ...
});

//Wild card is also supported:
swRouter.on('/user/*', function () {
    // This function will be called on every
    // URL that starts with /user
}).resolve();

// swRouter.on('/user/:id/:action', function (params) {
//     // If we have http://site.com/user/42/save as a url then
//     // params.id = 42
//     // params.action = save
// }).resolve();

// swRouter.on('/user/:id/:action', function (params, query) {
//     // If we have http://site.com/user/42/save?answer=42 as a url then
//     // params.id = 42
//     // params.action = save
//     // query = answer=42
// }).resolve();