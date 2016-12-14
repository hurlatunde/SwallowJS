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
var currentParentLayout = '';
var swallowData = {};
var inner = false;

/**
 *
 */
function layoutUrl(p) {
    var element = p.element;
    var htmlSource = p.htmlSource;
    var renderedHTML = p.renderedHTML;
    var logic = p.logic;
    var res;
    var data = {};
    var parentLayoutSet;

    if (typeof logic === "undefined" || logic === null) {
        logic = false;
    }

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

        parentLayoutSet = parentLayout.trim();
        parentLayout = parentLayoutSet;

        switch (currentParentLayout) {
            case '':
                inner = false;
                break;
            case parentLayoutSet:
                inner = true;
                break;
            default:
                inner = false;
        }

        // logMessage(currentParentLayout);
        // logMessage(inner);

        currentParentLayout = parentLayout;
        parentLayout = "layouts/view/"+parentLayout;

        // pathSting = p.pathSting;
        // pathSting = pathSting.trim().split('/');
        // pathSting = pathSting.pop();
        // pathSting = pathSting.replace('.html','');

        if (inner == true) {
            var newElement = element.selector;
            newElement = newElement.replace('#','');
            newElement = $('#'+isBlank(newElement));
            var rendered = Mustache.render(childLayout, swallowData);
            layoutUrl({element: newElement, htmlSource: rendered, renderedHTML: true});
            return;
        } else {
            data.body = childLayout;
            parseTemplate(swallowJsContainer, parentLayout, data);
            return;
        }
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

function appendElement(container, htmlSource, data) {
    container = $('#' + container);
    var htmlSource = "layouts/elements/" + htmlSource + ".html";

    $.get(htmlSource, function (template) {
        Mustache.escape = function (value) {return value;};
        var rendered = Mustache.render(template, data);
        Mustache.clearCache(template);
        container.append(rendered).hide().show('slow');

    }).error(function (jqXHR, textStatus, errorThrown) {
        if (textStatus == 'error' && errorThrown == 'Not Found') {
            logMessage("Error parsing");
            // data.error_message = "File not found ** " + htmlSource + " **";
            // data.error_layout = htmlSource;
            // data.not_found = false;
        }
    });
}

/**
 *
 * $Data params as to be an object
 */
function parseTemplate(container, htmlSource, data, p) {
    if (typeof data === "undefined" || data === null) {
        data = {};
    }

    var currentPage = getAbsolutePath(false);

    /**
     * Default SwallowJs main page URL
     */
    data.base_url = baseUrl;


    /**
     * Default SwallowJs current page URL
     */

    data.here = baseUrl+window.location.hash;

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

    swallowData = data;
    $.get(htmlSource, function (template) {
        Mustache.escape = function (value) {return value;};
        var rendered = Mustache.render(template, data);
        Mustache.clearCache(template);
        //layoutUrl({element: container, htmlSource: rendered, renderedHTML: true, pathSting: htmlSource});
        layoutUrl({element: container, htmlSource: rendered, renderedHTML: true, logic: p});
    }).error(function (jqXHR, textStatus, errorThrown) {
        if (textStatus == 'error' && errorThrown == 'Not Found') {
            logMessage("Error parsing");
            data.error_message = "File not found ** " + htmlSource + " **";
            data.error_layout = htmlSource;
            data.not_found = false;
            $.get(CONFIG.layoutTemplate('404'), function (template) {
                Mustache.parse(template);
                var rendered = Mustache.render(template, data);
                layoutUrl({element: container, htmlSource: rendered, renderedHTML: true, logic: p});
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
        $.get(CONFIG.layoutTemplate(layout), function (template) {
            if (template.indexOf("---") >= 0) {
                //logMessage('parent');
                parseTemplate(container, CONFIG.layoutTemplate(layout), dataSet, true);
            } else {
                //logMessage('no parent');
                currentParentLayout = '';
                parseTemplate(container, CONFIG.layoutTemplate(layout), dataSet, false);
            }
        });
        // console.log(SwallowParentTemplate);
        // parseTemplate(container, CONFIG.layoutTemplate(layout), dataSet);
    }
}

if (CONFIG.private('loading') == true) {
    layoutUrl({element: swallowJsContainer, htmlSource: CONFIG.layoutTemplate('page_loading')});
}