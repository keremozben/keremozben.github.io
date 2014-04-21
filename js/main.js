$(document).ready(function(){
    var galleryEl = $('#thumbSlide ul');
	$('#prev').click(function(){
        var cur = parseInt( galleryEl.css('left') );
		if( cur < 0 && galleryEl.queue('fx').length < 1 ){
			galleryEl.animate({
				left : (cur + 80) + 'px'
			});
		}
    });
	$('#next').click(function(){
        var cur = parseInt( galleryEl.css('left') );
		var $max = (galleryEl.children().length - 11) * 80;
		if( Math.abs(cur) < $max && galleryEl.queue('fx').length < 1 ){
			galleryEl.animate({
				left : (cur - 80) + 'px'
			});
		}
    });
});

function urlGet(qs){
	try{ var pageUrl = decodeURIComponent(document.location.search); }
	catch(err){ var pageUrl = unescape(document.location.search); }
	var total = pageUrl.length > 1 ? pageUrl.length : "undefined";
	pageUrl = pageUrl != "undefined" ? pageUrl : "undefined";
	if(total != "undefined"){
		pageUrl = pageUrl.replace(/(<([^>]+)>)/ig, '');
		pageUrl = pageUrl.replace(/>+|<+/g, '');
		pageUrl = pageUrl.substr(1);
		if(pageUrl.indexOf(qs)!=-1){ 
			var parcalar = pageUrl.split('&'); 
			if(parcalar.length>0) for(var i=0; i<parcalar.length; i++) if(parcalar[i].substr(0, qs.length)==qs) return parcalar[i].substr(qs.length +1); }
		else return 0;
	}
	else return 0;
}

String.prototype.turkishToUpper = function(){
    var string = this;
    var letters = { "i": "İ", "ş": "Ş", "ğ": "Ğ", "ü": "Ü", "ö": "Ö", "ç": "Ç", "ı": "I" };
    string = string.replace(/(([iışğüçö]))+/g, function(letter){ return letters[letter]; })
    return string.toUpperCase();
}

String.prototype.turkishToLower = function(){
    var string = this;
    var letters = { "İ": "i", "I": "ı", "Ş": "ş", "Ğ": "ğ", "Ü": "ü", "Ö": "ö", "Ç": "ç" };
    string = string.replace(/(([İIŞĞÜÇÖ]))+/g, function(letter){ return letters[letter]; })
    return string.toLowerCase();
}

function pager(element){
	var listeSayisi = 10;
	var elemanSayisi = parseInt(element.children('li').length);
	var sayfaSayisi = elemanSayisi / listeSayisi;
	sayfaSayisi = Math.round(sayfaSayisi) == sayfaSayisi ? sayfaSayisi : parseInt(sayfaSayisi)+1;
	element.after($('<div />').addClass('sayfalama').append('<ul class="clearfix" />'));
	for(var i=1; i<=sayfaSayisi; i++){
	element.next().children().append(
		$('<li />').addClass('buton number').addClass(function(){if(i == 1) {return "first"}else if(i == sayfaSayisi){return "last"}}).append(	
		$('<a />')
			.attr('href', 'javascript:;')
			.attr('rel', i*listeSayisi)
			.text(i)
			.click(function(){
				var listeler = $(this).parent().parent().parent().prev().children();
				listeler.parent().show();
				var deger = parseInt($(this).attr('rel'));
				$(this).addClass('on').parent().siblings().children('a').removeClass('on')
				listele(listeler, deger);
			})
		)
	);
	}
	element.next().children('ul').children('li.buton:first').children('a').click();
	$('div.sayfalama ul').prepend(
						  $('<li />').addClass('buton')
						  	.append(
									$('<a />')
										.attr('href','javascript:;')
										.attr('rel',i)
										.addClass('sayfalama_onceki')
										.text('<')
										.click(function(){
											$('div.sayfalama ul').children('li').children('a.on').parent().prev().children('a').trigger('click');
														})
									)
						  )
				.prepend(
						 $('<li />').addClass('buton')
						  	.append(
									$('<a />')
										.attr('href','javascript:;')
										.attr('rel',i)
										.addClass('sayfalama_ilk')
										.text('<')
										.click(function(){
											$('div.sayfalama ul').children('li').eq(2).children('a').trigger('click');			
														})
									)
						 )
				.append(
						$('<li />').addClass('buton')
						  	.append(
									$('<a />')
										.attr('href','javascript:;')
										.attr('rel',i)
										.addClass('sayfalama_sonraki')
										.text('>')
										.click(function(){
											$('div.sayfalama ul').children('li').children('a.on').parent().next().children('a').trigger('click');			
														})
									)
						)
				.append(
						$('<li />').addClass('buton')
						  	.append(
									$('<a />')
										.attr('href','javascript:;')
										.attr('rel',i)
										.addClass('sayfalama_son')
										.text('>')
										.click(function(){
											$('div.sayfalama ul').children('li').eq(parseInt(Number($('div.sayfalama ul').children('li').length)-3)).children('a').trigger('click');				
														})
									)
						)
}
function listele(liste, deger){ liste.hide(); for(var i=deger-(listeSayisi-1); i<=deger; i++) liste.eq(i-1).show(); }