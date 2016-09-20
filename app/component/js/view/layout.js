/**
 * Created by olatundeowokoniran on 9/20/16.
 */


function layoutUrl(parameters) {
    var element = parameters.element;
    var htmlSource = parameters.htmlSource;
    var renderedHTML = parameters.renderedHTML;

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

if (CONFIG.private('loading') == true) {
    layoutUrl({element: swallowJsContainer, htmlSource: CONFIG.layoutTemplate('page_loading')});
}