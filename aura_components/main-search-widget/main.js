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
      "result.change":"resultchange",
      "needmore":"needmore"
    },
    needmore:function(start) {
      this.sendChildren("more",start);
    },
    resultchange:function(res){
      this.sendDescendant("result.change",res);
    },    
    querychange:function(query,db){
      db=db||this.db;
      this.sendDescendant("query.change",query,db);
      this.sendDescendant('settoc',{toc:this.config.toc,db:db,query:query});

    },
    selectset:function(e) {
      $e=$(e.target);
      var id=$e.attr('id');
      this.db=id;
      this.dosearch();
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
      opts.widget='simple-result-widget';
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
      console.log('main search initialized')
      this.render();
   }
  };
});
