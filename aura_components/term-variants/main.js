define(['underscore','backbone','text!./template.tmpl','text!./candidates.tmpl','text!./expanded.tmpl'], 
  function(_,Backbone,template,candidatetemplate,expandedtemplate) {
  return {
    type: 'Backbone.nested',
    events: {

    },
    commands:{
      "query.change":"querychange"
    }, 
    querychange:function(query,db) {
      if (db) this.db=db;
      this.getTermVariants(query);
      this.getTermVariants(this.getlastword(query));
    },
    removeop:function(val) {
      if (val[val.length-1]=='*') val=val.substring(0,val.length-1);
      return val;
    },
    getlastword:function(query) {
        var endwith=query;
        var lastspace=query.lastIndexOf(" ");
        if (lastspace>-1) {
          endwith=query.substring(lastspace+1);
        }
        return endwith;
    },
    getTermVariants:function(val) {
      val=this.removeop(val);
      var opts={db:this.db,term:val,hit:true};
      var that=this;
      //
      //if (val.length<2) return;
      this.$yase("getTermVariants",opts).done(function(data){
        var $querycandidates=that.$("#querycandidates")
        $querycandidates.html(" ");

        if (!val) return;
        if (data.variants.length!=1)
          that.$("#querycandidates").html(
            _.template(candidatetemplate,{variants:data.variants,more:data.more}));
        
      })
      //need a new opts for web
      var opts={db:this.db,term:val,hit:true,exact:true};
      this.$yase("getTermVariants",opts).done(function(data){
        var $expanded=that.$("#expanded");
        $expanded.html(" ");
        if (!val) return;
        if (data.variants.length>1 || (data.variants.length&&data.variants[0].text!=val))
          $expanded.html(_.template(expandedtemplate,{variants:data.variants}));
      })
    },
    render:function() {
      this.html(_.template(template));
    },
    model:new Backbone.Model(),
    initialize: function() {
      this.render();
    }
  };
});


/*
    replaceends:function(newends) {
      $query=this.$("#query");
      var query=$query.val();
      var ends=this.getlastword(query);
      var query=query.substring(0, query.length-ends.length) +newends+'^ ';
      $query.val(query);
    },

    diacritictokenclick:function(e) {
      $e=$(e.target)
      this.replaceends($e.html());
      this.dosearch();
    },
    
*/