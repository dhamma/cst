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
      this.sandbox.emit("resize."+this.groupid,this);
    },


    init:function(opts) {
      var that=this;
      this.groupid='G'+Math.round((Math.random()*1000000));
      this.html( _.template(template,{groupid:this.groupid}));
      setTimeout(function(){
        that.sandbox.emit("init."+that.groupid,opts);
      },200);
      this.resize();
    },
    finalize:function() {
      this.sandbox.emit("finalize."+this.groupid);
      this.sandbox.off("resize",this.resize);
      //finalized all subwidget
    },
    initialize: function() {
      this.config=JSON.parse(config);
      this.viewid="."+this.$el.data('viewid');
      this.sandbox.once("init"+ this.viewid,this.init,this);
      this.sandbox.on("resize",this.resize,this);
      this.sandbox.once("finalize"+ this.viewid,this.finalize,this);
      this.sandbox.emit("initialized"+this.viewid);
    }
  };
});
