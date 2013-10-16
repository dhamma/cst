define(['underscore','backbone','text!./template.tmpl','text!../config.json'], 
  function(_,Backbone,template,config) {
  return {
    type: 'Backbone',
    events: {

    },
    render:function() {
      this.html(_.template(template,{}) );
      var that=this;
      setTimeout(function(){//to display toc
        that.sandbox.emit("buildtoc",{db:that.config.db,toc:that.config.toc});  
      },200)
      
    },
    model:new Backbone.Model(),
    initialize: function() {
      this.config=JSON.parse(config);
      this.render();
    }
  };
});
