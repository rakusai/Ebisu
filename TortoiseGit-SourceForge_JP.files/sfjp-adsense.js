function curry() {
	var self = Array.prototype.shift.apply(arguments);
	var args = arguments;
	return function () {
		Array.prototype.unshift.apply(arguments, args);
		return self.apply(this, arguments);
	};
};
function clone(obj){
	if(obj.constructor == Array)
		return [].concat(obj);
	if(obj == null || typeof(obj) != 'object')
		return obj;
	var temp = {};
	for(var key in obj)
		temp[key] = clone(obj[key]);
	return temp;
}

sfjpAdSense = {
	'counter': 0,
	'config': function(style) {
		var is_afs = (style.substr(0, 4) == 'afs_');
		is_afs ? this.configurators._afs_base() : this.configurators._base();
		if (this.configurators[style]) this.configurators[style]();
		if (is_afs) {
			google_afs_request_done = sfjpAdSense.get_handler(style);
		} else {
			google_ad_request_done = sfjpAdSense.get_handler(style);
		}
	},
	'get_handler': function(style) {
		return curry(this.ad_handler, style);
	},
	'ad_handler': function(style, google_ads) {
		if (!google_ads || google_ads.length == 0) return;
		if (!sfjpAdSense.handlers[style]) return;
		var is_afs = (style.substr(0, 4) == 'afs_');
		var formatter;
		if (is_afs) {
			formatter = sfjpAdSense.handlers[style];
		} else {
			formatter = sfjpAdSense.handlers[style][google_ads[0].type];
		}
		if (!formatter) return;
		document.write(formatter(google_ads));
		if (!is_afs) { sfjpAdSense.counter += google_ads.length; }
	},
	'handlers': {},
	'configurators': {
		'_base': function() {
			google_ad_client = 'pub-9941151214016196';
			google_ad_channel = '9402311604';
			google_ad_output = 'js';
			google_language = 'ja';
			google_safe = 'high';
			google_ad_section = 'default';
			google_encoding = 'utf8';
			google_feedback = 'on';
			google_max_num_ads = '4';
			google_ad_type = 'text';
			google_skip = sfjpAdSense.counter;
		},
		'_afs_base': function() {
			//google_afs_query = GetParam('q');
			google_afs_ad = 'n4';
			google_afs_client = 'pub-9941151214016196';
			google_afs_channel = '1234567890';
			google_afs_hl = 'ja';
			google_afs_ie = 'utf8';
			google_afs_oe = 'utf8';
		}
	}
};

sfjpAdSense.configurators.plain = function() {
	google_max_num_ads = '5';
	google_ad_type = 'text, image, flash, html';
	google_image_size = '300x250';
};
sfjpAdSense.handlers.plain = {
	'image': function(google_ads) {
		var s = '';
		s += '<div style="text-align:left;font-weight:bold;font-size:85%;text-decoration: underline">' +
			'<a href="' + google_info.feedback_url + '" style="color:#000000">' +
			'Ads by Google</a>' +
			'</div>';
		s +=	'<a href="' + google_ads[0].url +
			'" target="_top" title="go to ' + google_ads[0].visible_url +
			'"><img border="0" src="' + google_ads[0].image_url +
			'"width="' + google_ads[0].image_width +
			'"height="' + google_ads[0].image_height + '"></a>';
		return s;
	},
	'flash': function(google_ads) {
		var s = '';
		s += '<div style="text-align:left;font-weight:bold;font-size:85%;text-decoration: underline">' +
			'<a href="' + google_info.feedback_url + '" style="color:#000000">' +
			'Ads by Google</a>' +
			'</div>';
		s += 	'<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' +
			' codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0"' +
			' WIDTH="' + google_ad.image_width +
			'" HEIGHT="' + google_ad.image_height + '">' +
			'<PARAM NAME="movie" VALUE="' + google_ad.image_url + '">' +
			'<PARAM NAME="quality" VALUE="high">' +
			'<PARAM NAME="AllowScriptAccess" VALUE="never">' +
			'<EMBED src="' + google_ad.image_url +
			'" WIDTH="' + google_ad.image_width +
			'" HEIGHT="' + google_ad.image_height +
			'" TYPE="application/x-shockwave-flash"' +
			' AllowScriptAccess="never" ' +
			' PLUGINSPAGE="http://www.macromedia.com/go/getflashplayer"></EMBED></OBJECT>';

		return s;
	},
	'html': function(google_ads) {
		return google_ads[0].snippet;
	},
	'text': function(google_ads) {
		var s = '';
		var i;
		s += '<div class="ads-by-google" style="margin-left:4px;">' +
			'<a href="' + google_info.feedback_url + '" style="color:#000000">' +
			'Ads by Google</a>' +
			'</div>';
		s += '<div class="adsense" style="margin-left:0">' +
			'<table style="border: none; width: 99%;" border="0" cellspacing="4" cellpadding="0">';
		for(i = 0; i < google_ads.length; ++i) {
			s += '<tr><td style="white-space: nowrap;">';
			s += '<a target=_top" title="' + google_ads[i].visible_url + '" onmouseout="window.status=\'\'" onmouseover="window.status=\'' + google_ads[i].visible_url + '\'; return true;" href="' + google_ads[i].url + '">' +
				'<span><b>' + google_ads[i].line1 + '</b></span></a>' +
				'&nbsp;' +
				'<a target=_top" title="' + google_ads[i].visible_url + '" onmouseout="window.status=\'\'" onmouseover="window.status=\'' + google_ads[i].visible_url + '\'; return true;" href="' + google_ads[i].url + '">' +
				'<span style="color:#008000;font-size: 80%">' + google_ads[i].visible_url + '</span></a><br>' +
				'<span style="font-size: 80%; color:#778899">' + google_ads[i].line2 + ' ' + google_ads[i].line3 + '<br></span>';
			s += '</td></tr>';
		}
		s += '</table></div>';
		return s;
	}
};

sfjpAdSense.configurators.plain3 = function() {
	google_max_num_ads = '4';
	google_ad_type = 'text, image, flash, html';
	google_image_size = '300x250';
};
sfjpAdSense.handlers.plain3 = sfjpAdSense.handlers.plain;

sfjpAdSense.configurators.thin = function() {
	google_max_num_ads = '2';
	google_ad_type = 'text';
};
sfjpAdSense.handlers.thin = clone(sfjpAdSense.handlers.plain);
sfjpAdSense.handlers.thin.text = function() {
	var s  = '';
	s += '<div class="ads-by-google" style="margin-left:6px;">' +
		'<a href="' + google_info.feedback_url + '" style="color:#000000">' +
		'Ads by Google</a>' +
		'</div>';
	s += '<div class="adsense" style="margin-left:0">' +
		'<table border="0" cellspacing="6" cellpadding="0"><tr>';
	for(i = 0; i < google_ads.length; ++i) {
		s += '<td style="white-space: nowrap;">';
		s += '<a target=_top" title="' + google_ads[i].visible_url + '" onmouseout="window.status=\'\'" onmouseover="window.status=\'' + google_ads[i].visible_url + '\'; return true;" href="' + google_ads[i].url + '">' +
			'<span><b>' + google_ads[i].line1 + '</b></span></a>' +
			'&nbsp;' +
			'<a target=_top" title="' + google_ads[i].visible_url + '" onmouseout="window.status=\'\'" onmouseover="window.status=\'' + google_ads[i].visible_url + '\'; return true;" href="' + google_ads[i].url + '">' +
			'<span style="color:#008000;font-size: 80%">' + google_ads[i].visible_url + '</span></a><br>' +
			'<span style="font-size: 85%; color:#667788">' + google_ads[i].line2 + '<br>' + google_ads[i].line3 + '<br></span>';
		s += '</td>';
	}
	return s+'</tr></table></div>';
};

sfjpAdSense.configurators.sitetop = function() {
	google_max_num_ads = '3';
	google_ad_type = 'text';
};
sfjpAdSense.handlers.sitetop = clone(sfjpAdSense.handlers.plain);
sfjpAdSense.handlers.sitetop.text = function(google_ads) {
	var s = '';
	s += '<h3 class="subtitle">' +
		'<a href="' + google_info.feedback_url + '" style="color:#000000">' +
		'Ads by Google</a>' +
		'</h3>';
	s += '<div class="adsense" style="margin-left:0">' +
		'<table border="0" cellspacing="4" cellpadding="0"><tr>';
	for(i = 0; i < google_ads.length; ++i) {
		s += '<td style="white-space: nowrap;">';
		s += '<a target=_top" title="' + google_ads[i].visible_url + '" onmouseout="window.status=\'\'" onmouseover="window.status=\'' + google_ads[i].visible_url + '\'; return true;" href="' + google_ads[i].url + '">' +
			'<span><b>' + google_ads[i].line1 + '</b></span></a><br>' +
			'<a target=_top" title="' + google_ads[i].visible_url + '" onmouseout="window.status=\'\'" onmouseover="window.status=\'' + google_ads[i].visible_url + '\'; return true;" href="' + google_ads[i].url + '">' +
			'<span style="color:#008000;font-size: 80%">' + google_ads[i].visible_url + '</span></a><br>' +
			'<span style="font-size: 85%; color:#667788">' + google_ads[i].line2 + '<br>' + google_ads[i].line3 + '<br></span>';
		s += '</td>';
	}
	return s+'</tr></table></div>';
};

sfjpAdSense.configurators.insert_common = function() {
	google_max_num_ads = '2';
	google_ad_type = 'text';
	google_image_size = '468x60';
};
sfjpAdSense.handlers.insert_common = clone(sfjpAdSense.handlers.thin);

sfjpAdSense.configurators.rect200 = function() {
	google_max_num_ads = '2';
	google_ad_type = 'text, image, flash, html';
	google_image_size = '200x200';
};
sfjpAdSense.handlers.rect200 = sfjpAdSense.handlers.plain;

sfjpAdSense.configurators.with_titlebar = function() {
	google_max_num_ads = '3';
	google_ad_type = 'text';
};
sfjpAdSense.handlers.with_titlebar = clone(sfjpAdSense.handlers.plain);
sfjpAdSense.handlers.with_titlebar.text = function(google_ads) {
	var s = '';
	s += '<h3 class="titlebar">' +
		'<a href="' + google_info.feedback_url + '">' +
		'Ads by Google</a>' +
		'</h3>';
	s += '<div class="adsense" style="margin-left:0">' +
		'<table style="border: none; width: 100%;" border="0" cellspacing="4" cellpadding="0">';
	for(i = 0; i < google_ads.length; ++i) {
		s += '<tr><td style="white-space: nowrap;">';
		s += '<a target=_top" title="' + google_ads[i].visible_url + '" onmouseout="window.status=\'\'" onmouseover="window.status=\'' + google_ads[i].visible_url + '\'; return true;" href="' + google_ads[i].url + '">' +
			'<b>' + google_ads[i].line1 + '</b></a>' +
			'<br>' +
			'<a target=_top" title="' + google_ads[i].visible_url + '" onmouseout="window.status=\'\'" onmouseover="window.status=\'' + google_ads[i].visible_url + '\'; return true;" href="' + google_ads[i].url + '">' +
			'<span style="color:#008000;font-size: 80%">' + google_ads[i].visible_url + '</span></a><br>' +
			'<span style="font-size: 85%; color:#667788; margin-bottom: 5px;">' + google_ads[i].line2 + '<br>' + google_ads[i].line3 + '<br></span>';
		s += '</td></tr>';
	}
	return s+'</table></div>';
}

sfjpAdSense.configurators.afs_search_middle = function() {
	google_afs_ad = 'n2';
};
sfjpAdSense.handlers.afs_search_middle = function(google_ads) {
	// NOT SUPPORT wide ads
	var i;
	var ret = '<div class="ads-by-google" style="margin-left:6px;">' +
		'<a href="https://www.google.com/adsense/support/bin/request.py?contact=afs_violation" style="color:#000000">' +
		'Ads by Google</a></div>';
	ret += '<div class="adsense" style="margin-left:0">' +
		'<table border="0" cellspacing="6" cellpadding="0"><tr>';
	for (i = 0; i < google_ads.length; ++i) {
		ret += '<td style="white-space: nowrap;">';
		ret += '<a target=_top" title="' + google_ads[i].visible_url + '" onmouseout="window.status=\'\'" onmouseover="window.status=\'' + google_ads[i].visible_url + '\'; return true;" href="' + google_ads[i].url + '">' +
			'<span><b>' + google_ads[i].line1 + '</b></span></a>' +
			'&nbsp;' +
			'<a target=_top" title="' + google_ads[i].visible_url + '" onmouseout="window.status=\'\'" onmouseover="window.status=\'' + google_ads[i].visible_url + '\'; return true;" href="' + google_ads[i].url + '">' +
			'<span style="color:#008000;font-size: 80%">' + google_ads[i].visible_url + '</span></a><br>' +
			'<span style="font-size: 85%; color:#667788">' + google_ads[i].line2 + '<br>' + google_ads[i].line3 + '<br></span>';
		ret += '</td>';
	}
	return ret+'</tr></table></div>';
};

sfjpAdSense.configurators.adaptive_plain = function() {
	if (document.body.clientWidth < 900) {
		google_ad_client = null;
		google_ad_channel = null;
		google_ad_output = null;
		google_language = null;
		google_safe = null;
		google_ad_section = null;
		google_encoding = null;
		google_feedback = null;
		google_max_num_ads = 0;
		google_ad_type = null;
	} else {
		sfjpAdSense.configurators.plain();
	}
};
sfjpAdSense.handlers.adaptive_plain = sfjpAdSense.handlers.plain;
