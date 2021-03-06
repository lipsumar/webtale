var $ = require('jquery');
window.$ = $;
window.jQuery = $;

var plugins = {
	register: require('./plugin/register')
};

$('[data-wt-plugin]').each(function(){
	var plugin = $(this).data('wt-plugin');
	if(plugins[plugin]){
		new plugins[plugin]($(this))
	}
})
