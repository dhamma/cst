define(['underscore','backbone','../js/cstinfo'
  ,'text!./template.tmpl','text!../config.json'], 
  function(_,Backbone,cstinfo,template,config) {
  return {
    type: 'Backbone.nested',
    events: {
      "click #open":"open"
    },
    commands:{
      "setdb":"setdb",
      "gotosource":"gotosource",
      "dbslotselected":"dbslotselected",
    },
    setdb:function(db){
      this.db=db;
      this.onReady();
    },
    dbslotselected:function(selected) {
      this.slot=selected.slot;
    },
    open:function() {
      var opts={db:this.db,slot:this.slot};
      this.gotosource(opts)
    },
    gotosource:function(opts) {
      /* check multiple call to closed tab*/
      var that=this;
      var readunitprefix=this.config.readunit;
      readunitprefix=readunitprefix.substring(0,readunitprefix.length-1);
      var paragraphunitprefix=this.config.paragraphunit;
      paragraphunitprefix=paragraphunitprefix.substring(0,paragraphunitprefix.length-1);

      var opts2={db:opts.db,yase:this.sandbox.yase,
        slot:opts.slot,readunit:this.config.readunit,
        paragraphunit:this.config.paragraphunit};
        cstinfo.slot2paragraph(opts2,function(data){
          var address=data.split('.');
          var start=address[0];
          var pn=address[1];
          scrollto=paragraphunitprefix+'='+pn+']';

          var opts3={db:opts.db,start:readunitprefix+'='+start+']'
      ,scrollto:scrollto,name:start,query:opts.query,paramenu:true,textcomponent:that.config.defaulttextwidget}
          that.sandbox.emit("newreader",opts3);
      })  
    },     
    render:function() {
      this.html(_.template(template,{}) );
    },
    onReady:function() {
      var opts={db:this.db,toc:this.config.toc};
      this.sendChildren("settoc",opts);      
    },
    model:new Backbone.Model(),
    initialize: function() {
      this.sandbox.on("gotosource",this.gotosource,this);
      this.config=JSON.parse(config);
      this.db=this.config.db;
      this.render();
    }
  };
});
