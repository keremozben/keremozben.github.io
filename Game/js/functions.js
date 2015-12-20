win = function(){
	$.fancybox('#success',{margin:0, padding:0, closeBtn:false, helpers : { overlay :{ closeClick : false } }});
}
lost = function(){
	$.fancybox('#fail',{margin:0, padding:0, closeBtn:false, helpers : { overlay :{ closeClick : false } }});
}
settings = function(){
	$.fancybox('#settings',{margin:0, padding:0, closeBtn:false, helpers : { overlay :{ closeClick : false } }});
}
stats = function(){}
vote = function(){
	//AppRate.preferences.storeAppURL.android = 'market://details?id=<package_name>';
	//AppRate.promptForRating();
}
mute = function(){}
unmute = function(){}
purchase = function(){}
info = function(){
	$.fancybox('#info',{margin:0, padding:0, closeBtn:true, helpers : { overlay :{ closeClick : false } }});
}
howto = function(){
	$.fancybox('#howto',{margin:0, padding:0, closeBtn:true, helpers : { overlay :{ closeClick : false } }});	
}