define(['underscore','backbone','text!./text.tmpl'], 
  function(_,Backbone,template) {
  return {
    type: 'Backbone.nested',
    events: {

    },
    commands:{
      "settext":"settext"
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

      yase.closestTag({db:this.db,tag:['readunit[id]','p[n]'],slot:start},function(err,data){
        var sutraid=data[0][0].value;
        var pn=data[0][1].value;
        yase.getTextByTag({db:that.db, tag:'readunit',attribute:'id',value:sutraid},function(err,data2){
          that.html(_.template(template,data2) );
          that.scrollpara("p[n="+pn+"]",0);
        })
      })
    },
    scrollpara:function(scrollto, offset) {
      this.$el.scrollTop(0);
      var scrolltop=this.$el.find(scrollto).offset() || {top:offset};
      scrolltop.top-=offset;
      var that=this;
      this.$el.scrollTop(scrolltop.top);
    },    
    onAdd:function(extra) {
      this.db=extra.db;
      this.gotoline(extra.start);
    },
    model:new Backbone.Model(),
    initialize: function() {
      this.initNested();
      $(window).resize( _.bind(this.resize,this) );
    }
  };
});
