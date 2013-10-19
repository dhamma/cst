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
	var parseBookParagraph=function(bkp,version) {
		version=version||'V';
		for (var i in replacetbl) {
			bkp=bkp.replace(i,replacetbl[i]);
		};
		bkp=bkp.replace(/ /g,'');
		var res=bkp.split('.');
		var p4='000'+res[1];
		p4=p4.substring(p4.length-4);
		var vricstbkp=bkp[2]+'.'+ p4;
		if (res.length!=2) return {};
		return {bk:res[0], p:parseInt(res[1],10),bkp:vricstbkp};
	}
	var versionname={'pb.V':'VRI','pb.T':'Thai','pb.M':'Burmese','pb.P':'PTS'}
	var getSuttaInfo=function(opts,callback) {
		if (!opts.slot) callback({});
		var tags=JSON.parse(JSON.stringify(opts.pagebreaks));
		tags.push('nikaya');
		tags.push('p[n]');
		opts.yase.closestTag({db:opts.db,tag:tags,slot:opts.slot+1},
			function(err,data) {
				opts.p=data[0].pop();
				opts.nikaya=data[0].pop().head;
				opts.pagebreaks=data[0];
				for (var i in opts.pagebreaks) {
					opts.pagebreaks[i].humanname=versionname[opts.pagebreaks[i].name];
				}
				callback(opts);
		});
	}
	var findid=function(opts,callback) {
		var selectors=[];
		var v=opts.id.split('.');
		
		selectors.push(opts.readunit.substring(0,opts.readunit.length-1)+'='+v[0]);
		if (v.length==2) {
			selectors.push(opts.idtype.substring(0,opts.idtype.length-1)+'='+opts.id);
		} else {
			selectors.push(opts.idtype);
		}
		opts.yase.findTagBySelectors({db:opts.db, selectors:selectors},function(err,data){
			var r=data[data.length-1];
			if (!r.head) r.head=data[0].head;
			callback(r);
		})
	}

	var slot2paragraph=function(opts,callback) {
		var tags=[opts.paragraphunit];
		opts.yase.closestTag({db:opts.db,tag:tags,slot:opts.slot},
		function(err,data2){
			callback(data2[0]);
		});
	}

	var findReadunit=function(opts,callback) {
		selectors=["book[id="+opts.bk+']',
		           "pb."+opts.version+'['+opts.attribute+'='+opts.pb+']'
		          ];
		opts.yase.findTagBySelectors({db:opts.db,selectors:selectors},
			function(err,data){
				var slot=data[data.length-1].slot;
				opts.yase.closestTag({db:opts.db,tag:opts.readunit,slot:slot},
					function(err,data2){
						var res=data2[0];
						res.slot=slot; //use slot of pb
						callback(res);
					})
			})
	}

	var bp2g=[
		["dn1",1,"d1"],	["dn1",150,"d2"],["dn1",254,"d3"],["dn1",300,"d4"],
		["dn1",323,"d5"],["dn1",359,"d6"],["dn1",378,"d7"],["dn1",381,"d8"],
		["dn1",406,"d9"],["dn1",444,"d10"],["dn1",481,"d11"],["dn1",501,"d12"],["dn1",518,"d13"],
		["dn2",1,"d14"],["dn2",95,"d15"],["dn2",131,"d16"],["dn2",241,"d17"],["dn2",273,"d18"],
		["dn2",293,"d19"],["dn2",331,"d20"],["dn2",344,"d21"],["dn2",372,"d22"],["dn2",406,"d23"],
		["dn3",1,"d24"],["dn3",49,"d25"],["dn3",80,"d26"],["dn3",111,"d27"],["dn3",141,"d28"],
		["dn3",164,"d29"],["dn3",198,"d30"],["dn3",242,"d31"],["dn3",275,"d32"],["dn3",296,"d33"],["dn3",350,"d34"],
		["mn1",1,"m1"],["mn1",14,"m2"],["mn1",29,"m3"],["mn1",34,"m4"],["mn1",57,"m5"],["mn1",64,"m6"],
		["mn1",70,"m7"],["mn1",81,"m8"],["mn1",89,"m9"],["mn1",105,"m10"],["mn1",139,"m11"],["mn1",146,"m12"],
		["mn1",163,"m13"],["mn1",175,"m14"],["mn1",181,"m15"],["mn1",185,"m16"],["mn1",190,"m17"],
		["mn1",199,"m18"],["mn1",206,"m19"],["mn1",216,"m20"],["mn1",222,"m21"],["mn1",234,"m22"],
		["mn1",249,"m23"],["mn1",252,"m24"],["mn1",261,"m25"],["mn1",272,"m26"],["mn1",288,"m27"],
		["mn1",300,"m28"],["mn1",307,"m29"],["mn1",312,"m30"],["mn1",325,"m31"],["mn1",332,"m32"],
		["mn1",346,"m33"],["mn1",350,"m34"],["mn1",353,"m35"],["mn1",364,"m36"],["mn1",390,"m37"],
		["mn1",396,"m38"],["mn1",415,"m39"],["mn1",435,"m40"],["mn1",439,"m41"],["mn1",444,"m42"],
		["mn1",449,"m43"],["mn1",460,"m44"],["mn1",468,"m45"],["mn1",473,"m46"],["mn1",487,"m47"],
		["mn1",491,"m48"],["mn1",501,"m49"],["mn1",506,"m50"],
		["mn2",1,"m51"],["mn2",17,"m52"],["mn2",22,"m53"],["mn2",31,"m54"],["mn2",51,"m55"],
		["mn2",56,"m56"],["mn2",78,"m57"],["mn2",83,"m58"],["mn2",88,"m59"],["mn2",92,"m60"],
		["mn2",107,"m61"],["mn2",113,"m62"],["mn2",122,"m63"],["mn2",129,"m64"],["mn2",134,"m65"],
		["mn2",148,"m66"],["mn2",157,"m67"],["mn2",166,"m68"],["mn2",173,"m69"],["mn2",174,"m70"],["mn2",185,"m71"],
		["mn2",187,"m72"],["mn2",193,"m73"],["mn2",201,"m74"],["mn2",207,"m75"],["mn2",223,"m76"],
		["mn2",237,"m77"],["mn2",260,"m78"],["mn2",269,"m79"],["mn2",278,"m80"],["mn2",282,"m81"],
		["mn2",293,"m82"],["mn2",308,"m83"],["mn2",317,"m84"],["mn2",324,"m85"],["mn2",347,"m86"],
		["mn2",353,"m87"],["mn2",358,"m88"],["mn2",364,"m89"],["mn2",375,"m90"],["mn2",383,"m91"],
		["mn2",396,"m92"],["mn2",401,"m93"],["mn2",412,"m94"],["mn2",422,"m95"],["mn2",436,"m96"],
		["mn2",445,"m97"],["mn2",454,"m98"],["mn2",462,"m99"],["mn2",473,"m100"],
		["mn3",1,"m101"],["mn3",21,"m102"],["mn3",34,"m103"],["mn3",41,"m104"],["mn3",55,"m105"],
		["mn3",66,"m106"],["mn3",74,"m107"],["mn3",79,"m108"],["mn3",85,"m109"],["mn3",91,"m110"],
		["mn3",93,"m111"],["mn3",98,"m112"],["mn3",105,"m113"],["mn3",109,"m114"],["mn3",124,"m115"],
		["mn3",133,"m116"],["mn3",136,"m117"],["mn3",144,"m118"],["mn3",153,"m119"],["mn3",160,"m120"],
		["mn3",176,"m121"],["mn3",185,"m122"],["mn3",197,"m123"],["mn3",209,"m124"],["mn3",213,"m125"],
		["mn3",223,"m126"],["mn3",229,"m127"],["mn3",236,"m128"],["mn3",246,"m129"],["mn3",261,"m130"],
		["mn3",272,"m131"],["mn3",276,"m132"],["mn3",279,"m133"],["mn3",286,"m134"],["mn3",289,"m135"],
		["mn3",298,"m136"],["mn3",304,"m137"],["mn3",313,"m138"],["mn3",323,"m139"],["mn3",342,"m140"],
		["mn3",371,"m141"],["mn3",376,"m142"],["mn3",383,"m143"],["mn3",389,"m144"],["mn3",395,"m145"],
		["mn3",398,"m146"],["mn3",416,"m147"],["mn3",420,"m148"],["mn3",428,"m149"],["mn3",434,"m150"],["mn3",438,"m151"],["mn3",453,"m152"],
		["sn1",1,"s1"],	["sn1",82,"s2"],["sn1",112,"s3"],["sn1",137,"s4"],["sn1",162,"s5"],
		["sn1",172,"s6"],["sn1",187,"s7"],["sn1",209,"s8"],["sn1",221,"s9"],["sn1",235,"s10"],["sn1",247,"s11"],
		["sn2",1,"s12"],["sn2",74,"s13"],["sn2",85,"s14"],["sn2",124,"s15"],["sn2",144,"s16"],
		["sn2",157,"s17"],["sn2",188,"s18"],["sn2",202,"s19"],["sn2",223,"s20"],["sn2",235,"s21"],
		["sn3",1,"s22"],["sn3",160,"s23"],["sn3",206,"s24"],["sn3",302,"s25"],["sn3",312,"s26"],
		["sn3",322,"s27"],["sn3",332,"s28"],["sn3",342,"s29"],["sn3",392,"s30"],["sn3",438,"s31"],
		["sn3",550,"s32"],["sn3",607,"s33"],["sn3",662,"s34"],
		["sn4",1,"s35"],["sn4",249,"s36"],["sn4",280,"s37"],["sn4",314,"s38"],["sn4",330,"s39"],
		["sn4",332,"s40"],["sn4",343,"s41"],["sn4",353,"s42"],["sn4",366,"s43"],["sn4",410,"s44"],
		["sn5",1,"s45"],["sn5",182,"s46"],["sn5",367,"s47"],["sn5",471,"s48"],["sn5",651,"s49"],
		["sn5",705,"s50"],["sn5",813,"s51"],["sn5",899,"s52"],["sn5",923,"s53"],["sn5",977,"s54"],
		["sn5",997,"s55"],["sn5",1071,"s56"],
		["an1",1,"a1"],	["an2",1,"a2"],	["an3",1,"a3"],	["an4",1,"a4"],	["an5",1,"a5"],	["an6",1,"a6"],
		["an7",1,"a7"],	["an8",1,"a8"],	["an9",1,"a9"],	["an10",1,"a10"],	["an11",1,"a11"]
	]

	var bookpn2group=function(bp) {
		var pgroup="";
		for (var i=0;i<bp2pn.length;i++ ) {
			if (bp2g[i][0]!=bp.bk) {
				if (pgroup) break;
				else continue;
			}
			if (bp.p>=bp2g[i][1]) {
				pgroup=bp2g[i][2];
			}
		}
		return pgroup;
		//convert book-paragraph to 
	}
	var pattern=[
	/(dī\. ni\. \d+\.\d+)/g,
	/(a\. ni\. \d+\.\d+)/g,
	/(saṃ\. ni\. \d+\.\d+)/g,
	/(m\. ni\. \d+\.\d+)/g,
//	/(ni\. \d+\.\d+)/g,
	];
	var scanlink=function(input,opts){
		var out=[],match=null;
		for (var i in pattern) {
			while (match=pattern[i].exec(input)) {
				//console.log(match[1])
				var bp=parseBookParagraph(match[1]);
				var group=bookpn2group(bp);
				//console.log(address,bp)
				out.push({gpn:group+'.'+bp.p, p:bp.p, group:group})
			}
		}
		return {out:out};
	}	

	var API={
		parseBookParagraph:parseBookParagraph,
		getSuttaInfo:getSuttaInfo,
		findReadunit:findReadunit,
		findid:findid,
		slot2paragraph:slot2paragraph,
		scanlink:scanlink,
	};
	return API;
});