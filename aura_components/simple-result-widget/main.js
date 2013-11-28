/*
  combine close result (within slot distance)
*/
define(['underscore','backbone','text!./template.tmpl'], 
  function(_,Backbone,template) {
  return {
    type: 'Backbone.nested',
    events: {

    },
    commands:{
      "result.change":"resultchange"
    },
    resultchange:function(R) {
      this.sendChildren("result.change",R);
    },
    model:new Backbone.Model(),
    /*
    move to commands
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
  */
    render:function(opts) {
      this.html( _.template(template));
      this.addChildren();
    },
    initialize: function() {
      this.initNested();
      this.render();
    }
  };
});
