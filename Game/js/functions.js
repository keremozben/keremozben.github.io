var

win = function(){
	$.fancybox('#success',{margin:0, padding:0, closeBtn:false, helpers : { overlay :{ closeClick : false } }});
},
lost = function(){
	$.fancybox('#fail',{margin:0, padding:0, closeBtn:false, helpers : { overlay :{ closeClick : false } }});
},
settings = function(){
	$.fancybox('#settings',{margin:0, padding:0, closeBtn:false, helpers : { overlay :{ closeClick : false } }});
},
stats = function(){},
vote = function(){
	//AppRate.preferences.storeAppURL.android = 'market://details?id=<package_name>';
	//AppRate.promptForRating();
},
mute = function(){
	var bg = document.getElementById('sound_background');
	var square = document.getElementById('sound_square');
	bg.pause();
	square.muted = true;
	$('.mute').hide();
	$('.unmute').show();
},
unmute = function(){
	var bg = document.getElementById('sound_background');
	var square = document.getElementById('sound_square');
	bg.play();
	square.muted = false;
	$('.mute').show();
	$('.unmute').hide();
},
purchase = function(){},
info = function(){
	$.fancybox('#info',{margin:0, padding:0, closeBtn:true, helpers : { overlay :{ closeClick : false } }});
},
howto = function(){
	$.fancybox('#howto',{margin:0, padding:0, closeBtn:true, helpers : { overlay :{ closeClick : false } }});	
},
undo = function(){
	if( Levels[LEVEL].current > 1 ){
		Levels[LEVEL].current--;
		var current = Levels[LEVEL].current;
		$('.grid').filter(':contains('+current+')').empty().removeClass('selected');
		var last = $('.grid').filter(':contains('+(current-1)+')');
		if( last.size() > 0 ){
			var x = last.data('x'), y = last.data('y');
			Levels[LEVEL].undo([y,x]);
		} else {
			Levels[LEVEL].destroyGrid();
			Levels[LEVEL].createGrid();
		}
	}
},
pause = function(){

},
music = {
	selectSquare : function(){
		var square = document.getElementById('sound_square');
		square.play();
		if(square.ended){
			square.currentTime = 0;
		}
	}
},

player = {
	undoCount : 0,
	purchasedAny : false,
	soundMuted : false,
	voted : false
}

