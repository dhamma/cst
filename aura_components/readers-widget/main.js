define(['underscore','backbone','text!./text.tmpl','text!../config.json'], 
  function(_,Backbone,template,config) {
  return {
    type: 'Backbone',
    newreader:function(opts) {
      var that=this;
      var yase=this.sandbox.yase;
      yase.closestTag({db:this.db,tag:'readunit[id]',slot:opts.slot},function(err,data){
        var sutraid=data[0].value;
        yase.getTextByTag({db:that.db, tag:'readunit',attribute:'id',value:sutraid},function(err,data2){
          opts.widget="text-widget";
          opts.focus=true;
          opts.name=sutraid;
          opts.text=data2.text;
          that.sandbox.emit("newtab",opts);
        })
      })      
    },
    model:new Backbone.Model(),
    initialize: function() {
      this.config=JSON.parse(config);
      this.db=this.config.db;
      this.sandbox.on('newreader',this.newreader,this);
    }
  };
});
