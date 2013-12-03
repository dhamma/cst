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
      "result.change":"resultchange",
      "needmore":"needmore",
      "gotosource":"gotosource"
    },
    gotosource:function(opts) {
      this.sandbox.emit("gotosource",opts);
      /*
      var extra={cols:[{db:opts.db,start:opts.slot}],query:opts.query,textwidget:"text-widget@kse"};
      var query=extra.query;

      var opts={widget:"paralleltext-widget@kse",name:query,extra:extra,focus:true};
      this.sandbox.emit("newtab",opts);
      */
    }, 
    needmore:function(start) {
      this.sendParent("needmore",start);
    },
    resultchange:function(R) {
      if (R.opts.start==0) {
        this.sendChildren('newresult',R);
      }
      else this.sendChildren('moreresult',R);
      
    },
    model:new Backbone.Model(),
    render:function() {
      this.html( _.template(template));
    },
    initialize: function() {
      this.render();
    }
  };
});
