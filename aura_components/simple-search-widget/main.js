define(['underscore','text!./template.tmpl',
  'text!./candidates.tmpl','text!./expanded.tmpl','text!../config.json'], 
  function(_,template,candidatetemplate,expandedtemplate,config) {
  return {
    type: 'Backbone', 
    events: {
    	"input #tofind":"dosearch",
      "click .diacritictoken":"diacritictokenclick",
      "click #tofindcandidates":"diacritictokenclick",
      "keyup #tofind":"checkenter",
      "click #opensearchtab":"opensearchtab",
      "click #cleartofind":"cleartofind"
    },
    cleartofind:function() {
      this.$el.find("#tofind").val("").focus();
    },
    opensearchtab:function() {
      console.log('open search tab')
    },
    checkenter:function(e) {
      if (e.keyCode!=13) return;

      if (this.hitcount) this.opensearchtab();
    },

    diacritictokenclick:function(e) {
      $e=$(e.target)
      this.$el.find("#tofind").val($e.html());
      this.dosearch();
    },
    dosearch:function() {
        if (this.timer) clearTimeout(this.timer);
        this.$el.find("#opensearchtab").addClass('disabled');
        var that=this;
        var tofind=that.$("#tofind").val();
        that.expandtoken(tofind);
        this.timer=setTimeout(function(){
          
          that.expandtoken(tofind);
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
      var opts={db:this.db,token:val};
      var that=this;
      //
      //if (val.length<2) return;
      this.sandbox.yase.expandToken(opts,function(err,data){
        var $tofindcandidates=that.$el.find("#tofindcandidates")
        $tofindcandidates.html(" ");

        if (!val) return;
        if (data.raw.length!=1)
          that.$el.find("#tofindcandidates").html(_.template(candidatetemplate,{candidate:data.raw}));
        
      })

      opts.exact=true;
      this.sandbox.yase.expandToken(opts,function(err,data){
        var $expanded=that.$el.find("#expanded");
        $expanded.html(" ");
        if (!val) return;
        if (data.raw[0]!=1 || data.raw[0]!=val)
          $expanded.html(_.template(expandedtemplate,{expanded:data.raw}));
      })      
    },
    render:function() {
      this.html(_.template(template,{ value:this.options.value||""}) );
      this.$el.find("#tofind").focus();
    },
    initialize: function() {
     	this.render();
      var that=this;
      this.config=JSON.parse(config);
      this.db=this.config.db;
      setTimeout(function(){
        that.$("#tofind").val(localStorage.getItem("tofind"));
        that.dosearch();
      },100)
    }
  };
});
