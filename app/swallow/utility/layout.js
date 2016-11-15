/**
 * SwallowJs(tm) : SwallowJs Framework (http://docs.swallow.js)
 *
 * For full copyright and license information, please see the LICENSE.txt
 *
 * @link          http://docs.swallow.js SwallowJs(tm) Project
 * @package       component.utility.view.layout.js
 * @since         SwallowJs(tm) v 0.2.9
 */

var baseUrl = getAbsolutePath();

/**
 *
 */
function layoutUrl(p) {
    var element = p.element;
    var htmlSource = p.htmlSource;
    var renderedHTML = p.renderedHTML;
    var res;
    var data = {};
    //var pathSting;

    if (htmlSource.indexOf("---") >= 0) {
        res = htmlSource.split("---");
        res = cleanArray(res);
        var childLayout = res.pop();

        var parentLayout;
        for (i = 0; i < res.length; i++) {
            var str = res[i].trim();
            if (str.indexOf("view:") >= 0) {
                parentLayout = str.replace('view:','');
                break;
            } else {
                logMessage("Error parsing parent layout. please add view");
                break;
            }
        }

        parentLayout = parentLayout.trim();
        parentLayout = "layouts/view/"+parentLayout;

        // pathSting = p.pathSting;
        // pathSting = pathSting.trim().split('/');
        // pathSting = pathSting.pop();
        // pathSting = pathSting.replace('.html','');

        data.body = childLayout;
        parseTemplate(element, parentLayout, data);
        return;
    }

    if (typeof renderedHTML !== "undefined" || renderedHTML == true) {
        element.html(htmlSource);
    } else {
        if (htmlSource) {
            element.load(baseUrl+htmlSource);
        } else {
            element.load(CONFIG.layoutTemplate('404'));
        }
    }
}

/**
 * @firstParams    layout name defined in config.js
 * @secondParams   parent container
 * @thirdParams    (Optional) "Data"- data to be sent to the layout
 */
function includeElement(container, htmlSource, data) {
    container = $('#' + container);
    parseTemplate(container, "layouts/elements/" + htmlSource + ".html", data);
}

/**
 *
 * $Data params as to be an object
 */
function parseTemplate(container, htmlSource, data) {
    if (typeof data === "undefined" || data === null) {
        data = {};
    }

    var currentPage = getAbsolutePath(false);

    /**
     * Default SwallowJs main page URL
     */
    data.base_url = baseUrl;

    /**
     * Default SwallowJs absolute Path
     * getting current page
     */
    data.current_page = currentPage;

    /**
     *
     * @type {any}
     */
    data.app_version = swallowVersion;

    if (currentPage == "/"){
        data.home = true;
    }

    if (currentPage != "/"){
        data[currentPage] = true;
    }

    // check if data is an object or just trow an error
    // if(CONFIG.layoutTemplate(layout) == undefined){
    //     data.error_message = "No layout with "+layout+".html defined in config.js";
    //     data.error_layout = layout;
    //     $.get(CONFIG.layoutTemplate('404'), function (template) {
    //         var rendered = Mustache.render(template, data);
    //         layoutUrl({element: container, htmlSource: rendered, renderedHTML: true});
    //     });
    //     return
    // }

    $.get(htmlSource, function (template) {
        Mustache.escape = function (value) {return value;};
        var rendered = Mustache.render(template, data);
        Mustache.clearCache(template);
        layoutUrl({element: container, htmlSource: rendered, renderedHTML: true, pathSting: htmlSource});
    }).error(function (jqXHR, textStatus, errorThrown) {
        if (textStatus == 'error' && errorThrown == 'Not Found') {
            logMessage("Error parsing");
            data.error_message = "File not found ** " + htmlSource + " **";
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
 * @firstParams    layout name defined in config.js
 * @secondParams   parent container
 * @thirdParams    (Optional) "Data"- data to be sent to the layout
 */
function renderLayout(layout, container, dataSet) {
    if (typeof dataSet === "undefined" || dataSet === null) {
        dataSet = {};
    }

    if (CONFIG.layoutTemplate(layout) == undefined) {
        dataSet.error_message = "No layout with " + layout + ".html declared in config.js";
        dataSet.error_layout = layout;
        dataSet.not_found = true;

        $.get(CONFIG.layoutTemplate('404'), function (template) {
            var rendered = Mustache.render(template, dataSet);
            layoutUrl({element: container, htmlSource: rendered, renderedHTML: true});
        });
    } else {
        parseTemplate(container, CONFIG.layoutTemplate(layout), dataSet);
    }
}

if (CONFIG.private('loading') == true) {
    layoutUrl({element: swallowJsContainer, htmlSource: CONFIG.layoutTemplate('page_loading')});
}