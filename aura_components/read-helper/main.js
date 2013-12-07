define(['underscore','backbone','text!./template.tmpl'], 
  function(_,Backbone,template) {
  return {
    type: 'Backbone.nested',
    events: {

    },
    commands:{
      "selectword":"selectword"
    }, 
    selectword:function(w) {
      this.$("#msg").html("finding <b>"+w+"</b> , no dictionary installed");
    },
    render:function() {
      this.html(_.template(template));
    },
    model:new Backbone.Model(),
    initialize: function() {
      this.render();
    }
  };
});
