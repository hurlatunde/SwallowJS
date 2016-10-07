/**
 * SwallowJs(tm) : SwallowJs Framework (http://docs.swallow.js)
 *
 * For full copyright and license information, please see the LICENSE.txt
 *
 * @link          http://docs.swallow.js SwallowJs(tm) Project
 * @package       component.js.view.utilities.js
 * @since         SwallowJs(tm) v 0.2.9
 */

function swallowInnerLoading(parentElement, params) {
    $('<link>')
        .appendTo('head')
        .attr({type : 'text/css', rel : 'stylesheet'})
        .attr('href', '/component/css/swallow_inner_loading.css');
    if (params == true) {
        $(parentElement).append('' +
            '<div class="md-modal md-modal-mini md-effect-11 inner_loading md-show" id="modal-11">' +
            '<div class="md-content"> ' +
            '<div id="spinner-holder "> ' +
            '<div> ' +
            '<div class="spinner"> ' +
            '<div class="bounce1"></div> ' +
            '<div class="bounce2"></div> ' +
            '<div class="bounce3"></div> ' +
            '</div> ' +
            '</div>' +
            '<div class="text-center"> ' +
            '<p id="loading_word"> Loading... </p> ' +
            '</div> ' +
            '</div> ' +
            '</div> ' +
            '</div>'
        );
    } else {
        $(parentElement).append('');
    }
}


/**
 * @redirectUrl
 * @param redirect_url '/users
 * @param params       '/users/122/884
 */
function redirectUrl(redirect_url, params) {
    var encoded = encodeURIComponent(redirect_url.toLowerCase());
    if (params) {
        var params = params.join('/');
        $(location).attr('href', baseUrl + '#/' + encoded + '/' + params);
    } else {
        $(location).attr('href', baseUrl + '#/' + encoded);
    }
}


/**
 *
 * @param formData element
 * @returns {Array of Objects}
 */
function formToArray(element) {
    var formData = $("#"+element).serializeArray();
    var dataArray;
    dataArray = {};
    for (var i in formData) {
        dataArray[formData[i].name.trim()] = formData[i].value.trim();
    }
    return dataArray;
}

/**
 *
 * @param value
 * @return {string|*}
 */
function isBlank(value) {
    return $.trim(value);
}