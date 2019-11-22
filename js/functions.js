(function ($) {

	$('#countdown_dashboard').countDown({

	        // targetOffset: {
	            // 'day':      0,
	            // 'month':    0,
	            // 'year':     1,
	            // 'hour':     0,
	            // 'min':      0,
	            // 'sec':      0

	        // },
			targetDate: {
			'day': 6,
			'month': 12,
			'year': 2019,
			'hour': 0,
			'min': 0,
			'sec': 0,
			'utc': true
			},
			'omitWeeks': true,


	    });

	// $('#email_field').focus(email_focus).blur(email_blur);
	// $('#subscribe_form').bind('submit', function() { return false; });

})(jQuery);
