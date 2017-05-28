var $ = require('jquery');

function RegisterPlugin($el){
	this.$el = $el;
	this.$el.on('submit', this.onSubmit.bind(this))
}

RegisterPlugin.prototype.onSubmit = function(e) {
	e.preventDefault();
	var $el = this.$el;
	var email = this.$el.find('input[name="email"]').val().trim();
	$el.html('Loading...');
	$.ajax({
		url: 'https://webtale.herokuapp.com/register',
		method: 'POST',
		data: JSON.stringify({email: email}),
		dataType: 'json',
		contentType: 'application/json'
	}).then(function(){
		$el.html('Success');
	}).fail(function(){
		$el.html('Error');
	})
};



module.exports = RegisterPlugin;