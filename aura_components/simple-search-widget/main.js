/*
TODO
  evam me !sutam
  search "evam me"  A
  search "evam me sutam" B
  return A exclude B
  search phrase start with evam me but third is not sutam
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
      "click #opensearchtab":"opensearchtab",
      "click #cleartofind":"cleartofind",
      "click #prefixwith":"prefixwith"
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
    opensearchtab:function() {
      var tofind=this.$el.find("#tofind").val();
      localStorage.setItem("tofind.cst",tofind);
      var opts={};
      opts.tabsid='maintabs';
      opts.widget='simple-result-widget';
      opts.focus=true;
      opts.extra={db:this.db,tofind:tofind,pagebreak:this.config.pagebreak};
      opts.name=tofind;
      this.sandbox.emit("newtab",opts);
    },
    checkenter:function(e) {
      if (e.keyCode!=13) return;

      if (this.hitcount) this.opensearchtab();
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
        this.$el.find("#opensearchtab").addClass('disabled');
        var that=this;
        var tofind=that.$("#tofind").val();
        that.expandtoken(tofind);
        this.timer=setTimeout(function(){
          that.expandtoken(that.getends(tofind));
          that.gethitcount(tofind);
        },300);
    },
    gethitcount:function(tofind) {
      var that=this;
      var opts={db:this.db,tofind:tofind,rawcountonly:true};
      this.sandbox.yase.phraseSearch(opts,function(err,data){
        $div=that.$el.find("#matchcount");
        $panel=that.$el.find("#matchpanel");
        $opensearchtab=that.$el.find("#opensearchtab");
        $div.html(data);
        that.hitcount=data;
        if (data) {
          $panel.removeClass('panel-danger');
          $div.addClass('label-success');
          $panel.addClass('panel-success');
          $div.removeClass('label-danger');
          $opensearchtab.removeClass('disabled');
        } else {
          $div.addClass('label-danger');
          $div.removeClass('label-success');
          $panel.addClass('panel-danger');
          $panel.removeClass('panel-success');
          $opensearchtab.addClass('disabled');
        }
      });
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
