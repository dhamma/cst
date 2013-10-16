define(['underscore','backbone','text!./text.tmpl','text!../config.json'], 
  function(_,Backbone,template,config) {
  return {
    type: 'Backbone',
    events: {

    },
    model:new Backbone.Model(),
    init:function(opts) {
      var that=this;
      var viewid='I'+Math.round((Math.random()*1000000));
      this.html( _.template(template,{viewid:viewid}));
      setTimeout(function(){
        that.sandbox.emit("init."+viewid,opts);
      },100);
    },
    initialize: function() {
      this.sandbox.once("init."+this.$el.data('viewid'),this.init,this);
    }
  };
});
