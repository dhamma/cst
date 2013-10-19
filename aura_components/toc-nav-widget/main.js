define(['underscore','backbone','../js/cstinfo'
  ,'text!./template.tmpl','text!../config.json'], 
  function(_,Backbone,cstinfo,template,config) {
  return {
    type: 'Backbone',
    events: {

    },
    gotosource:function(opts) {
      /* check multiple call to closed tab*/
      var that=this;
      var readunitprefix=this.config.readunit;
      readunitprefix=readunitprefix.substring(0,readunitprefix.length-1);
      var paragraphunitprefix=this.config.paragraphunit;
      paragraphunitprefix=paragraphunitprefix.substring(0,paragraphunitprefix.length-1);

      var opts2={db:opts.db,yase:this.sandbox.yase,
        slot:opts.slot,paragraphunit:this.config.paragraphunit};
        cstinfo.slot2paragraph(opts2,function(data){
          var address=data.value.split('.');
          var start=address[0];
          var pn=address[1];
          scrollto=paragraphunitprefix+'='+pn+']';
          var texts=[{db:opts.db,start:readunitprefix+'='+start+']'}];
          var opts3={texts:texts,scrollto:scrollto,name:start,tofind:opts.tofind}
          that.sandbox.emit("newreader",opts3);
      })  
    },     
    render:function() {
      this.html(_.template(template,{}) );
      var that=this;
      setTimeout(function(){//to display toc
        that.sandbox.emit("init",{db:that.config.db,toc:that.config.toc});  
      },200)
      
    },
    model:new Backbone.Model(),
    initialize: function() {
      this.config=JSON.parse(config);
      this.render();
      this.sandbox.on("gotosource",this.gotosource,this);      
    }
  };
});
