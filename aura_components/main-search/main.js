define(['underscore','backbone','text!./template.tmpl'
  ,'text!../config.json'], 
  function(_,Backbone,template,config) {
  return {
    type: 'Backbone.nested', 
    events: {
      "keyup #query":"checkenter",
      "click .openresult":"openresult",
      "click #clearquery":"clearquery",
      "click #prefixwith":"prefixwith",
    },
    commands:{
      "query.change":"querychange",
      "query.done":"querydone",
      "setdb":"setdb",
      "setrank":"setrank",
      "setrange":"setrange",
      "needmore":"needmore"
    },
    setdb:function(db) {
      var query=this.model.get("query");
      this.db=db;
      this.sendChildren("query.change",{query:query,db:db});
    },
    setrank:function(rank) {
      var query=this.model.get("query");
      this.sendChildren("query.change",{query:query,db:this.db,rank:rank});
    },
    setrange:function(start,end) {
      var query=this.model.get("query");
      this.sendChildren("query.change",{query:query,db:this.db,start:start,end:end});
    },
    needmore:function(start) {
      this.sendChildren("more",start);
    },
    querydone:function(res){
      this.sendDescendant("querydone",res);
      if (res.opts.rangestart==0) {
        this.sendDescendant('settoc',{toc:this.config.toc,db:this.db,query:res.query,hidenohit:true});  
      }
      
    },    
    querychange:function(opts){
      opts.db=opts.db||this.db;
      this.model.set("query",opts.query);
      this.sendChildren("query.change",{query:opts.query,db:opts.db});
    },
    prefixwith:function() {
      $query=this.$("#query");
      var val=$query.val().trim();
      val=this.removeop(val);
      $query.val(val+"*");
      this.dosearch();
    },
    clearquery:function() {
      this.$("#query").val("").focus();
      this.dosearch();
    },
    openresult:function(e) {
      $e=$(e.target);
      if (!parseInt($e.html())) return;

      var $i=$e.parent().find('input[name="vriset"]');
      this.selectset({target:$i[0]});
      $i.attr('checked',true);

      var query=this.$("#query").val().trim();
      localStorage.setItem("query.cst",query);
      var opts={};
      opts.tabsid='maintabs';
      opts.widget='simple-result';
      opts.focus=true;
      
      //pass to init of sub-widget
      opts.extra={db:this.db,query:query,
                  pagebreak:this.config.pagebreak,
                  output:["match","texts","sourceinfo"],
                  toc:this.config.toc,hidenohit:true};
      opts.name=query;
      this.sandbox.emit("newtab",opts);
    },
    checkenter:function(e) {
      var query=this.$("#query").val().trim();
      localStorage.setItem("query.cst",query);
      if (e.keyCode!=13) return;
      if (this.hitcount) this.openresult();
    },
    dosearch:function() {
        this.$("#openresult").addClass('disabled');
        var that=this;
    },
    showhitcount:function(count,db) {
       $div=this.$("#matchcount_"+db);
        $openresult=this.$("#openresult");
        $div.html(count);
        
        if (db==this.db) {
          this.hitcount=count;
          if (count) $openresult.removeClass('disabled');
          else $openresult.addClass('disabled');
        }
        if (count) {
          $div.addClass('label-success');
          $div.removeClass('label-danger');
        } else {
          $div.addClass('label-danger');
          $div.removeClass('label-success');
        }      
    },
    gethitcount:function(query) {
      var opts={db:this.config.db,query:query};
      this.$yase("search",opts).done(function(data){
        this.showhitcount(data.doccount,data.opts.db);
      });
    },
    render:function() {
      this.html(_.template(template,{ value:this.options.value||""}) );
      this.$("#query").focus();
      //setTimeout(this.lssearch.bind(this),1000);
    },
    onReady:function() {
    	this.lssearch();
    },	
    lssearch:function() {
        var lsquery=localStorage.getItem("query.cst");
        this.$("#query").val(lsquery).focus();
        this.sendChildren("setquery",lsquery,this.db);
    },
    model:new Backbone.Model(),
    initialize: function() {
      this.config=JSON.parse(config);
      this.db=this.config.db;
      this.render();
   }
  };
});
