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
  'text!./orphrase.tmpl','text!./newphrase.tmpl','text!../config.json'], 
  function(_,Backbone,template,orphrasetemplate,newphrasetemplate,config) {
  return {
    type: 'Backbone', 
    events: {
      "click .diacritictoken":"diacritictokenclick",
      "click .inputcandidate":"diacritictokenclick",
      "keyup #tofind":"checkenter",
      "click #openresult":"openresult",
      "click #cleartofind":"cleartofind",
      "click input[name='vriset2']":"selectset",
      "click #newphrase":"newphrase",
      "click #removephrase":"removephrase",
      "click #searchmode":"searchmode",
      "click #orphrase":"orphrase",
      "click #removeorphrase":"removeorphrase",
      "input .tofind":"dosearch"
    },

    removeorphrase:function(e) {
      $e=$(e.target);
      $e.parent().remove();
      this.dosearch();
    },
    orphrase:function(e) {
      $e=$(e.target);
      var $input=$e.parent().parent().find("input").last();
      if ($input.val()) {
        $input.parent().after(_.template(orphrasetemplate,{}) );  
      } 
      $e.parent().parent().find("input").last().focus();
    },
    searchmode:function(e) {
      $e=$(e.target);
      var mode=$e.data('mode');
      var text=$e.html();
      var $btn=$e.parent().parent().parent().find("button");
      $btn.html(text);
      $btn.data('mode',mode);
      this.dosearch();
    },
    removephrase:function(e) {
      $e=$(e.target);
      $e.parent().parent().remove();
      this.dosearch();
    },
    newphrase:function(e) {
      $e=$(e.target)
      var $phrases=this.$el.find("#phrases");
      var $input=$e.parent().parent().find("input").last();
      if ($phrases.find("input").last().val()) {
        $phrases.append(_.template(newphrasetemplate,{}) );  
      }
      $phrases.find("input").last().focus();
    },
    selectset:function(e) {
      $e=$(e.target);
      var id=$e.attr('id');
      this.db=id;
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
    getends:function(tofind) {
        var endwith=tofind;
        var lastspace=tofind.lastIndexOf(" ");
        if (lastspace>-1) {
          endwith=tofind.substring(lastspace+1);
        }
        return endwith;
    },
    constructquery:function() {
      var phrases=this.$el.find("#phrases");
      var $ip=phrases.find("input");
      var querygroups=[ [] ];
      var lastop='';

      for (var i=0;i<$ip.length;i++) {
        var $i=$($ip[i]);
        var mode=$i.data('mode');
        if (mode=='and') {
          if (querygroups[querygroups.length-1].length) {
            if (lastop) querygroups.push(lastop);
            querygroups.push([]);            
          }
          lastop=$i.parent().parent().find('button').data('mode');
        }
        if ($i.val()) querygroups[querygroups.length-1].push( $i.val());
      }
      if (querygroups[querygroups.length-1].length==0) {
        querygroups.pop();
      } else {
        if (lastop) querygroups.push(lastop);  
      }
      

      console.log(querygroups)
    },
    dosearch:function() {
        if (this.timer) clearTimeout(this.timer);
        this.$el.find("#openresult").addClass('disabled');
        var that=this;
        this.timer=setTimeout(function(){
          that.constructquery();  
        },800);
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
        var opts={db:this.config.linkdb[i],tofind:tofind,rawcountonly:true};
        this.sandbox.yase.phraseSearch(opts,
          (function(db) {
            return function(err,data){
             that.showhitcount(data,db);
            }
          })(opts.db)
        );
      }
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
