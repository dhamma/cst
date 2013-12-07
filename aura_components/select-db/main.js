define(['underscore','backbone','text!./template.tmpl','text!./itemtemplate.tmpl'], 
 function(_,Backbone,template,itemtemplate) {
  return {
   type:"Backbone.nested",
    events: {
      "click input[name='setdb']":"setdb",
       "click input#vsm":"togglerank",
    },
    commands: {
      "setdbhit":"setdbhit",
      "showdb":"showdb"
    },
    togglerank:function(e) {
      var vsm=this.$("input#vsm").attr('checked')?"vsm":"";
      this.sendParent("setrank",vsm);
    },
    setdb:function(e){
      var db=$(e.target).data('db');
      this.sendParent("setdb",db);
    },
    getlocaldb:function(path) {
      var that=this;
      this.$yase("enumLocalYdb").done(function(data) {
        this.model.set("dbs",data);
      });
    }, 
    setdbhit:function(db,hit) {
      hit=hit||0;
      var dbs=this.model.get("dbs");
      dbs[db].hit=hit;
      var hitspan=this.$el.find("input[data-db='"+db+"']").next();
      hitspan.removeClass();
      hitspan.addClass('label');
      hitspan.html(hit);
      if (hit) hitspan.addClass('label-success');
      else hitspan.addClass('label-danger');
    },
    showdb:function() {
      var dbs=this.model.get('dbs')
      if (!dbs) return;
      for (var i in dbs) {
        dbs[i].hit=0;
        dbs[i].extraclass="label-danger";
      }
      this.$("#dbs").html(_.template(itemtemplate,{linebreak:this.linebreak,dbs:dbs}) );
      this.$("#dbs #vrimul input").attr('checked',true);
    } ,   
    render:function() {
      this.html(_.template(template,{rankcheckbox:this.rankcheckbox}));
    },
    initialize: function() {
      this.model=new Backbone.Model();
      this.model.on("change:dbs",this.showdb,this);
      this.linebreak=!!this.options.linebreak;
      this.rankcheckbox=!!this.options.rankcheckbox;
      this.getlocaldb();
      this.render();
    }
  }
});
