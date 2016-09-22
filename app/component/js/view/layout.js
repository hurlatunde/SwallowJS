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

    if (renderedHTML == true) {
        element.html(htmlSource);
    } else {
        if (htmlSource) {
            element.load(htmlSource);
        } else {
            element.load(CONFIG.layoutTemplate('404'));
        }
    }
}

/**
 *
 * $Data params as to be an object
 */
function parseTemplate(container, htmlSource, data) {

    if (data == undefined)
        data = {};

    // data.swallow_version = swallowVersion;
    // data.current = currentPathPage;
    // data.base_url = baseUrl;

    // check if data is an object or just trow an error
    // if(CONFIG.layoutTemplate(layout) == undefined){
    //     data.error_message = "No layout with "+layout+".html defined in js/Config/config.js";
    //     data.error_layout = layout;
    //     $.get(CONFIG.layoutTemplate('404'), function (template) {
    //         var rendered = Mustache.render(template, data);
    //         layoutUrl({element: container, htmlSource: rendered, renderedHTML: true});
    //     });
    //     return
    // }

    $.get(htmlSource, function (template) {
        var rendered = Mustache.render(template, data);
        layoutUrl({element: container, htmlSource: rendered, renderedHTML: true});
    }).error(function (jqXHR, textStatus, errorThrown) {
        if (textStatus == 'error' && errorThrown == 'Not Found') {
            logMessage("Error parsing");
            data.error_message = "File not found ** /layouts/" + htmlSource + " **";
            data.error_layout = htmlSource;
            data.not_found = false;
            $.get(CONFIG.layoutTemplate('404'), function (template) {
                Mustache.parse(template);
                var rendered = Mustache.render(template, data);
                layoutUrl({element: container, htmlSource: rendered, renderedHTML: true});
            });
        }
    });
}

/**
 * @firstParams    layout name defined in js/Config/config.js
 * @secondParams   parent container
 * @thirdParams    (Optional) "Data"- data to be sent to the layout
 */
function renderLayout(layout, container, data) {
    if (data == undefined)
        data = {};

    if (CONFIG.layoutTemplate(layout) == undefined) {
        data.error_message = "No layout with " + layout + ".html defined in js/Config/config.js";
        data.error_layout = layout;
        $.get(CONFIG.layoutTemplate('404'), function (template) {
            Mustache.parse(template);
            var rendered = Mustache.render(template, data);
            layoutUrl({element: container, htmlSource: rendered, renderedHTML: true});
        });
    }

    parseTemplate(container, CONFIG.layoutTemplate(layout));
}


/**
 * @firstParams    layout name defined in js/Config/config.js
 * @secondParams   parent container
 * @thirdParams    (Optional) "Data"- data to be sent to the layout
 */
function includeElement(container, htmlSource, data) {
    container = $('#' + container);
    parseTemplate(container, "elements/" + htmlSource + ".html", data);
}

if (CONFIG.private('loading') == true) {
    layoutUrl({element: swallowJsContainer, htmlSource: CONFIG.layoutTemplate('page_loading')});
}