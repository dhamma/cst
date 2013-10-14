if (typeof define=='undefined') var define=function(body){ module.exports=body()};

define(function() {
var isBreaker=function(ch) {
	//var c=ch.charCodeAt(0);
	return  ( ch=='|') ;
}
var dediacritic=function(token) {
	return token.replace(/ā/g,'a').replace(/ī/g,'i').replace(/[ṛ,ṝ]/g,'r').replace(/[ḷ,ḹ]/g,'l')
	.replace(/ū/g,'u').replace(/[ṅ,ñ,ṇ]/g,'n').replace(/ṭ/g,'t').replace(/ḍ/g,'d')
	.replace(/[ṣ,ś]/g,'s').replace(/ṃ/g,'m').replace(/ḥ/g,'h');
}

return {isBreaker:isBreaker, simplifiedToken: dediacritic};
});