if (typeof define=='undefined') var define=function(body){ module.exports=body()};

define(function(){
	var replacetbl={
		'dī.':'d',
		'di.':'d',
		'a.':'a',
		'ma.':'m',
		'saṃ.':'s',
		'sam.':'s',
		'ni.':'',
		'n':'',
		'd':'dn','m':'mn','s':'sn','a':'an','k':'kn',
	}
	var parseBookPageNumber=function(bkpg,version) {
		version=version||'V';
		for (var i in replacetbl) {
			bkpg=bkpg.replace(i,replacetbl[i]);
		};
		bkpg=bkpg.replace(/ /g,'');
		var res=bkpg.split('.');
		var pg4='000'+res[1];
		pg4=pg4.substring(pg4.length-4);
		var vricstbkpg=bkpg[2]+'.'+ pg4;
		if (res.length!=2) return {};
		return {bkid:res[0], pg:res[1],bkpg:vricstbkpg};
	}

	var getSuttaInfo=function(opts,callback) {
		//TODO , find other version
		callback(opts);
	}
	var findReadunit=function(opts,callback) {
		selectors=["book[id="+opts.bk+']',
		           "pb."+opts.version+'['+opts.attribute+'='+opts.pb+']' ];
		opts.yase.findTagBySelectors({db:opts.db,selectors:selectors},
			function(err,data){
				var slot=data[data.length-1].slot;
				opts.yase.closestTag({db:opts.db,tag:opts.readunit,slot:slot},
					function(err,data2){
						callback(data2[0]);
					})
			})
	}

	var API={
		parseBookPageNumber:parseBookPageNumber,
		getSuttaInfo:getSuttaInfo,
		findReadunit:findReadunit,
	};
	return API;
});