define({
	loadCss: function(csslist, theme, callback){
		var cssmap = {jqueryui: ["http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css"],
				jqgrid:["plugins/ui.jqgrid.css","plugins/jquerygrid/jquery.ui.grid.css"],
				uixtree:["plugins/jquery.uix.tree.css"],
				idct:["idct/body.css","idct/tabmenu.css"],
				layout:["plugins/jquery-layout.css"],
				codemirror:["plugins/codemirror.css"],
				uigrid: ["http://view.jqueryui.com/grid/themes/base/jquery.ui.grid.css"]
				};
		 
			$('link').remove();
			if(theme == null){
				console.log("loading default theme.. "); theme ="";
			}
			
			 var filesToLoad = 0,
		      file,
		      obj,
		      newStylesheetIndex = document.styleSheets.length-1;
			  
			$.each(csslist, function(i,v){
				
				for(var i in cssmap[v]){
					
				   var file = "";
				   if(cssmap[v][i].indexOf("http") > -1){
					   file = cssmap[v][i];
				   }else{
					   file = "../css/"+theme+"/"+cssmap[v][i];
				   }
					   
				   
				   
				   console.log('loading ..'+file);
//				   var link = document.createElement("link");
//				   link.type = "text/css";
//				   link.rel = "stylesheet";
//				   link.href = file;
//				   document.getElementsByTagName("head")[0].appendChild(link); 
				   
				   	filesToLoad++;
				   //  var file = files[index];
				    if(getFileType(file)=='css') {
				      appendStylesheet(file);
				      newStylesheetIndex++;
				      if(!window.opera && navigator.userAgent.indexOf("MSIE") == -1){
				        callCallbackForStylesheet(newStylesheetIndex);
				      }
				    }
				    
				    if(getFileType(file)=='js') {
				      appendScriptAndCallCallback(file);
				    }
				    
				}
				
			});
			
			
		  
			 	  function getFileType(file) {
				    file = file.toLowerCase()
				  
				    var jsIndex = file.indexOf('js'),
				        cssIndex = file.indexOf('css');
				    
				    if(jsIndex==-1 && cssIndex==-1)
				      return false;
				    
				    if(jsIndex > cssIndex)
				      return 'js';
				    else
				      return 'css';
				  }
				  
				  function appendStylesheet(url) {
				    var oLink = document.createElement("link")
				    oLink.href = url;
				    oLink.rel = "stylesheet";
				    oLink.type = "text/css";
				    oLink.onload = decrementAndCallGlobalCallback;
				    oLink.onreadystatechange= function () { if(this.readyState == 'loaded' || this.readyState == 'complete') decrementAndCallGlobalCallback(); }
				    document.getElementsByTagName("head")[0].appendChild(oLink);
				  }
				  
				  function callCallbackForStylesheet(index) {

				    try {
				        if (document.styleSheets[index].cssRules) {
				            decrementAndCallGlobalCallback();
				        } else {
				            if (document.styleSheets[index].rules && document.styleSheets[index].rules.length) {
				                decrementAndCallGlobalCallback();
				            } else {
				                setTimeout(function() {
				                  callCallbackForStylesheet(index);
				                }, 250);
				            }
				        }
				    }
				    catch(e) {
				        setTimeout(function() {
				          callCallbackForStylesheet(index);
				        }, 250);
				    }

				  }
				  
				  function appendScriptAndCallCallback(url) {
				    var oScript = document.createElement('script');
				    oScript.type = 'text/javascript';
				    oScript.src = url;
				    oScript.onload = decrementAndCallGlobalCallback;
				    document.getElementsByTagName("head")[0].appendChild(oScript);
				  }

				  function decrementAndCallGlobalCallback() {
				    filesToLoad--;
				    if(filesToLoad == 0 && callback != null)
				      callback();
				  }
		  
		 	
	}
 
});
