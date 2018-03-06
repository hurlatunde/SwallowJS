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
var swallowParentData = {};
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

        if (res.length >= 2) {
            var childLayout = res.pop();
        } else {
            // nothing in view
            var childLayout = '';
        }

        var parentLayout;
        for (i = 0; i < res.length; i++) {
            var str = res[i].trim();
            var pLayout;
            if (str.indexOf("layout:") >= 0) {
                pLayout = $.trim(str.replace('layout:', ''));
                if (str.indexOf("title:") >= 0) {
                    var arr = pLayout.split('title:');
                    pLayout = $.trim(arr['0']);
                    var rendered = compileView(arr['1'], swallowData);
                    setPageTitle($.trim(rendered));
                }
                // set parent layout
                parentLayout = pLayout;
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
        parentLayout = "views/layouts/" + parentLayout;

        // pathSting = p.pathSting;
        // pathSting = pathSting.trim().split('/');
        // pathSting = pathSting.pop();
        // pathSting = pathSting.replace('.html','');

        if (inner === true) {
            var newElement;
            newElement = $('#' + isBlank(element));
            var rendered = compileView(childLayout, swallowData, true);
            layoutUrl({element: newElement, htmlSource: rendered, renderedHTML: true});
            return;
        } else {
            logMessage('got here');
            //logMessage(childLayout);
            //return;
            data.body = childLayout;
            data.opt = true;
            parseTemplate(swallowJsContainer, parentLayout, data);
            return;
        }
    // } else {
    //     logMessage('ddddd');
    //     data.body = childLayout;
    //     data.opt = true;
    //     parseTemplate(swallowJsContainer, parentLayout, data);
    //     // return;
    }

    var blankElement = $('#'+element);
    if (typeof renderedHTML !== "undefined" || renderedHTML == true) {
        blankElement.html(htmlSource);
    } else {
        if (htmlSource) {
            blankElement.load(baseUrl + htmlSource);
        } else {
            blankElement.load(CONFIG.viewTemplates('404'));
        }
    }
}

/**
 * @firstParams    layout name defined in config.js
 * @secondParams   parent container
 * @thirdParams    (Optional) "Data"- data to be sent to the layout
 */
function includeElement(container, htmlSource, data) {
    //container = $('#' + container);
    parseTemplate(container, "views/elements/" + htmlSource + ".html", data);
}

/**
 *
 * @param container
 * @param htmlSource
 * @param data
 */
function appendElement(container, htmlSource, data) {
    //container = $('#' + container);
    var htmlSource = "views/elements/" + htmlSource + ".html";

    $.get(htmlSource, function (template) {
        // Mustache.clearCache(template);
        // Mustache.escape = function (value) {return value;};
        var rendered = compileView(template, data);
        container.append(rendered);

    }).fail(function (jqXHR, textStatus, errorThrown) {
        if (textStatus == 'error' && errorThrown == 'Not Found') {
            logMessage("Error parsing");
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

    /**
     * Default SwallowJs absolute Path
     * getting current page
     */
    var currentPage = getAbsolutePath(false);

    /**
     * Default SwallowJs main page URL
     */
    data.base_url = baseUrl;


    /**
     * Default SwallowJs current page URL
     */

    data.here = baseUrl + window.location.hash;

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

    if (currentPage == "/") {
        data.home = true;
    }

    if (currentPage != "/") {
        data[currentPage] = true;
    }

    swallowData = data;
    $.get(htmlSource, function (template) {
        // Mustache.escape = function (value) {return value;};
        var rendered = compileView(template, data);

        if (data.opt !== null && data.opt == true) {
            //console.log('hreeeee');
        }
        layoutUrl({element: container, htmlSource: rendered, renderedHTML: true, logic: p});

    }).fail(function (jqXHR, textStatus, errorThrown) {
        if (textStatus == 'error' && errorThrown == 'Not Found') {
            logMessage("Error parsing");
            data.error_message = "File not found ** " + htmlSource + " **";
            data.error_layout = htmlSource;
            data.not_found = false;
            $.get(CONFIG.viewTemplates('404'), function (template) {
                //Mustache.parse(template);
                var rendered = compileView(template, data);
                layoutUrl({element: container, htmlSource: rendered, renderedHTML: true, logic: p});
            });
        }
    });
}

/**
 * @firstParams    View name defined in config.js
 * @secondParams   parent container
 * @thirdParams    (Optional) "Data"- data to be sent to the layout
 */
function renderView(layout, container, dataSet) {
    if (typeof dataSet === "undefined" || dataSet === null) {
        dataSet = {};
    }

    setPageTitle(layout);

    if (CONFIG.viewTemplates(layout) == undefined) {
        dataSet.error_message = "No view with " + layout + ".html declared in config.js";
        dataSet.error_layout = layout;
        dataSet.not_found = true;

        $.get(CONFIG.viewTemplates('404'), function (template) {
            currentParentLayout = '';
            var rendered = compileView(template, dataSet);
            layoutUrl({element: swallowJsContainer, htmlSource: rendered, renderedHTML: true});
        });
    } else {
        $.get(CONFIG.viewTemplates(layout), function (template) {

            if (template.indexOf("---") >= 0) {
                //logMessage('parent');
                parseTemplate(container, CONFIG.viewTemplates(layout), dataSet, true);
            } else {
                //logMessage('no parent');
                currentParentLayout = '';
                parseTemplate(container, CONFIG.viewTemplates(layout), dataSet, false);
            }
        });
        // console.log(SwallowParentTemplate);
        // parseTemplate(container, CONFIG.viewTemplates(layout), dataSet);
    }
}

if (CONFIG.private('loading') == true) {
    layoutUrl({element: swallowJsContainer, htmlSource: CONFIG.viewTemplates('page_loading')});
}

if (CONFIG.private('remove_swallow_css') == true) {
    var removeSwallowCss = CONFIG.private('remove_swallow_css');
    $('.swallow_stylesheet').each(function (i) {
        $(this).remove();
    });
}

/**
 * SwallowJS Interpolator
 * @param template
 * @param data
 * @return {*}
 */
function compileView(tempD, data, int) {

    /**
     * if_eq
     */
    Handlebars.registerHelper('if_eq', function (a, b, opts) {
        if (a == b) {
            return opts.fn(this);
        } else {
            return opts.inverse(this);
        }
    });

    var template = Handlebars.compile(tempD, {noEscape: true});
    return template(data);
}