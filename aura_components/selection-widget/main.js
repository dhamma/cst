define(['underscore','backbone','text!./selaction.tmpl','text!../config.json'], 
  function(_,Backbone,template,config) {
  return {
    type: 'Backbone',
    events: {
    	
    },
    render:function() {
      var sel=this.model.get("selection")
      this.html(_.template(template,{ value:sel||""}) );
    },
    fetchlink:function(db,pid) {
    //  this.sandbox.yase.findTag({db:db,selector:'p[n='+pid+']'},
      this.sandbox.yase.getTextByTag({db:db,tag:'p',attribute:'n',value:pid},
        function(err,data){
          console.log(data.text)

      })
    },
    getpid:function(range) {
      var ele=range.startContainer.parentElement;
      while (ele && ele.tagName!='SPAN') ele=ele.parentElement;
      if (!ele)return;
      var slot=parseInt(ele.attributes['data-slot'].value);
      //console.log(slot)
      // tag:'p', attributes:['n'] might return undefined,
      //p[n] will try until p has n 
      var that=this;
      this.sandbox.yase.closestTag({db:this.db,tag:'p[n]',slot:slot},function(err,data){
        that.fetchlink('vriatt',data[0].value);
      })
    },

    checkselection:function() {
      var sel=window.rangy.getSelection().toString();
      if (sel && sel!=this.model.get('selection')) {
        this.model.set("selection",sel);
        this.getpid(window.rangy.getSelection()._ranges[0]);
        this.render();  
      }
    },
    model:new Backbone.Model(),
    initialize: function() {
      var that=this;

      config=JSON.parse(config);
      console.log(config.preload)
      this.db=config.db;
      this.render();
      setInterval(function(){
        that.checkselection();
      },500)
    }
  };
});
