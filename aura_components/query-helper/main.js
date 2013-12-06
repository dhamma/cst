define(['underscore','backbone','text!./template.tmpl'], 
  function(_,Backbone,template) {
  return {
    type: 'Backbone.nested',
    events: {

    },
    commands:{
      "setdb":"setdb",
      "setrank":"setrank",
      "query.change":"querychange"
    },
    querychange:function(opts) {
      this.sendChildren("query.change",opts);
    },
    setdb:function(db) {
      this.sendParent("setdb",db);
    },
    setrank:function(rank) {
      this.sendParent("setrank",rank);
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
