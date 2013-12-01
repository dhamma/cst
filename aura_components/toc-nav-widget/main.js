define(['underscore','backbone','../js/cstinfo'
  ,'text!./template.tmpl','text!../config.json'], 
  function(_,Backbone,cstinfo,template,config) {
  return {
    type: 'Backbone.nested',
    events: {

    },
    commands:{
      "gotosource":"gotosource",
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
          var texts=[{db:opts.db,start:readunitprefix+'='+start+']'}];
          var opts3={texts:texts,scrollto:scrollto,name:start,
            tofind:opts.tofind,searchtype:opts.searchtype}
          that.sandbox.emit("newreader",opts3);
      })  
    },     
    render:function() {
      this.html(_.template(template,{}) );
      var promise=this.addChildren();
      var opts={db:this.config.db,toc:this.config.toc};
      promise.done(function(){
        this.sendChildren("settoc",);
      })
    },
    model:new Backbone.Model(),
    initialize: function() {
      this.initNested();
      this.config=JSON.parse(config);
      this.render();
    }
  };
});
