if (typeof define=='undefined') var define=function(body){ module.exports=body()};

define(function() {
var isBreaker=function(ch) {
	//var c=ch.charCodeAt(0);
	return  ( ch=='|') ;
}
var isSearchableChar=function(token) {
	var diacritics=['ā','ī','ū','ṛ','ṝ','ḷ','ḹ','ṅ','ñ','ṇ','ṭ','ḍ','ṃ','ṁ','ḥ'];
	var code=token.charCodeAt(0);

	return ((code>=0x30 && code<=0x39)||(code>=0x41 && code<=0x5a)
	 || (code>=0x61 && code<=0x7a) || 
	 (code>=0x30 && code<=0x39)||token[0]=='%'
	 ||diacritics.indexOf(token[0])>-1); 
}
var dediacritic=function(token) {
	return token.toLowerCase().replace(/ā/g,'a').replace(/ī/g,'i').replace(/[ṛ,ṝ]/g,'r').replace(/[ḷ,ḹ]/g,'l')
	.replace(/ū/g,'u').replace(/[ṅ,ñ,ṇ]/g,'n').replace(/ṭ/g,'t').replace(/ḍ/g,'d')
	.replace(/[ṣ,ś]/g,'s').replace(/[ṃ,ṁ]/g,'m').replace(/ḥ/g,'h');
}
var simplifiedToken=function(token) {
	return token.toLowerCase();
}
return {isBreaker:isBreaker, simplifiedToken: simplifiedToken
, searchNormalizeToken: dediacritic,isSearchableChar:isSearchableChar};
});