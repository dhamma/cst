var fs=require('fs');
var argv=process.argv;
var set =argv[2] || 'mul';

var listfn='tipitaka-sutta-'+set+'.lst';
var sourcefolder='cst4xml-romanized/';
var targetfolder='splitted/vritipitaka/'+set+'/';
var dn=0,mn=0,sn=0,an=0;

var split_digha=function(fn) {
	var file=[];
	var savefile=function() {
		var filename=fn.substring(0,6)+'-d'+dn+'.xml';
		file.unshift('<xml src="'+filename+'">\n<sutra id="d'+dn+'"/>');
		file.push('</xml>');
		fs.writeFileSync(targetfolder+filename,
			file.join('\n'),'utf8');
		file=[];
	}
	var arr=fs.readFileSync(sourcefolder+fn,'utf8').replace(/\r\n/g,'\n').split('\n');
	for (var i=8;i<arr.length-7;i++) {
		var ends=arr[i].substring(arr[i].length-13);
		if (ends=='type="sutta">'){
			if (dn && file.length>10) savefile();
			dn++;
		}
		file.push(arr[i]);
	}
	savefile();
}
var split_majjhima=function(fn) {
	var file=[];
	var savefile=function() {
		var filename=fn.substring(0,6)+'-m'+mn+'.xml';
		file.unshift('<xml src="'+filename+'">\n<sutra id="m'+mn+'"/>');
		file.push('</xml>');
		fs.writeFileSync(targetfolder+filename,
			file.join('\n'),'utf8');
		file=[];
	}
	var arr=fs.readFileSync(sourcefolder+fn,'utf8').replace(/\r\n/g,'\n').split('\n');
	for (var i=8;i<arr.length-7;i++) {
		var starts=arr[i].substring(0,18);
		var title=arr[i].substr(18,3);
		if (starts=='<p rend="subhead">' && parseInt(title)){
			if (mn && file.length>10) savefile();
			mn++;
		}
		file.push(arr[i]);
	}
	savefile();
	
}
var split_samyutta=function(fn) {
	var file=[];
	var savefile=function() {
		var filename=fn.substring(0,6)+'-s'+sn+'.xml';
		file.unshift('<xml src="'+filename+'">\n<sutra id="s'+sn+'"/>');
		file.push('</xml>');
		fs.writeFileSync(targetfolder+filename,
			file.join('\n'),'utf8');
		file=[];
	}
	var arr=fs.readFileSync(sourcefolder+fn,'utf8').replace(/\r\n/g,'\n').split('\n');
	for (var i=8;i<arr.length-7;i++) {
		var ends=arr[i].substring(arr[i].length-16);
		if (ends=='type="samyutta">'){
			if (sn && file.length>10) savefile();
			sn++;
		}
		file.push(arr[i]);
	}
	savefile();
}
var split_anguttara=function(fn) {
	//maybe no spliting is needed
	/*
	var file=[];
	var savefile=function() {
		var filename=fn.substring(0,6)+'-a'+an+'.xml';
		file.unshift('<xml src="'+filename+'">\n<sutra id="a'+an+'"/>');
		file.push('</xml>');
		fs.writeFileSync(targetfolder+filename,
			file.join('\n'),'utf8');
		file=[];
	}
	var arr=fs.readFileSync(sourcefolder+fn,'utf8').replace(/\r\n/g,'\n').split('\n');
	for (var i=8;i<arr.length-7;i++) {
		var ends=arr[i].substring(arr[i].length-17);
		if (ends=='type="pannasaka">'){
			if (an && file.length>10) savefile();
			an++;
		}
		file.push(arr[i]);
	}
	savefile();	
	*/
}

var splitrule={
	's01' : split_digha,
	's02' : split_majjhima,
	's03' : split_samyutta,
	's04' : split_anguttara,
};

var main=function() {
	var files=fs.readFileSync(listfn,'utf8').replace(/\r\n/g,'\n').split('\n');
	for (var i in files) {

		var prefix=files[i].substring(0,3);
		var rule=splitrule[prefix];
	if (rule) rule(files[i]);
	}
}

main();