var argv=process.argv;
if (argv.length<2) {
	console.log('syntax:');
	console.log('node deva2roman tipitaka.lst sourcefolder targetfolder')
	return;
}

var fs=require('fs');
var deva2roman=require('pali').deva2roman;

var sourcefilename=argv[2]||'tipitaka.lst';
var sourcefolder=argv[3]||'cst4xml-devanagari/';
var targetfolder=argv[4]||'cst4xml-romanized/';
var getfiles=function( filelist , maxfile) {
	var files=fs.readFileSync(filelist,'utf8').replace(/\r\n/g,'\n').split('\n');
	var output=[];
	var maxfile=maxfile||0;
	for (var i=0;i<files.length;i++) {
		if (!files[i].trim()) continue;
		if (files[i].charAt(0)==';') continue;
		output.push(files[i]);
		if (maxfile && output.length>=maxfile) break;
	}
	return output;
}

var convertfile=function(fn,targetpath) {
	console.log('converting '+fn);
	var output=[];
	var source=fs.readFileSync(sourcefolder+fn,'ucs2').replace(/\r\n/g,'\n').split('\n');
	for (var i in source) {
		output.push( deva2roman.devanagariToRoman(source[i]));
	}
	fs.writeFileSync(targetfolder+fn,output.join('\n'),'utf8');
}

if (sourcefilename.substring(sourcefilename.length-4)=='.lst') 
	files=getfiles(sourcefilename);

if (files) {
	for (var i in files) convertfile(files[i])	
} else {
	convertfile(sourcefilename);
}


