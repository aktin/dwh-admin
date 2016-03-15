jQuery(function ( $ ){
	$('.navitem').click(function (e, t) {
		console.log(e, t)
		e.target.addClass('active');
	});

	console.log($(location).attr('pathname').split('/')[1]);
});