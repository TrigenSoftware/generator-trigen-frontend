/**
 * BrowserSync config
 */

export default <% if (serverProtocol == 'http2') { %>{
	https:      true,
	httpModule: 'http2',
	open:       false,
	notify:     false
}<% } else if (serverProtocol == 'https') { %>{
	https:  true,
	open:   false,
	notify: false
}<% } else if (serverProtocol == 'http1') { %>{
	open:   false,
	notify: false
}<% } %>;
