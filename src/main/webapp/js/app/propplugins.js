define("propplugins",function(){
	this.pluginregistry = [];
	this.registerPlugin = function (namespac, callbackSetUpFn , widgetObj){
		this.pluginregistry[namespace] = {callback: callbackSetUpFn, widgetObj: widgetObj  };
		
	}
});