define(['underscore','backbone','text!./text.tmpl',
  'text!./info.tmpl','text!../config.json',
  '../js/cstinfo'], 
  function(_,Backbone,template,infotemplate,config,cstinfo) {
  return {
    type: 'Backbone',
    events: {
      "input #pagenumber":"findpagenumber",
      "click .btnversion":"findpagenumber2",
      "click #pagenumbersample":"pagenumbersample",
      "click #copydata":"copybuttondata",
      "input #address":"inputaddress"
    },
    inputaddress:function(e) {
      var $e=$(e.target);
      var that=this;
      var address=$e.val();
      if (this.addresstimer) clearTimeout(this.addresstimer);
      this.addresstimer=setTimeout(function(){that.goaddress(address)},300);
    },
    goaddress:function(address) {
      var that=this;
      var opts={};
      opts.db=this.db;opts.yase=that.sandbox.yase;
      opts.address=address;
      opts.readunit=this.config.readunit;
      opts.paragraph=this.config.paragraph;
      cstinfo.findAddress( opts, function(data) {
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
      var bkpg=cstinfo.parseBookPageNumber(val, version);
      var attribute=this.config.pagebreak.match(/\[(.*?)\]/)[1] || 'n';
      var that=this;
      var opts={db:this.db,readunit:this.config.readunit,yase:this.sandbox.yase,
                bk:bkpg.bkid,pb:bkpg.bkpg,version:version,attribute:attribute};
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
    render:function() {
      this.html(_.template(template,{}) );
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
