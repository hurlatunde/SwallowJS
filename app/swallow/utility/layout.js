/**
 * SwallowJs(tm) : SwallowJs Framework (http://docs.swallow.js)
 *
 * For full copyright and license information, please see the LICENSE.txt
 *
 * @link          http://docs.swallow.js SwallowJs(tm) Project
 * @package       component.utility.view.layout.js
 * @since         SwallowJs(tm) v 0.2.9
 */

let baseUrl = swHelper.getAbsolutePath();
let currentParentLayout = '';
let swallowData = {};
let swallowParentData = {};
let inner = false;
let layoutKeyLength = 12;
let nodeId;
let swallowJsElement = swallowJsContainer;

let swLayout = (function () {
    let self = this;
    let layoutInterface = {
        '404': '/views/error/404.html',
    };

    let layoutNodeId;

    function getContentFromPath(htmlSource, node_id, callBack) {
        try {
            $.get(htmlSource, function (template) {
                // if (data.opt !== null && data.opt == true) {
                //     //console.log('hreeeee');
                // }
                return callBack([template, node_id]);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                if (textStatus === 'error' && errorThrown === 'Not Found') {
                    $.get(swLayout.error404, function (template) {
                        let rendered = compileView(template, {
                            'error_message': "File not found (<strong>" + htmlSource + "</strong>). Please check and try again",
                            'error_layout': htmlSource,
                            'not_found': false,
                        });
                        layoutUrl({
                            element: swallowJsElement,
                            htmlSource: rendered,
                            renderedHTML: true,
                            logic: true
                        });
                    });
                }
            });
        } catch (e) {
            console.log(e);

        }
    }

    function randomString(len, charSet) {
        charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomString = '';
        for (let i = 0; i < len; i++) {
            let randomPoz = Math.floor(Math.random() * charSet.length);
            randomString += charSet.substring(randomPoz, randomPoz + 1);
        }
        return randomString;
    }

    function outPut(renderedHTML, htmlSource, element, nodeId, callback) {
        let blankElement = $('#' + element);
        blankElement.attr('data-swNode', nodeId);
        if (typeof renderedHTML !== "undefined" || renderedHTML === true) {
            blankElement.html(htmlSource);
        } else {
            if (!swHelper.empty(htmlSource)) {
                blankElement.load(baseUrl + htmlSource);
            } else {
                blankElement.load(layoutInterface['404']);
            }
        }

        updateSwLinks();
        return callback(nodeId)
    }

    /**
     * SwallowJS Interpolator
     * @param template
     * @param data
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

    function tempInterpolator(template, nodeId, view = false) {

        //check for scripts included ~ loadScripts
        if (template.indexOf("loadScripts") >= 0) {
            let regex = /(?=loadScripts\(\[)(.|(\s|\S))*?(?=\]\))/gm; // check for loaded loadScripts
            let regExp = regex.exec(template);
            if (!swHelper.empty(regExp[0])) {
                let regExpString = regExp[0];
                let viewType = (view) ? `._js?_=${nodeId}_parentLayout` : `._js?_=${nodeId}`;
                let regExpStringReplaced = regExpString.replace(/\.js/g, viewType);
                return template.replace(regExpString, regExpStringReplaced);
            } else {
                return template;
            }
        }

    }

    return {
        viewTemplates: function (view) {
            return layoutInterface[view];
        },
        outPutView: function (renderedHTML, htmlSource, element, node_id, callback) {
            return outPut(renderedHTML, htmlSource, element, node_id, function (node) {
                return callback(node)
            })
        },
        getContent: function (htmlSource, node_id, callback) {
            return getContentFromPath(htmlSource, node_id, function (data) {
                return callback(data);
            });
        },
        generateNode: function (length) {
            return randomString(length)
        },
        compile: function (template, data) {
            return compileView(template, data);
        },
        templateInterpolator: function (template, nodeId, view) {
            return tempInterpolator(template, nodeId, view);
        },
        error404: layoutInterface['404']
    }
})();


function layoutUrl(p, callback) {

    let element = p.element;
    let htmlSource = p.htmlSource;
    let renderedHTML = p.renderedHTML;
    let logic = p.logic;
    let res;
    let data = {};
    let parentLayoutSet;

    if (typeof logic === "undefined" || logic === null) {
        logic = false;
    }

    if (htmlSource.indexOf("---") >= 0) {
        res = htmlSource.split("---");
        res = swHelper.cleanArray(res);

        let parentLayout;
        let childLayout = (res.length >= 2) ? res.pop() : "";
        // if (res.length >= 2) {
        //     childLayout = res.pop();
        // }

        for (let i = 0; i < res.length; i++) {
            let str = res[i].trim();
            let pLayout;
            if (str.indexOf("layout:") >= 0) {
                pLayout = $.trim(str.replace('layout:', ''));
                if (str.indexOf("title:") >= 0) {
                    let arr = pLayout.split('title:');
                    pLayout = $.trim(arr['0']);
                    let rendered = swLayout.compile(arr['1'], swallowData);
                    setPageTitle($.trim(rendered));
                }
                // set parent layout
                parentLayout = pLayout;
                break;
            } else {
                error.throwError("Error parsing parent layout. please add view");
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
            swallowData.swNode = p.generatedNode;

            layoutUrl({
                generatedNode: swallowData.swNode,
                element: $.trim(element),
                parentInt: element,
                htmlSource: swLayout.compile(childLayout, swallowData, true),
                renderedHTML: true
            });
            return;
        } else {
            data.body = childLayout;
            data.swNode = swLayout.generateNode(layoutKeyLength);
            data.parentInt = element;
            data.opt = true;

            swLayout.getContent(parentLayout, data.swNode, function (response) {
                let content = response[0];
                let node_id = p.generatedNode;

                if (content.indexOf(element) >= 0) {
                    let re = new RegExp('(?=' + element + ').*?(?=<)');
                    let regExp = content.match(re);
                    if (!swHelper.empty(regExp[0])) {
                        let ex = regExp[0];
                        let exString = ex.replace('>', ` data-swNode='${p.generatedNode}'> {{body}}`);
                        content = swLayout.templateInterpolator(content.replace(ex, exString), data.swNode, true);
                        layoutUrl({
                            generatedNode: data.swNode,
                            element: element,
                            element: swallowJsElement,
                            htmlSource: swLayout.compile(content, data),
                            renderedHTML: true
                        });
                    } else {
                        error.throwError(' (' + element + ') could not be found');
                    }
                } else {
                    error.throwError(' (' + element + ') could not be found in the ~' + parentLayout + '.');
                }
            });
            return;
        }

        // } else {
        //     logMessage('ddddd');
        //     data.body = childLayout;
        //     data.opt = true;
        //     parseTemplate(swallowJsContainer, parentLayout, data);
        //     // return;

    }

    swLayout.outPutView(renderedHTML, htmlSource, element, p.generatedNode, function (node) {
        if (typeof callback == "function")
            callback(node)
    });
}


/**
 * @firstParams    layout name defined in config.js
 * @secondParams   parent container
 * @thirdParams    (Optional) "Data"- data to be sent to the layout
 */
function includeElement(container, htmlSource, data = []) {
    let filePath = `/views/elements/${htmlSource}.html`;
    let elementNode = null;
    let observable = null;

    let initParseTemplate = parseTemplate(container, filePath, data, 'includeElement_');

    initParseTemplate.parseTemplateWillLoad(function (observer, node_id) {
        setElementNode(`includeElement_${node_id}`);
        observable = observer
        swDispatch.dispatch(observer, actions.willLoad(node_id));
    });

    function setElementNode(eNode) {
        elementNode = eNode
    }

    return {
        observable: observable,
        node_id: elementNode
    }
}

/**
 * @param container
 * @param htmlSource
 * @param data
 */
function appendElement(container, htmlSource, data) {
    swLayout.getContent("/views/elements/" + htmlSource + ".html", function (template) {
        // Mustache.clearCache(template);
        let rendered = swLayout.compile(template, data);
        container.append(rendered);

    }).fail(function (jqXHR, textStatus, errorThrown) {
        if (textStatus == 'error' && errorThrown == 'Not Found') {
            logMessage("Error parsing");
        }
    });
}

/**
 * $Data params as to be an object
 */
function parseTemplate(container, htmlSource, data, p, callback) {
    if (typeof data === "undefined" || data === null) {
        data = {};
    }

    /**
     * Default SwallowJs absolute Path
     * getting current page
     */
    let currentPage = swHelper.getAbsolutePath(false);

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
     * @type {any}
     */
    data.app_version = swallowVersion;

    let generatedString = swLayout.generateNode(12);

    if (currentPage === "/") {
        data.home = true;
    }

    if (currentPage !== "/") {
        data[currentPage] = true;
    }

    swallowData = data;
    data.generatedNode = generatedString;
    swHelper.swGlobalId = generatedString;

    let observer = swDispatch.observableCl(generatedString) // init ob

    swLayout.getContent(htmlSource, data.generatedNode, function (response) {
        let template = response[0];
        // Mustache.escape = function (value) {return value;};
        //var rendered = swLayout.compile(template, data);

        if (data.opt !== null && data.opt === true) {
            //console.log('hreeeee');
        }

        let logic = (typeof p !== "string");

        template = swLayout.templateInterpolator(template, data.generatedNode);
        layoutUrl({
            element: container,
            htmlSource: swLayout.compile(template, data),
            renderedHTML: true,
            logic: logic,
            generatedNode: data.generatedNode
        }, function (res) {

            if (p === 'includeElement_') {
                // store.dispatch(actions.didLoad(res));
                swDispatch.dispatch(observer, actions.didLoad(res));
            }

            if (typeof callback == "function")
                return callback(res)

        });
    });

    return {
        parseTemplateWillLoad: function (callback) {
            return callback(observer, data.generatedNode);
        }
    }
}

/**
 * Set current page title
 * @param title
 */
function setPageTitle(title) {
    $(document).prop('title', title);
}

/**
 * @param layout    : layout to view
 * @param container : parent container
 * @param dataSet   : (Optional) "Data"- data to be sent to the layout
 */
function renderView(layout, container, dataSet) {
    if (typeof dataSet === "undefined" || dataSet === null) {
        dataSet = {};
    }

    if (swHelper.empty(layout) || layout === undefined) {
        dataSet.error_message = "No view with " + layout + " found. please check the file try again";
        dataSet.error_layout = layout;
        dataSet.not_found = true;

        swLayout.getContent(swLayout.error404, function (response) {
            let template = response[0];
            //currentParentLayout = '';
            //let rendered = swLayout.compile(template, dataSet);
            layoutUrl({
                element: swallowJsContainer,
                htmlSource: swLayout.compile(template, dataSet),
                renderedHTML: true
            });
        });

    } else {
        // swLayout.getContent(layout, function (response) {
        //     let template = response[0];

        // if (template.indexOf("---") >= 0) {
        //     parseTemplate(container, layout, dataSet, true);
        // } else {
        //     currentParentLayout = '';
        //     parseTemplate(container, layout, dataSet, false);
        // }
        parseTemplate(container, layout, dataSet, true);
        // })
        // $.get(layout, function (template) {
        // });
    }
}

// if (CONFIG.private('remove_swallow_css') == true) {
//     var removeSwallowCss = CONFIG.private('remove_swallow_css');
//     $('.swallow_stylesheet').each(function (i) {
//         $(this).remove();
//     });
// }