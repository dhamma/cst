
define(['underscore','backbone','text!./template.tmpl','text!../config.json'], 
  function(_,Backbone,template,config) {
  return {
    type: 'Backbone', 
    events: {
      "click .diacritictoken":"diacritictokenclick",
      "click .inputcandidate":"diacritictokenclick",
      "keyup #tofind":"checkenter",
      "click .openresult":"openresult",
      "click #cleartofind":"cleartofind",
      "click .btnexample":"setexample"
    },
    setexample:function(e) {
      $e=$(e.target);
      this.sandbox.emit("boolsearch.setexample",$e.data('query'));
    },
    tofind2string:function(q) {
      var out="",OP={"followby":"@","notfollowby":"@!","nearby":"~","nearby":"~!"};
      for (var i=0;i<q.length;i++) {
        if (typeof q[i]=='string') {
          out+=OP[q[i]];
        } else {
          out+=q[i].join("|")+',';
        }
      }
      return out;
    },
    openresult:function(e) {
      $e=$(e.target);
      if (!parseInt($e.html())) return;
      var db=$e.data('db');

      var tofind=this.model.get("tofind");
      var distance=this.model.get("distance");
      var opts={};
      opts.tabsid='maintabs';
      opts.widget='simple-result-widget';
      opts.focus=true;
      
      //pass to init of sub-widget
      opts.extra={db:db,tofind:tofind,distance:distance,searchtype:"boolSearch",
                  pagebreak:this.config.pagebreak,
                  toc:this.config.toc,hidenohit:true};
      opts.name=this.tofind2string(tofind);
      this.sandbox.emit("newtab",opts);
    },
    checkenter:function(e) {
      if (e.keyCode!=13) return;
      if (this.hitcount) this.openresult();
    },
    showhitcount:function(res,db) {
      var count=res.count;
      $div=this.$el.find("#matchcount_"+db);
      $div.html(count);
        
      if (db==this.db) {
        this.hitcount=count;
      }
      if (count) {
        $div.addClass('label-success');
        $div.removeClass('label-danger');
      } else {
        $div.addClass('label-danger');
        $div.removeClass('label-success');
      }      
    },
    gethitcount:function() {
      var that=this;
      var tofind=this.model.get("tofind");
      var distance=this.model.get("distance");
      var opts={db:this.config.db,tofind:tofind,distance:distance,countonly:true};
      this.sandbox.yase.boolSearch(opts,function(err,data){
        that.showhitcount(data,that.config.db);
      });

      for (var i in this.config.linkdb) {
        var opts={db:this.config.linkdb[i],tofind:tofind,distance:distance,countonly:true};
        this.sandbox.yase.boolSearch(opts,
          (function(db) {
            return function(err,data){
             that.showhitcount(data,db);
            }
          })(opts.db)
        );
      }
    },
    newquery:function(tofind,distance) {
      if (!tofind) return;
      if (!tofind.length) return;
      this.model.set("tofind",tofind);
      this.model.set("distance",distance);
      this.gethitcount();
    },
    render:function() {
      this.html(_.template(template,{ value:this.options.value||""}) );
    },
    initialize: function() {
     	this.render();
      var that=this;
      this.model=new Backbone.Model();
      this.config=JSON.parse(config);
      this.db=this.config.db;
      this.sandbox.on("newboolquery",this.newquery,this);

    }
  };
});