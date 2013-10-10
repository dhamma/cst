define(['underscore','backbone','text!./text.tmpl',
  'text!./info.tmpl','text!../config.json',
  '../js/cstinfo'], 
  function(_,Backbone,template,infotemplate,config,cstinfo) {
  return {
    type: 'Backbone',
    events: {
      "input #pagenumber":"findpagenumber",
      'click input[name="version"]':"findpagenumber",
      "click #pagenumbersample":"pagenumbersample"
    },
    pagenumbersample:function() {
      this.$el.find("input#pagenumber").val("m1.219");
      this.findpagenumber();
    },
    findpagenumber:function() {
      var val=this.$el.find("input#pagenumber").val();
      var version=this.$el.find('label.active input[name="version"]').data('versionid');
      var bkpg=cstinfo.parseBookPageNumber(val, version);
      var attribute=this.config.pagebreak.match(/\[(.*?)\]/)[1] || 'n';
      var that=this;
      var opts={db:this.db,readunit:this.config.readunit,yase:this.sandbox.yase,
                bk:bkpg.bkid,pb:bkpg.bkpg,version:version,attribute:attribute};
      cstinfo.findReadunit(opts,function(data){
        data.db=that.db;data.yase=that.sandbox.yase;
        cstinfo.getSuttaInfo(data,function(err,data2){
          that.model.set(data2);
        })
      });
    },
    updateinfo:function() {
      var suttainfo=this.model.get("suttainfo")
      this.$el.find("suttainfo").html(_.template(infotemplate,suttainfo) );

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
