var fs=require('fs');
var argv=process.argv;
var set =argv[2] || 'mul';

var listfn='tipitaka-sutta-'+set+'.lst';
var sourcefolder='cst4xml-romanized/';
var targetfolder='splitted/vritipitaka/'+set+'/';
var dn=0,mn=0,sn=0,an=0;
var saveit=true;
var verbose=false;
var titles=[];
var split_digha=function(fn) {
	var file=[];
	var savefile=function() {
		var filename=fn.substring(0,6)+'-d'+dn+'.xml';
		file.unshift('<xml src="'+filename+'">\n<pgroup id="d'+dn+'"/>');
		file.push('</xml>');

		if (saveit) fs.writeFileSync(targetfolder+filename,
			file.join('\n'),'utf8');
		else {
			if (verbose) console.log('creating',targetfolder+filename,'lines',file.length)
		}
		file=[];
	}
	var reduce=0;
	var first=true;
	var arr=fs.readFileSync(sourcefolder+fn,'utf8').replace(/\r\n/g,'\n').replace(/\r/g,'\n').split('\n');
	for (var i=8;i<arr.length-7;i++) {
		var ends=arr[i].substring(arr[i].length-13);
		if (ends=='type="sutta">'){
			
			var title=arr[i+1].match(/.*?>(.*?)<.*?/);
			if (title) { //work around for tik first sutta
				title=title[1];
				titles.push(title);
				if (isNaN(parseInt(title))) { reduce=1;}
			}

			if (!first && dn && file.length ) {
				dn-=reduce;reduce=0;
				savefile();
			}
			dn++;
			first=false;
		}
		file.push(arr[i]);
	}
	savefile();
	return dn;
	//if (dn!=34) throw 'dn book count error '+dn
}
var split_majjhima=function(fn) {
	var file=[];
	var savefile=function() {
		var filename=fn.substring(0,6)+'-m'+mn+'.xml';
		file.unshift('<xml src="'+filename+'">\n<pgroup id="m'+mn+'"/>');
		file.push('</xml>');
		if (saveit) fs.writeFileSync(targetfolder+filename,
			file.join('\n'),'utf8');
		else {
			if (verbose) console.log('creating',targetfolder+filename,'lines',file.length)
		}
		file=[];
	}
	var reduce=0;
	var first=true;
	var skip=false;
	var arr=fs.readFileSync(sourcefolder+fn,'utf8').replace(/\r\n/g,'\n').replace(/\r/g,'\n').split('\n');
	for (var i=8;i<arr.length-7;i++) {
		var starts=arr[i].substring(0,18);
		var title=arr[i].substr(18,3);

		if (starts=='<p rend="subhead">' && parseInt(title)){
			title=arr[i].substring(18);
			if (title.indexOf("sutta")==-1) {  //extra vaṇṇanā after MN mūlapariyāyasuttavaṇṇanā
				//if (verbose) 
				console.log('extra vaṇṇanā',title,file.length)
				skip=true;
				mn--;
			} else {titles.push(title);skip=false}

			if (!first && !skip && mn && file.length ) {
				mn-=reduce;reduce=0;
				savefile();
			}
			mn++;
			first=false;
		}
		file.push(arr[i]);
	}
	savefile();
	return mn;
}
var split_samyutta=function(fn) {
	var file=[];
	var savefile=function() {
		var filename=fn.substring(0,6)+'-s'+sn+'.xml';
		file.unshift('<xml src="'+filename+'">\n<pgroup id="s'+sn+'"/>');
		file.push('</xml>');
		if (saveit) fs.writeFileSync(targetfolder+filename,
			file.join('\n'),'utf8');
		else {
			if (verbose) console.log('creating',targetfolder+filename,'lines',file.length)
		}
		file=[];
	}
	var arr=fs.readFileSync(sourcefolder+fn,'utf8').replace(/\r\n/g,'\n').replace(/\r/g,'\n').split('\n');
	var reduce=0;
	var first=true;
	for (var i=8;i<arr.length-7;i++) {
		var ends=arr[i].substring(arr[i].length-16);
		if (ends=='type="samyutta">'){

			var title=arr[i+1].match(/.*?>(.*?)<.*?/);	
			if (title) { //work around for tik first sutta
				title=title[1];
				titles.push(title);
				if (isNaN(parseInt(title))) { reduce=1;}
			}

			if (!first &&sn && file.length) {
				sn-=reduce;reduce=0;
				savefile();
			}
			sn++;
			first=false;
		}
		file.push(arr[i]);
	}
	savefile();
	return sn;
}
var split_anguttara=function(fn) {
	//maybe no spliting is needed
	var file=[];
	var first=true;
	var savefile=function() {
		var filename=fn.substring(0,6)+'-a'+an+'.xml';
		file.unshift('<xml src="'+filename+'">\n<pgroup id="a'+an+'"/>');
		file.push('</xml>');
		fs.writeFileSync(targetfolder+filename,
			file.join('\n'),'utf8');
		file=[];
	}
	var arr=fs.readFileSync(sourcefolder+fn,'utf8').replace(/\r\n/g,'\n').replace(/\r/g,'\n').split('\n');
	for (var i=7;i<arr.length-7;i++) {
		var ends=arr[i].substring(arr[i].length-12);
		if (ends=='type="book">'){
			var title=arr[i+3].match(/.*?>(.*?)<.*?/);	
			if (!first &&an && file.length) {
				savefile();
			}
			an++;
			first=false;
		}				
		file.push(arr[i]);
	}
	savefile();	

	return 0;
}

var splitrule={
	's01' : split_digha,
	's02' : split_majjhima,
	's03' : split_samyutta,
	's04' : split_anguttara,
};

var suttainbook=
	[
		13,23,34,
		50,100,152,
		11,21,34,44,56,
		0,0,0,0,0,0,0,0,0,0,0
	];


var main=function() {
	var files=fs.readFileSync(listfn,'utf8').replace(/\r\n/g,'\n').split('\n');
	for (var i in files) {
		var prefix=files[i].substring(0,3);
		if (prefix[0]==';') continue;
		var rule=splitrule[prefix];
		if (rule) {
			var bk=rule(files[i]);
			if (bk!=suttainbook[i]) {
				fs.writeFileSync(targetfolder+'titles.txt',titles.join('\n'),'utf8');
				throw 'error book count'+files[i]+bk;
			}
		}
	}
}

main();
fs.writeFileSync(targetfolder+'titles.txt',titles.join('\n'),'utf8');