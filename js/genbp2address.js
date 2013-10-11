/*
	Generate Book Paragraph to address
*/
var yase=require('yase');
var db=yase.use('../vrimul',{nowatch:true});
var pgroups=db.get(['tags','pgroup','id='],true);
console.log('var bp2address=[')
for (var i in pgroups) {
	var t=db.getTag('pgroup',pgroups[i]);
	//console.log(t)
	var book=db.closestTag('book[id]',t.slot)
	var p=db.firstTagAfter('p','n',t.slot)[0];
	var parastart=parseInt(p.values['n'].split('.')[1],10);
	console.log('["'+book.value+'",'+parastart+',"'+i+'"],')
	//db.findTagAfter

}
console.log(']');