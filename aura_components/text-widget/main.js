define(['underscore','backbone','text!./text.tmpl','text!../config.json'], 
  function(_,Backbone,template,config) {
  return {
    type: 'Backbone',
    events: {

    },
    resize:function(){
      parentheight=this.$el.parent().height();
      if (!parentheight) parentheight=this.$el.parent().parent().height();
      this.$el.css("height", (parentheight) +"px");      
    },
    settext:function(text) {
      this.html(_.template(template,{text:text}) );
    },
    gotoline:function(start,end) {
      var that=this;
      //console.log('goto',start);
      if (end>start+300) end=start+300;
      var yase=this.sandbox.yase;

      yase.closestTag({db:this.db,tag:'readunit[id]',slot:start},function(err,data){
        var sutraid=data[0].value;
        yase.getTextByTag({db:that.db, tag:'readunit',attribute:'id',value:sutraid},function(err,data2){
          that.html(_.template(template,data2) );
        })
      })
    },

    model:new Backbone.Model(),
    initialize: function() {
      $(window).resize( _.bind(this.resize,this) );
      this.config=JSON.parse(config);
      this.db=this.config.db;

      this.sandbox.on('settext.'+this.options.viewid,this.settext,this);
    }
  };
});