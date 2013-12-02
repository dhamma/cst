/*
TODO
  evam me sutam!
  search "evam me"  A
  search "evam me sutam" B
  return A exclude B
  search phrase start with evam me but third is not sutam


  search MUL, TIK , ATT at the same time
*/
define(['underscore','backbone','text!./template.tmpl',
  'text!./candidates.tmpl','text!./expanded.tmpl','text!../config.json'], 
  function(_,Backbone,template,candidatetemplate,expandedtemplate,config) {
  return {
    type: 'Backbone.nested', 
    events: {
    	"input #query":"dosearch",
      "click .diacritictoken":"diacritictokenclick",
      "click .inputcandidate":"diacritictokenclick",
      "keyup #query":"checkenter",
      "click .openresult":"openresult",
      "click #clearquery":"clearquery",
      "click #prefixwith":"prefixwith",
      "click input[name='vriset']":"selectset",
    },
    commands:{
      "gotosource":"gotosource"
    },
    gotosource:function(opts) {
      var extra={db:opts.db,start:opts.slot,scrollto:"",query:opts.query}
      var query=this.model.get('query');
      var opts={widget:"text-widget",name:query,extra:extra,focus:true};
      this.sandbox.emit("newtab",opts);
    }, 
    selectset:function(e) {
      $e=$(e.target);
      var id=$e.attr('id');
      this.db=id;
      this.dosearch();
    },
    removeop:function(val) {
      if (val[val.length-1]=='*') val=val.substring(0,val.length-1);
      return val;
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
      if (e.keyCode!=13) return;

      if (this.hitcount) this.openresult();
    },
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
    getlastword:function(query) {
        var endwith=query;
        var lastspace=query.lastIndexOf(" ");
        if (lastspace>-1) {
          endwith=query.substring(lastspace+1);
        }
        return endwith;
    },
    dosearch:function() {
        if (this.timer) clearTimeout(this.timer);
        this.$("#openresult").addClass('disabled');
        var that=this;
        var query=that.$("#query").val().trim();
        if (!query) {
          this.$("#searchhelp").show();
        } else {
          this.$("#searchhelp").hide();
        }
        if (!query) return;
        that.getTermVariants(query);
        this.timer=setTimeout(function(){
          that.getTermVariants(that.getlastword(query));
          that.gethitcount(query);
        },300);
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
      /*
      for (var i in this.config.linkdb) {
        var opts={db:this.config.linkdb[i],query:query,rawcountonly:true};
        this.sandbox.yase.phraseSearch(opts,
          (function(db) {
            return function(err,data){
             that.showhitcount(data,db);
            }
          })(opts.db)
        );
      }
      */
    },
    getTermVariants:function(val) {
      val=this.removeop(val);
      var opts={db:this.db,term:val,lengths:true};
      var that=this;
      //
      //if (val.length<2) return;
      this.sandbox.$yase("getTermVariants",opts).done(function(data){
        var $querycandidates=that.$("#querycandidates")
        $querycandidates.html(" ");

        if (!val) return;
        if (data.expanded.length!=1)
          that.$("#querycandidates").html(
            _.template(candidatetemplate,{candidate:data.expanded,lengths:data.lengths,more:data.more}));
        
      })
      //need a new opts for web
      var opts={db:this.db,term:val,lengths:true,exact:true};
      this.sandbox.$yase("getTermVariants",opts).done(function(data){
        var $expanded=that.$("#expanded");
        $expanded.html(" ");
        if (!val) return;
        if (data.expanded[0]!=1 || data.expanded[0]!=val)
          $expanded.html(_.template(expandedtemplate,{expanded:data.expanded,lengths:data.lengths}));
      })
    },
    render:function() {
      this.html(_.template(template,{ value:this.options.value||""}) );
      this.$("#query").focus();
    },
    initialize: function() {
      console.log('simple search initialized')
     	this.render();
      var that=this;
      this.model=new Backbone.Model();
      this.config=JSON.parse(config);
      this.db=this.config.db;
     // this.$yase=this.sandbox.$yase.bind(this);
      setTimeout(function(){
        that.$("#query").val(localStorage.getItem("query.cst"));
        that.dosearch();
      },100)
    }
  };
});
