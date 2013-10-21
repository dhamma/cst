define(['underscore','backbone',
  'text!./text.tmpl','text!../config.json'], 
  function(_,Backbone,template,config) {
  return {
    type: 'Backbone',
    events: {

    },
    model:new Backbone.Model(),
    resize:function() {
      $el=this.$el;
      var height=$el.parent().height();
      while (height<20) {
        $el=$el.parent();
        if (!$el) break;
        height=$el.height();
      }

      this.$el.height(height);
    },

    load:function(id) {
      //should move init.groupid here , but cannot get opts
    },
    init:function(opts) {
      var that=this;
      this.groupid='G'+Math.round((Math.random()*1000000));
      this.html( _.template(template,{groupid:this.groupid}));

      this.sandbox.on("initialized."+this.groupid,function(id){
        that.sandbox.emit("init."+that.groupid,id,opts);
      },this);
    },
    finalize:function() {
      this.sandbox.emit("finalize."+this.groupid);
      this.sandbox.off("resize",this.resize);

      //how to turn load off?
      //this.sandbox.off("initialized."+this.groupdid,this.load);
      //finalized all subwidget
    },
    initialize: function() {
      this.config=JSON.parse(config);
      this.viewid="."+this.options.id;
      this.sandbox.once("init"+ this.viewid,this.init,this);
      this.sandbox.on("resize",this.resize,this);
      this.sandbox.once("finalize"+ this.viewid,this.finalize,this);
      this.sandbox.emit("initialized"+this.viewid);
    }
  };
});
