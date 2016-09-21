/**
 * SwallowJs(tm) : SwallowJs Framework (http://docs.swallow.js)
 *
 * For full copyright and license information, please see the LICENSE.txt
 *
 * @link          http://docs.swallow.js SwallowJs(tm) Project
 * @package       component.js.view.layout.js
 * @since         SwallowJs(tm) v 0.2.9
 */

/**
 *
 */
function layoutUrl(p) {
    var element = p.element;
    var htmlSource = p.htmlSource;
    var renderedHTML = p.renderedHTML;

    // var request = $.get(htmlSource);
    // request.error(function(jqXHR, textStatus, errorThrown) {
    //     // if (textStatus == 'timeout')
    //     //     console.log('The server is not responding');
    //
    //     logMessage(textStatus);
    //     logMessage(errorThrown);
    //
    //     if (textStatus == 'error')
    //         //renderLayout(layout, container, data)
    //         console.log(errorThrown);
    //         console.log(jqXHR);
    // });

    if (renderedHTML == true) {
        element.html(htmlSource);
    } else {
        if (htmlSource) {
            element.load(htmlSource);
        } else {
            element.load(CONFIG.layoutTemplate('404'));
            logMessage('Error loading template');
        }
    }
}

/**
 *
 */
function includeElement(element, htmlSource) {
    $('#'+element).load('/layouts/elements/'+htmlSource+'.html');
}

/**
 *
 */
function renderLayout(layout, container, data) {
    if (data == undefined) {
        data = {};
    }

    if(CONFIG.layoutTemplate(layout) == undefined){
        data.error_message = "No layout with "+layout+".html defined in js/Config/config.js";
        data.error_layout = layout;
        $.get(CONFIG.layoutTemplate('404'), function (template) {
            var rendered = Mustache.render(template, data);
            layoutUrl({element: container, htmlSource: rendered, renderedHTML: true});
        });
        return
    }

    $.get(CONFIG.layoutTemplate(layout), function (template) {
        var rendered = Mustache.render(template, data);
        layoutUrl({element: container, htmlSource: rendered, renderedHTML: true});
    });
}

if (CONFIG.private('loading') == true) {
    layoutUrl({element: swallowJsContainer, htmlSource: CONFIG.layoutTemplate('page_loading')});
}