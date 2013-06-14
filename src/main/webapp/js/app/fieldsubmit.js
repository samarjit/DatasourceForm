define({
    load: function (name, req, load, config) {
        //req has the same API as require().
        req([name], function (value) {
            load(value);
        });
    },
    
    /**
     * @formselector  any selector to find the form relative to which fields will be searched
     * @fieldlist array of fieldids 
     */
    getFieldObj: function (formselector, fieldlist){
    	
    	var submitObj = {};
    	$.each(fieldlist,function (i,v){
    		  submitObj[v] = $(formselector).find("#"+v).val();		
    	});
    	 
    	return JSON.stringify(submitObj);
	},
	getFieldObjByName: function (formselector, fieldlist){
		
		var submitObj = {};
		$.each(fieldlist,function (i,v){
			submitObj[v] = $(formselector).find("input[name='"+v+"']").val();		
		});
		
		return JSON.stringify(submitObj);
	},
	createSubmitDataObj: function(screenName,bulkcmd,formselector,fieldlist){
		var submitObj = {};
		var arglength = arguments.length;
		
		for( var i = 2; i < arglength; i+=2){
			formselector = arguments[i];
			fieldlist = arguments[i+1];
			if(formselector != null && $.isArray(fieldlist)){
				$.each(fieldlist,function (i,v){
					submitObj[v] = $(formselector).find("#"+v).val();		
				});
			} 
				
		}
    	var submitdataobj = {screenName:screenName,bulkcmd: bulkcmd, submitdata: JSON.stringify(submitObj)};
    	return  submitdataobj;
	},
    
	createSubmitDataObjByName: function(screenName,bulkcmd,formselector,fieldlist){
		var submitObj = {};
		var arglength = arguments.length;
		
		for( var i = 2; i < arglength; i+=2){
			formselector = arguments[i];
			fieldlist = arguments[i+1];
			if(formselector != null && $.isArray(fieldlist)){
				$.each(fieldlist,function (i,v){
					submitObj[v] = $(formselector).find("input[name='"+v+"']").val();		
				});
			} 
				
		}
		
		var submitdataobj = {screenName:screenName,bulkcmd: bulkcmd, submitdata: JSON.stringify(submitObj)};
		return  submitdataobj;
	},
	serializeForm: function(form) {
		var result = {};
		$.each( $( form ).serializeArray(), function( index, object ) {
			if ( result[ object.name ] ) {
				if ( $.type( result[ object.name ] ) !== "array" ) {
					result[ object.name ] = [ result[ object.name ] ];
				}
				result[ object.name ].push( object.value );
			} else {
				result[ object.name ] = object.value;
			}
		});
		return result;
	}
	 
	
} );
 
function serializeForm(form) {
	var result = {};
	$.each( $( form ).serializeArray(), function( index, object ) {
		if ( result[ object.name ] ) {
			if ( $.type( result[ object.name ] ) !== "array" ) {
				result[ object.name ] = [ result[ object.name ] ];
			}
			result[ object.name ].push( object.value );
		} else {
			result[ object.name ] = object.value;
		}
	});
	return result;
}
 