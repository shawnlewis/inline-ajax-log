// This module writes the most recent ajax request/response in your page.
// Requires jQuery.
// Expects three page elements with ids debug_ajax_url, debug_ajax_data
// and debug_ajax_result.
// Ex:
//   <input type="text" id="debug_ajax_url" size=100 /><br>
//   <textarea id="debug_ajax_data" cols=100 rows=20></textarea><br>
//   <iframe id="debug_ajax_result" width="100%"></iframe>

(function() {

var writeToIframe = function(iframe, text) {
    // From http://stackoverflow.com/questions/997986/write-elements-into-a-child-iframe-using-javascript-or-jquery
    iframeWindow = (iframe.contentWindow) ?
        iframe.contentWindow :
        (iframe.contentDocument.document) ?
            iframe.contentDocument.document :
            iframe.contentDocument;
    iframeWindow.document.open();
    iframeWindow.document.write(text);
    iframeWindow.document.close();

    // resize iframe to fit contents
    iframe.style.height = '10px';
    iframe.style.height =
        iframe.contentWindow.document.body.scrollHeight + 20 + 'px';
}

// Listens for ajax completion and logs the response in the page.
// Looks for an extra option to jQuery ajax functions: debug_exempt. If that
// option is truty ajax_complete is a noop. Useful for excluding ajax
// requests that fire periodically for example.
var ajax_complete = function(ev, xhr, options) {
    if (!options.debug_exempt) {
        $('#debug_ajax_url').val(options.url);
        $('#debug_ajax_data').val(options.data);
        var result = xhr.responseText;
        if (xhr.getResponseHeader('content-type') == 'application/json') {
            result =
                '<pre style="word-wrap: break-word; white-space: pre-wrap;">'
                + result
                + '</pre>';
        }
        var iframe = $('#debug_ajax_result').get(0);
        if (iframe) {
            writeToIframe(iframe, result);
        }
    }
}
$('body').ajaxComplete(ajax_complete);

}());
