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
    type: 'Backbone', 
    events: {
    	"input #tofind":"dosearch",
      "click .diacritictoken":"diacritictokenclick",
      "click .inputcandidate":"diacritictokenclick",
      "keyup #tofind":"checkenter",
      "click #openresult":"openresult",
      "click #cleartofind":"cleartofind",
      "click #prefixwith":"prefixwith",
      "click input[name='vriset']":"selectset",
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
      $tofind=this.$el.find("#tofind");
      var val=$tofind.val().trim();
      val=this.removeop(val);
      $tofind.val(val+"*");
      this.dosearch();
    },
    cleartofind:function() {
      this.$el.find("#tofind").val("").focus();
      this.dosearch();
    },
    openresult:function() {
      var tofind=this.$el.find("#tofind").val().trim();
      localStorage.setItem("tofind.cst",tofind);
      var opts={};
      opts.tabsid='maintabs';
      opts.widget='simple-result-widget';
      opts.focus=true;
      
      //pass to init of sub-widget
      opts.extra={db:this.db,tofind:tofind,
                  pagebreak:this.config.pagebreak,
                  toc:this.config.toc,hidenohit:true};
      opts.name=tofind;
      this.sandbox.emit("newtab",opts);
    },
    checkenter:function(e) {
      if (e.keyCode!=13) return;

      if (this.hitcount) this.openresult();
    },
    replaceends:function(newends) {
      $tofind=this.$el.find("#tofind");
      var tofind=$tofind.val();
      var ends=this.getends(tofind);
      var tofind=tofind.substring(0, tofind.length-ends.length) +newends+'^ ';
      $tofind.val(tofind);
    },
    diacritictokenclick:function(e) {
      $e=$(e.target)
      this.replaceends($e.html());
      this.dosearch();
    },
    getends:function(tofind) {
        var endwith=tofind;
        var lastspace=tofind.lastIndexOf(" ");
        if (lastspace>-1) {
          endwith=tofind.substring(lastspace+1);
        }
        return endwith;
    },
    dosearch:function() {
        if (this.timer) clearTimeout(this.timer);
        this.$el.find("#openresult").addClass('disabled');
        var that=this;
        var tofind=that.$("#tofind").val().trim();
        if (!tofind) {
          this.$el.find("#searchhelp").show();
        } else {
          this.$el.find("#searchhelp").hide();
        }
        that.expandtoken(tofind);
        this.timer=setTimeout(function(){
          that.expandtoken(that.getends(tofind));
          that.gethitcount(tofind);
        },300);
    },
    showhitcount:function(count,db) {
       $div=this.$el.find("#matchcount_"+db);
        $openresult=this.$el.find("#openresult");
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
    gethitcount:function(tofind) {
      var that=this;
      var opts={db:this.config.db,tofind:tofind,rawcountonly:true};
      this.sandbox.yase.phraseSearch(opts,function(err,data){
        that.showhitcount(data,that.config.db);
      });

      for (var i in this.config.linkdb) {
        opts.db=this.config.linkdb[i];
        this.sandbox.yase.phraseSearch(opts,
          (function(db) {
            return function(err,data){
             that.showhitcount(data,db);
            }
          })(opts.db)
        );
      }
    },
    expandtoken:function(val) {
      val=this.removeop(val);
      var opts={db:this.db,token:val,count:true};
      var that=this;
      //
      //if (val.length<2) return;
      this.sandbox.yase.expandToken(opts,function(err,data){
        var $tofindcandidates=that.$el.find("#tofindcandidates")
        $tofindcandidates.html(" ");

        if (!val) return;
        if (data.raw.length!=1)
          that.$el.find("#tofindcandidates").html(
            _.template(candidatetemplate,{candidate:data.raw,count:data.count,more:data.more}));
        
      })

      opts.exact=true;
      this.sandbox.yase.expandToken(opts,function(err,data){
        var $expanded=that.$el.find("#expanded");
        $expanded.html(" ");
        if (!val) return;
        if (data.raw[0]!=1 || data.raw[0]!=val)
          $expanded.html(_.template(expandedtemplate,{expanded:data.raw,count:data.count}));
      })      
    },
    render:function() {
      this.html(_.template(template,{ value:this.options.value||""}) );
      this.$el.find("#tofind").focus();
    },
    initialize: function() {
     	this.render();
      var that=this;
      this.model=new Backbone.Model();
      this.config=JSON.parse(config);
      this.db=this.config.db;

      setTimeout(function(){
        that.$("#tofind").val(localStorage.getItem("tofind.cst"));
        that.dosearch();
      },100)
    }
  };
});
