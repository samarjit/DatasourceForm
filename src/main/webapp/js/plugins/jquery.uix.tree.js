(function($, undefined) {

$.widget("uix.tree",{
	
 options: {
	  version: "0.1",	  
      icons: { // object : define the node icons
        expandible: "ui-icon-triangle-1-e",
      	expanded: "ui-icon-triangle-1-se",
        // when the node is expanded (default: "ui-icon-triangle-1-se")
        leaf: "ui-icon-stop" // when the node is collapsed (default: "ui-icon-triangle-1-e")
      },
      elementIdCounter:0,
      hide: "slideUp",
      // boolean, number, string or object : define the default hide and show behaviour
      show: "slideDown",
      //    see : http://api.jqueryui.com/jQuery.widget/#option-hide
      toggleMode: "dblclick" // "click", "dblclick", etc. : set the node toggle mode (default: "click")
    },

    _create: function() {
      
      if(this.options.json != null){
    	  this._makeJsonLeftMenu(this.options.json);
      }
      this._buildTree();
      
    },
    _buildTree: function (){
    	
    	if(this.element.is("ul")){
    		this.ulelement = this.element;
    	}else if(this.element.children("ul").first().is("ul")){
    		this.ulelement = this.element.children("ul").first();
    	}else{
    		console.log("Error - cannot find 'ul' as the element of menu or its immediate children of supplied element");
    		return;
    	}
    	
    	this.ulelement.attr("role","tree")
    		.addClass("ui-widget ui-widget-content uix-tree")
    		.css("border","none")
    		.css("padding-left","15px");
    	this.ulelement.find("li").addClass("ui-state-default").css("list-style","none");
    	this.ulelement.find("li a").parent().append($("<span>"));
    	 
    	
    	var that = this;
    	var anchors = this.ulelement.find("li a");
    	this._hoverable(anchors);
    	
    	
    	//this.element.css("width",this.element.parent().width());
    	this._createTreeRecursive(this.ulelement.children("li"),1 );
    	/*if(this.element[0].nodeName.toLowerCase() == "ul"){
    		this._createTreeRecursive(this.ulelement.children("li"),1 );
    	}else if(this.element.children("ul").first().is("ul")){
    		this._createTreeRecursive(this.element.children("ul").first().children("li"),1 );
    	}else{
    		
    	}*/
    	/*this.element.children("li").each(function(i,v){
    		if($(v).find("ul").length > 0){
    			//subtree available
			  $(v)._on(function(evt)){
				 $("ul", evt.currnetTarget).show();
				 $(v).children("span").removeClass(that.options.icons.expandible);
				 
			  }
    			$(v).find("ul").hide();
    			$(v).children("span").addClass("ui-icon uix-tree-handle").addClass(that.options.icons.expandible);
    		}else{
    			$(v).children("span").addClass("ui-icon uix-tree-handle").addClass(that.options.icons.collapsed);
    		}
    		
    		
    	});*/
    	
    },
     
    _createTreeRecursive: function(elms, depth ){
    	//console.log('depth='+depth+"  elmlength="+elms.length);
    	
        var els = $.makeArray(elms);
    	for(var idx in els){
	    	var el = $(els[idx]);
	    	var that = this;
	    	if(el != null &&  el.children("ul").length > 0){
	    		
	    		
	    		
	    		this._on(el,{"click": "_liNodeClick"});
	    		
	    		el.attr("aria-expanded","false");
	    		el.children("ul").hide();
	    		el.children("span").addClass("ui-icon uix-tree-handle").addClass(this.options.icons.expandible);
	    		
	    		/*el.each(function(i,v){
	    			console.log('node='+$(v).children("a").text());
	    		});*/
	    		
	        	
	    		this._createTreeRecursive(el.children('ul').children('li'),depth+1);
	    		
			}else{
				
				//el.on("click",this._leafClick);
				this._on(el, {"click":"_leafClick"}); //use _on to destroy properly on click of disabled 
				
				/*el.each(function(i,v){
					console.log('leaf='+$(v).children("a").text());
				});*/
				el.children("span").addClass("ui-icon uix-tree-handle").addClass(this.options.icons.leaf);
			}
		}
    	
    },
    _liNodeClick: function (evt){
		var tg = $(evt.currentTarget);
		if(tg.attr("aria-expanded") == "true"){ //if visible hide
			this._hideNode(tg);
		}else{                                  //if not visible then show
			this._showNode(tg);
		}
		//console.log("event evt="+evt.currentTarget.id +" "+tg.attr("aria-expanded"));
		evt.stopPropagation();
	},
	_leafClick: function(evt){
    	this.element.find("li").removeClass("ui-state-highlight").addClass("ui-state-default");
    	$(evt.currentTarget).addClass("ui-state-highlight").removeClass("ui-state-default");
    	evt.stopPropagation();
    	//console.log("event evt leaf="+evt.currentTarget.id);
    },
    _showNode: function(jqTg){
    	jqTg.attr("aria-expanded","true");
		jqTg.children("ul").slideDown();
		jqTg.children("span:first").removeClass(this.options.icons.expandible);
		jqTg.children("span:first").addClass(this.options.icons.expanded);
    },
    _hideNode: function (jqTg){
    	jqTg.attr("aria-expanded","false");
		jqTg.children("ul").slideUp();
		jqTg.children("span:first").removeClass(this.options.icons.expanded);
		jqTg.children("span:first").addClass(this.options.icons.expandible);
    },
    
    
    _createUI: function(nodes) {
      return {
        nodes: nodes
      };
    },
    
    _makeJsonLeftMenu: function(jsonMenuPart){
    	/*var jsonMenuPart =  [
    	   {
    		      "children": [
    		         {"label": "Update Refund Details"},
    		         {"label": "Manual Processing"}
    		      ],
    		      "label": "Retention System Card Operations"
    		   },
    		   {
    		      "children": [{
    		         "children": [{
    		            "children": [{"label": "Update Members"}],
    		            "label": "menu802"
    		         }],
    		         "label": "Search page"
    		      }],
    		      "label": "Retention System Customer Service"
    		   }
    		];*/
    	var start = "";
    	start += this._createHtmlRecursive(jsonMenuPart,1);
    	// alert("start "+start);
    	this.element.append(start); 
    	
    	//console.log("making left menu from json"+start);
    	
    	//this._buildTree();
    	
    },
    _createHtmlRecursive: function(jsonPart, depth){
    	
    	var that = this;
    	var start = "<ul>"
    	$.each(jsonPart, function(i,v){
    		
    		that.options.elementIdCounter += 1;
    		
    		if(v.children != null && v.children.length > 0){
    			start  += '<li id="'+that.element[0].id+'_'+that.options.elementIdCounter+'"><a href="#">'+v.label+'</a>';
    			start += that._createHtmlRecursive(v.children, ++depth);
    			start +="</li>";
    		}else{
    			if(v.url  == null)v.url = 'notmappedmenu.html';
    			start  += '<li id="'+that.element[0].id+'_'+that.options.elementIdCounter+'" data-menu=\''+JSON.stringify(v)+'\'><a href="'+v.url+'" target="mainframe">'+v.label+'</a></li>';
    		}
    		
    	});
    	start += "</ul>";
    	return start;
    },
    
    getJsonLeftMenu: function(){
    	
    },
    _setOption: function(key, value) {
      // TODO : implement this
    	this._super(key, value);
    	if(key == "json"){
    		this.options.json = value;
    		this.refresh();
    	}else{
    		console.log("_setOption - unknown options key "+key+" "+value)
    	}
    },

    refresh: function() {
      // TODO : destroy and rebuild the whole tree ???
    	this._destroy();
    	if(this.options.json != null){ //will be null if this menu is built from html markup. But it will have value if it is build frm json
    		this._makeJsonLeftMenu(this.options.json);
    	}
    	this._buildTree();
    	//console.log(" _rfresh() called");
    },

    _destroy: function() {
      // TODO : remove ARIA, remove classes, remove all added nodes
    	
    	if(this.options.json != null){
    		this.element.empty();
    	}
    	 
    	this.ulelement.find("li a").parent().children("span").remove();
    	this.ulelement.removeAttr("role")
		.removeClass("ui-widget ui-widget-content uix-tree");
    	this.ulelement.find("ul").show();
    	this.ulelement.find("li").removeClass("ui-state-default").css("list-style","circle");
	
    	this._super();
    }
	
});

})(jQuery);

