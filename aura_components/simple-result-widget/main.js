define(['underscore','backbone','../js/cstinfo',
  'text!./text.tmpl','text!../config.json'], 
  function(_,Backbone,cstinfo,template,config) {
  return {
    type: 'Backbone',
    events: {

    },
    model:new Backbone.Model(),
    resize:function() {
      $el=this.$el;
      var height=$el.parent().height();
      while (height<20) {
        $el=$el.parent();
        if (!$el) break;
        height=$el.height();
      }

      this.$el.height(height);
      this.sandbox.emit("resize."+this.groupid,this);
    },

    gotosource:function(db,slot) {
      /* check multiple call to closed tab*/
      var that=this;
      var readunitprefix=this.config.readunit;
      readunitprefix=readunitprefix.substring(0,readunitprefix.length-1);
      var paragraphunitprefix=this.config.paragraphunit;
      paragraphunitprefix=paragraphunitprefix.substring(0,paragraphunitprefix.length-1);

      var opts={db:db,yase:this.sandbox.yase,
        slot:slot,paragraphunit:this.config.paragraphunit};
        cstinfo.slot2paragraph(opts,function(data){
          that.sandbox.emit("newreader")
          var address=data.value.split('.');
          var start=address[0];
          var pn=address[1];
          scrollto=paragraphunitprefix+'='+pn+']';
          var texts=[{db:db,start:readunitprefix+'='+start+']'}];
          that.sandbox.emit("newreader",texts,start, scrollto);
      })  
    },
    init:function(opts) {
      var that=this;
      this.groupid='G'+Math.round((Math.random()*1000000));
      this.html( _.template(template,{groupid:this.groupid}));
      setTimeout(function(){
        that.sandbox.emit("init."+that.groupid,opts);
      },200);
      this.resize();
    },
    finalize:function() {
      this.sandbox.emit("finalize."+this.groupid);
      this.sandbox.off("resize",this.resize);
      this.sandbox.off("gotosource",this.gotosource);
      //finalized all subwidget
    },
    initialize: function() {
      this.config=JSON.parse(config);
      this.viewid="."+this.$el.data('viewid');
      this.sandbox.once("init"+ this.viewid,this.init,this);
      this.sandbox.on("resize",this.resize,this);
      this.sandbox.on("gotosource"+ this.viewid,this.gotosource,this);
      this.sandbox.once("finalize"+ this.viewid,this.finalize,this);
      this.sandbox.emit("initialized"+this.viewid);
    }
  };
});
