// Wrapper around jQuery.ajax that logs ajax requests/responses in the generating page.
// options can be passed debug_exempt in addition to the standard jQuery options. If 
// debug_exempt is truthy this function just delegates to jQuery.ajax immediately.
var ajax = function(options) {
    if (!options.debug_exempt) {
        $('#debug_ajax_url').val(options.url);
        $('#debug_ajax_data').val(options.data);
        old_complete = options.complete;
        options.complete = function(jqXHR) {
            var result = jqXHR.responseText;
            if (jqXHR.getResponseHeader('content-type') == 'application/json') {
                result =
                    '<pre style="word-wrap: break-word; white-space: pre-wrap;">'
                    + result
                    + '</pre>';
            }
            // From http://stackoverflow.com/questions/997986/write-elements-into-a-child-iframe-using-javascript-or-jquery
            var ifrm = document.getElementById('debug_ajax_result');
            ifrm = (ifrm.contentWindow) ?
                        ifrm.contentWindow :
                        (ifrm.contentDocument.document) ?
                            ifrm.contentDocument.document :
                            ifrm.contentDocument;
            ifrm.document.open();
            ifrm.document.write(result);
            ifrm.document.close();

            // resize iframe to fit contents
            var ifrm = document.getElementById('debug_ajax_result');
            ifrm.style.height = '10px';
            ifrm.style.height =
                ifrm.contentWindow.document.body.scrollHeight + 20 + 'px';

            if (old_complete) {
                old_complete(arguments);
            }
        };
    }
    $.ajax(options);
}
