define(['underscore','backbone','text!./text.tmpl','text!../config.json'], 
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
      var viewid='V'+Math.round((Math.random()*1000000));
      this.html( _.template(template,{viewid:viewid,groupid:this.groupid}));
      setTimeout(function(){
        that.sandbox.emit("init."+viewid,opts);
        that.sandbox.emit("buildtoc."+that.groupid,opts);
      },200);
      this.resize();
    },
    initialize: function() {
      this.sandbox.once("init."+this.$el.data('viewid'),this.init,this);
      this.sandbox.on("resize",this.resize,this);
    }
  };
});
