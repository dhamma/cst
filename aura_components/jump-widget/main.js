define(['underscore','backbone','text!./text.tmpl','text!../config.json'], 
  function(_,Backbone,template,config) {
  return {
    type: 'Backbone',
    events: {

    },

    render:function() {
      this.html(_.template(template,{}) );
    },
  

    model:new Backbone.Model(),
    initialize: function() {
      this.config=JSON.parse(config);
      this.db=this.config.db;
      this.render();
    }
  };
});
