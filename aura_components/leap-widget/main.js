/*
TODO
  support partial search of sutta name
*/
define(['underscore','backbone','text!./text.tmpl',
  'text!./info.tmpl','text!../config.json',
  '../js/cstinfo','../js/readunit.js','../js/tipitakacustom',], 
  function(_,Backbone,template,infotemplate,config,cstinfo,suttanames,custom) {
  return {
    type: 'Backbone',
    events: {
      "input #pagenumber":"findpagenumber",
      "click .btnversion":"findpagenumber2",
      "click #pagenumbersample":"pagenumbersample",
      "click #copydata":"copybuttondata",
      "input .findid":"inputid",
      "input #suttaname":"inputsuttaname",
      "click #clearsuttaname":"clearsuttaname"
    },
    clearsuttaname:function() {
      this.$el.find("#suttaname").val("").focus();
    },
    inputsuttaname:function(e) {
      var name=this.$el.find("#suttaname").val();
      sname=custom.simplifiedToken(name);
      if (sname!=name) this.$el.find("#suttaname").val(sname);
      this.goid(suttanames[sname]);
    },

    inputid:function(e) {
      var $e=$(e.target);
      var that=this;
      var val=$e.val();
      var type=$e.data("type");
      if (this.timer) clearTimeout(this.timer);
      this.timer=setTimeout(function(){that.goid(val,type)},300);
    },
    goid:function(id,type) {
      var that=this;
      type=type||"pid";
      var opts={};
      opts.db=this.db;opts.yase=that.sandbox.yase;
      opts.id=id;
      opts.readunit=this.config.readunit;
      opts.idtype=this.config.idtype[type];
      if (id[0]=='a' && type=='sid') opts.idtype=this.config.idtype['pid'];;
      cstinfo.findid( opts, function(data) {
          data.db=opts.db;
          data.yase=opts.yase;
          data.pagebreaks=that.config.pagebreaks;
          cstinfo.getSuttaInfo(data,function(data2){
              that.model.set("suttainfo",data2);
          })
      })
    },
    copybuttondata:function(e) {
      $e=$(e.target);
      var clipboard = require('nw.gui').Clipboard.get();
      if (!clipboard) {$e.hide();return};
      oldlabel=$e.html();
      clipboard.set($e.data('data'),'text');
      $e.html('Copies!');
      setTimeout( function() {
        $e.html(oldlabel)
      },2000);

    },
    pagenumbersample:function() {
      this.$el.find("input#pagenumber").val("m1.229");
      this.findpagenumber();
    },
    findpagenumber2:function() { //wait for class set active
      var that=this;
      setTimeout(function(){that.findpagenumber()},1);
    },
    findpagenumber:function() {
      var val=this.$el.find("input#pagenumber").val();
      if (!val)return;
      var version=this.$el.find('label.active input[name="version"]').data('versionid');
      var bkp=cstinfo.parseBookParagraph(val, version);
      var attribute=this.config.pagebreak.match(/\[(.*?)\]/)[1] || 'n';
      var that=this;
      var opts={db:this.db,readunit:this.config.readunit,yase:this.sandbox.yase,
                bk:bkp.bk,pb:bkp.bkp,version:version,attribute:attribute};
      cstinfo.findReadunit(opts,function(data){
        data.db=that.db;data.yase=that.sandbox.yase;
        data.pagebreaks=that.config.pagebreaks;
        cstinfo.getSuttaInfo(data,function(data2){
          that.model.set("suttainfo",data2);
        })
      });
    },
    updateinfo:function() {
      var suttainfo=this.model.get("suttainfo");
      if (!suttainfo.slot) {
        this.$el.find("#suttainfo").html("not found");
      }
      var scrollto="";
      if (suttainfo.p && suttainfo.p.value)
        scrollto='p[n='+suttainfo.p.value.split('.')[1]+']';
      this.sandbox.emit("dbslotselected",{slot:suttainfo.slot,scrollto:scrollto});
      this.$el.find("#suttainfo").html(_.template(infotemplate,suttainfo) );
    },
    renderdatalist:function() {
      var candidates=[];
      for (var i in suttanames) {
          candidates.push('<option value="'+i+'">'+
            suttanames[i]+'</option>')
        }
      this.$el.find("#suttanames").html(candidates.join(""));

    },
    render:function() {
      this.html(_.template(template,{}) );
      this.renderdatalist();
    },

    model:new Backbone.Model(),
    initialize: function() {
      this.config=JSON.parse(config);
      this.db=this.config.db;
      this.model.on("change:suttainfo",this.updateinfo,this);
      this.render();
    }
  };
});
