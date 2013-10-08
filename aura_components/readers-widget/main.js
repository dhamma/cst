define(['underscore','backbone','text!./text.tmpl','text!../config.json'], 
  function(_,Backbone,template,config) {
  return {
    type: 'Backbone',
    newreader:function(opts) {
      var opts={"widget":"text-widget","focus":true,"text":"abc"};
      this.sandbox.emit("newtab",opts);
    },
    model:new Backbone.Model(),
    initialize: function() {
      this.config=JSON.parse(config);
      this.db=this.config.db;
      this.sandbox.on('newreader',this.newreader,this);
    }
  };
});
