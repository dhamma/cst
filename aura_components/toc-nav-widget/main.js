define(['underscore','backbone','text!./template.tmpl','text!../config.json'], 
  function(_,Backbone,template,config) {
  return {
    type: 'Backbone',
    events: {
      "click #opentext":"opentext"
    },
    opentext:function(e) {
      var slot=this.model.get("slot");
      this.sandbox.emit("newreader",{slot:slot});
    },
    render:function() {
      this.html(_.template(template,{}) );
    },
    setslot:function(slot) {
      this.model.set("slot",slot);
    },
    model:new Backbone.Model(),
    initialize: function() {
      this.config=JSON.parse(config);
      this.sandbox.on("setslot",this.setslot,this);
      this.render();
    }
  };
});
