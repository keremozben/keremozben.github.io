var

getCurrentLevel = function(){
    return Number(location.search.split("=")[1]);
},
LEVEL = getCurrentLevel(),
win = function(){
	$.fancybox('#success',{margin:0, padding:0, topRatio:0.1, closeBtn:false, helpers : { overlay :{ closeClick : false } }});
},
lost = function(){
	$.fancybox('#fail',{margin:0, padding:0, topRatio:0.1, closeBtn:false, helpers : { overlay :{ closeClick : false } }});
},
settings = function(){
	$.fancybox('#settings',{margin:0, padding:0, topRatio:0.1, closeBtn:false, helpers : { overlay :{ closeClick : false } }});
},
stats = function(){},
vote = function(){
	//AppRate.preferences.storeAppURL.android = 'market://details?id=<package_name>';
	//AppRate.promptForRating();
},
mute = function(){
	var square = document.getElementById('sound_square');
	square.muted = true;
	$('.mute').hide();
	$('.unmute').show();
},
unmute = function(){
	var square = document.getElementById('sound_square');
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
checkFirstPlay = function(){
	if(player.firstPlay){
		location.href = 'game.html?level=0';
	} else {
		location.href = 'select.html'
	}
},
initTutorial = function(){
	$('.grid.active').eq(0).attr({
		'data-step' : 1,
		'data-intro' : 'In order to start, touch any square. For this tutorial, touch this one.',
        'onclick' : "$('.introjs-tooltipbuttons').show()"
	});
	$('.grid.active').eq(1).attr({
		'data-step' : 2,
		'data-intro' : 'This square is one of many available squares to place your next number. Touch this one too.',
        'onclick' : "$('.introjs-tooltipbuttons').show()"
	});
	$('.grid.active').eq(5).attr({
		'data-step' : 3,
		'data-intro' : 'Go on, touch it!',
        'onclick' : "$('.introjs-tooltipbuttons').show()"
	});
    $('.grid.active').eq(4).attr({
		'data-step' : 4,
		'data-intro' : 'This is the last hint for this tutorial. You are on your own now.',
        'onclick' : 'introJs().exit()'
	});
	introJs().setOptions({
        exitOnOverlayClick: false,
        showBullets:false,
        hidePrev : true,
        hideNext : true
    }).onchange(function(targetElement) {
      $('.introjs-tooltipbuttons').hide();
    }).start();
    $('.introjs-tooltipbuttons').hide();
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
goToNextLevel = function(){
    var cl = getCurrentLevel();
    location.href = 'game.html?level=' + (cl+1);
}

player = {
	undoCount : 0,
	purchasedAny : false,
	soundMuted : false,
	voted : false,
	firstPlay : true
}

